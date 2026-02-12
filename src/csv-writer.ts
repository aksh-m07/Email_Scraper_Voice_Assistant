// CSV Writer Module
// This module writes email data to CSV files

import { createObjectCsvWriter } from 'csv-writer';
import type { EmailSubject } from './types.js';

/**
 * CSVWriter class - handles writing email data to CSV files
 */
export class CSVWriter {
  /**
   * Write email data to CSV file
   * @param data - Array of EmailSubject objects
   * @param filePath - Path to output CSV file
   */
  async writeToFile(data: EmailSubject[], filePath: string): Promise<void> {
    // TODO: Create CSV writer
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'subject', title: 'Subject' },
        { id: 'from', title: 'From' },
        { id: 'date', title: 'Date' }
      ]
    });
    
    // TODO: Write data to file
    await csvWriter.writeRecords(data);
    // Use: csvWriter.writeRecords(data)
  }

  /**
   * Format date to readable format (optional helper)
   * @param date - ISO date string
   * @returns Formatted date string
   */
  formatDate(date: string): string {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day=String(d.getDate()).padStart(2,'0');
    const year=d.getFullYear();
    return `${month}/${day}/${year}`;
  }
}



