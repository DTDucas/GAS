const PROTECTED_COLUMNS = [3, 5, 7];
const PASSWORD_KEY = 'SHEET_PASSWORD';

function setPassword(password) {
  PropertiesService.getScriptProperties().setProperty(PASSWORD_KEY, password);
}

function checkPassword(input) {
  return input === PropertiesService.getScriptProperties().getProperty(PASSWORD_KEY);
}

function protectColumns() {
  const sheet = SpreadsheetApp.getActiveSheet();
  
  const existingProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  existingProtections.forEach(p => p.remove());
  
  PROTECTED_COLUMNS.forEach(colNum => {
    const range = sheet.getRange(1, colNum, sheet.getMaxRows(), 1);
    const protection = range.protect();
    
    protection.setDescription(`🔒 Protected Column ${colNum}`);
    protection.removeEditors(protection.getEditors());
    protection.addEditor(Session.getEffectiveUser().getEmail());
    
    sheet.hideColumns(colNum);
  });
  
  const sheetProtection = sheet.protect();
  sheetProtection.setDescription('🛡️ Sheet Protection');
  sheetProtection.removeEditors(sheetProtection.getEditors());
  sheetProtection.addEditor(Session.getEffectiveUser().getEmail());
}

function checkProtections() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const protections = sheet.getProtections(SpreadsheetApp.ProtectionType.RANGE);
  
  return PROTECTED_COLUMNS.every(colNum => {
    return protections.some(p => {
      const range = p.getRange();
      return range.getColumn() === colNum && 
             range.getNumColumns() === 1 &&
             range.getRow() === 1 &&
             range.getNumRows() === sheet.getMaxRows();
    });
  });
}

function temporaryUnhide(password) {
  if (!checkPassword(password)) {
    throw new Error('❌ Incorrect password!');
  }
  
  const sheet = SpreadsheetApp.getActiveSheet();
  
  const sheetProtections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  sheetProtections.forEach(p => p.remove());
  
  PROTECTED_COLUMNS.forEach(colNum => {
    sheet.showColumns(colNum);
  });
  
  ScriptApp.newTrigger('reprotectAfterTimeout')
    .timeBased()
    .after(5 * 60 * 1000)
    .create();
  
  SpreadsheetApp.getUi().alert(
    '🔓 Columns Unlocked',
    '⏳ Protected columns are temporarily visible.\n\n⚠️ They will be automatically hidden and locked after 5 minutes.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

function reprotectAfterTimeout() {
  protectColumns();
  
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'reprotectAfterTimeout') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🔐 Data Protection')
    .addItem('🔒 Lock Columns', 'protectColumns')
    .addItem('🔓 Temporary Unlock', 'showPasswordDialog')
    .addToUi();
}

function showPasswordDialog() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '🔐 Security Authentication',
    '🔑 Please enter password to temporarily unlock protected columns:',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() === ui.Button.OK) {
    try {
      temporaryUnhide(result.getResponseText());
    } catch (e) {
      ui.alert(
        '❌ Error',
        '⚠️ ' + e.message,
        ui.ButtonSet.OK
      );
    }
  }
}

function initialSetup() {
  setPassword('your_secure_password_here');
  
  protectColumns();
  
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  ScriptApp.newTrigger('onEdit')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onEdit()
    .create();
}

function onEdit(e) {
  if (!checkProtections()) {
    protectColumns();
    SpreadsheetApp.getUi().alert(
      '🚨 Security Alert',
      '⚠️ Unauthorized changes detected!\n\n✅ Protection has been restored.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}
