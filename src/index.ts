// Main Entry Point
// This file orchestrates the email scraping process

import dotenv from 'dotenv';
import { EmailReader } from './email-reader.ts';
import { CSVWriter } from './csv-writer.ts';
import type { EmailConfig } from './types.js';
import { readEmailsAloud } from './speech-util.ts';

// Load environment variables from .env file
dotenv.config();

/**
 * Load email configuration from environment variables
 * @returns EmailConfig object
 */
function loadConfig(): EmailConfig {
  // TODO: Read from process.env and create EmailConfig
  // Required: EMAIL_USER, EMAIL_PASSWORD, IMAP_HOST, IMAP_PORT
  // Optional: MAILBOX (default: 'INBOX')
  
  return {
    host: process.env.IMAP_HOST || '', 
    port: process.env.IMAP_PORT ? parseInt(process.env.IMAP_PORT) : 993,  
    user: process.env.EMAIL_USER || '', 
    password: process.env.EMAIL_PASS || '', 
    tls: true, // Usually true for port 993
    mailbox: process.env.MAILBOX || 'INBOX'
  };
}

/**
 * Main execution function
 */
async function main(): Promise<void> {
  try {
    // TODO: Load configuration
    const config = loadConfig();
    
    // TODO: Create EmailReader instance
    const reader = new EmailReader(config);
    
    // TODO: Connect to server
    await reader.connect();
    
    // Fetch only today's email subjects
    const emails = await reader.getTodaysEmailSubjects();

    // Read email subjects aloud (one at a time, with sender)
    readEmailsAloud(emails.map(e => ({ from: e.from, subject: e.subject })));

    // Write to CSV
    const writer = new CSVWriter();
    const outputFile = process.env.OUTPUT_FILE || 'emails.csv';
    await writer.writeToFile(emails, outputFile);

    // Close connection
    await reader.close();

    console.log('✅ Email scraping completed!');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run main function
main();
