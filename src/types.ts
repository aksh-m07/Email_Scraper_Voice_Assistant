export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  tls: boolean;
  mailbox?: string;
}

export interface EmailSubject {
  subject: string;
  from: string;
  date: string;
  uid?: number;
}

