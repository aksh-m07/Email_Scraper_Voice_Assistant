# Email Subject Scraper 

## 📧 What is this?
This is a Node.js + TypeScript app that connects to your email inbox (via IMAP), fetches today's emails, saves their subjects and senders to a CSV file, and reads them aloud using your computer's voice.

---

## Features
- Connects to any IMAP email account (Gmail, Outlook, etc.)
- Fetches only today's emails
- Saves sender and subject to a CSV file
- Reads each email aloud (sender and subject)

---

## 🛠️ Setup Instructions

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd Email\ subject\ srapper
```

### 2. Install dependencies
```sh
npm install
```

### 3. Set up your `.env` file
Create a file named `.env` in the project root with these variables:
```
EMAIL_USER=your@email.com
EMAIL_PASS=your_app_password
IMAP_HOST=imap.yourmail.com
IMAP_PORT=993
MAILBOX=INBOX
OUTPUT_FILE=emails.csv
```

#### Gmail Users: Enable IMAP and App Passwords
- Go to Gmail settings > Forwarding and POP/IMAP > Enable IMAP
- Enable 2-Step Verification in your Google Account
- Go to Google Account > Security > App Passwords
- Generate an app password for "Mail" and "Other" (copy this, use as EMAIL_PASS)
- Use your normal email as EMAIL_USER
- IMAP_HOST for Gmail: `imap.gmail.com`

#### Outlook/Hotmail Users
- IMAP_HOST: `imap-mail.outlook.com`
- Use an app password if 2FA is enabled

#### Other Providers
- Check your provider's IMAP settings and use the correct host/port

---

## How to Run
```sh
npx ts-node src/index.ts
```
- The app will connect, fetch today's emails, save them to the CSV, and read them aloud.

---

## Voice Assistant
- the app will use your system's default voice to read each email's sender and subject.
- Make sure your speakers are on!

---

##  Output
- The CSV file (default: `emails.csv`) will contain all today's emails with sender and subject.

---

## Troubleshooting
- If you get login errors, double-check your `.env` values and app password.
- If you hear only the sender or subject, check your system's TTS settings.
- For Gmail, you MUST use an app password (not your normal password) if 2-Step Verification is enabled.

---

## Dependencies
- Node.js
- TypeScript
- imap
- mailparser
- csv-writer
- say
- dotenv

---

##  Author
- Aksh Malik

---
