/**
 * Reads an array of emails aloud, one at a time, including sender and subject.
 * @param emails Array of objects with 'from' and 'subject' fields
 */
export function readEmailsAloud(emails: { from: string; subject: string }[]): void {
  if (!emails.length) {
    say.speak('You have no emails for today.');
    return;
  }
  say.speak(`You have ${emails.length} emails for today.`, undefined, undefined, () => {
    readNext(0);
  });

  function readNext(i: number) {
    if (i >= emails.length) return;
      const email = emails[i];
      // Clean and limit the sender and subject for TTS
      let cleanFrom = (email.from || 'Unknown sender').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanFrom.length > 60) {
        cleanFrom = cleanFrom.slice(0, 60) + '...';
      }
      let cleanSubject = (email.subject || 'No subject').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleanSubject.length > 100) {
        cleanSubject = cleanSubject.slice(0, 100) + '...';
      }
      const emailNumber = i + 1;
      console.log(`Reading aloud: Email ${emailNumber} From: ${cleanFrom}`);
      say.speak(`Email ${emailNumber}. From: ${cleanFrom}`, undefined, undefined, () => {
        console.log(`Reading aloud: Subject: ${cleanSubject}`);
        say.speak(`Subject: ${cleanSubject}`, undefined, undefined, () => {
          readNext(i + 1);
        });
      });
  }
}
// Utility to speak out text using Node.js
import say from 'say';

/**
 * Speaks out the given text using system TTS
 * @param text The text to speak
 */
export function speakText(text: string): void {
  say.speak(text);
}
