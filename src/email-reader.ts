
import Imap from 'imap';
import { simpleParser } from 'mailparser';
import type { EmailConfig, EmailSubject } from './types.js';

export class EmailReader {
    /**
     * Get only today's email subjects from the mailbox
     * @returns Promise that resolves with array of EmailSubject objects from today
     */
   async getTodaysEmailSubjects(): Promise<EmailSubject[]> {
      const allEmails = await this.getEmailSubjects();
      const now = new Date();
      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth();
      const todayDate = now.getDate();
      return allEmails.filter(e => {
        if (!e.date) return false;
        const d = new Date(e.date);
        return (
          d.getFullYear() === todayYear &&
          d.getMonth() === todayMonth &&
          d.getDate() === todayDate
        );
      });
    }
  private imap: Imap;
  private config: EmailConfig;

  /**
   * Constructor - creates IMAP connection instance
   * @param config - Email configuration (host, port, user, password, etc.)
   */
  constructor(config: EmailConfig) {
    this.config = config;
    
    // TODO: Create new Imap instance with config
    // Use: new Imap({ user, password, host, port, tls })
    this.imap = new Imap({
      user: config.user,
      password:config.password,
      host:config.host,
      port:config.port,
      tls:config.tls,
      tlsOptions: { rejectUnauthorized: false }
      });
  }

  /**
   * Connect to the email server
   * @returns Promise that resolves when connected
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('ready', () => {
        console.log('Connected to email server');
        resolve();
      });
      this.imap.once('error', (err) => {
        console.error('Error connecting to email server', err);
        reject(err);
      });
      this.imap.connect();
	  });
  }
  // ...existing code...

  /**
   * Get all email subjects from the mailbox
   * @returns Promise that resolves with array of EmailSubject objects
   */
  async getEmailSubjects(): Promise<EmailSubject[]> {
    return new Promise((resolve, reject) => {
      this.imap.openBox(this.config.mailbox || 'INBOX', false, (error, mailbox) => {
        if (error) {
          console.error('Failed to open mailbox:', error);
          reject(error);
          return;
        }
        console.log('Mailbox opened:', mailbox);
        this.imap.search(['ALL'], (err, results) => {
          if (err) {
            console.error('Search error:', err);
            reject(err);
            return;
          }
          console.log('Search results:', results);
          if (results.length === 0) {
            resolve([]);
            return;
          }
          const emails: EmailSubject[] = [];
          const parsePromises: Promise<void>[] = [];
          const fetch = this.imap.fetch(results, { bodies: 'HEADER.FIELDS (FROM SUBJECT DATE)', struct: true });
          fetch.on('message', (msg, seqno) => {
            console.log('Processing message #%d', seqno);
            let emailBuffer = '';
            msg.on('body', (stream, info) => {
              stream.on('data', (chunk) => {
                emailBuffer += chunk.toString('utf8');
              });
            });
            const parsePromise = new Promise<void>((res) => {
              msg.once('end', async () => {
                try {
                  const parsed = await simpleParser(emailBuffer);
                  emails.push({
                    from: parsed.from?.text || '',
                    subject: parsed.subject || '',
                    date: parsed.date || new Date(0),
                  });
                } catch (parseErr) {
                  console.error('Error parsing email:', parseErr);
                }
                res();
              });
            });
            parsePromises.push(parsePromise);
          });
          fetch.once('end', () => {
            console.log('All messages processed');
            Promise.all(parsePromises).then(() => {
              resolve(emails);
            });
          });
        });
      });
    });
  }

  
  /**
   * Close the IMAP connection
   */
  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.imap.once('close', () => {
        console.log('IMAP connection closed');
        resolve();
      });
      this.imap.once('error', (err) => {
        console.error('Error closing IMAP connection', err);
        reject(err);
      });
      this.imap.end();
    });
  }
}
