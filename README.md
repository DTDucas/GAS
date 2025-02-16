# 🔐 Google Sheets Column Protection

A Google Apps Script that provides password protection for sensitive columns in Google Sheets, preventing unauthorized access and modifications.

[![GitHub stars](https://img.shields.io/github/stars/DTDucas/GAS?style=social)](https://github.com/DTDucas/GAS)

> 💡 If you find this script helpful, please consider giving it a star on GitHub! ⭐

## ✨ Features

- 🔒 Password-protected column hiding
- ⏳ Temporary access with auto-lock after 5 minutes
- 🛡️ Prevents manual unhiding of protected columns
- 🚨 Automatic protection restoration if tampering is detected
- 📱 User-friendly interface with emoji icons
- 🔑 Secure password storage using Script Properties

## 📋 Prerequisites

- A Google Account
- Access to Google Sheets
- Basic understanding of Google Apps Script

## 🚀 Installation

1. Open your Google Sheet
2. Go to `Extensions > Apps Script`
3. Copy the contents of `Code.js` into the script editor
4. Replace the protected columns in the `PROTECTED_COLUMNS` array with your desired column numbers:
   ```javascript
   const PROTECTED_COLUMNS = [3, 5, 7]; // Example: columns C, E, G
   ```
5. Save the script
6. Run the `initialSetup` function
7. Set your desired password when prompted

## 🛠️ Usage

After installation, you'll see a new menu item "🔐 Data Protection" in your Google Sheet with two options:

- 🔒 **Lock Columns**: Manually lock and hide protected columns
- 🔓 **Temporary Unlock**: Enter password to temporarily view protected columns

### Important Notes:
- Protected columns will automatically hide after 5 minutes of being revealed
- Only the sheet owner can modify protection settings
- The script will automatically detect and prevent unauthorized unhiding attempts

## ⚙️ Configuration

You can modify these settings in the code:

- Change protected columns in `PROTECTED_COLUMNS` array
- Modify the visibility timeout (default: 5 minutes) in the `temporaryUnhide` function
- Customize alert messages and menu items

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## ⭐ Support

If you find this script useful, please consider:
1. Giving it a star on GitHub
2. Sharing it with others who might benefit
3. Contributing to its improvement

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

If you have any questions or suggestions, feel free to open an issue on GitHub.

---

Created with ❤️ by DTDucas aka Duong Tran

> 🌟 **Did this help your workflow? Show your support by starring this repository!** ⭐
