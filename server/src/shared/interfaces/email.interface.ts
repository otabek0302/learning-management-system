/** Email service options */
export interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

