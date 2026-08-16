export interface EmailResponse {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}

/**
 * Service to handle client-side email triggers that map securely to the backend API.
 */
export const emailService = {
  /**
   * Helper to trigger a POST request to the backend send-email endpoint.
   */
  async sendEmail(to: string, subject: string, html: string): Promise<EmailResponse> {
    try {
      const response = await fetch('/api/auth/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, html }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Server failed to send email' };
      }

      return await response.json() as EmailResponse;
    } catch (err: any) {
      console.error('[EmailService] Failed to send email via API:', err);
      return { success: false, error: err.message || 'Network error' };
    }
  },

  /**
   * Sends a beautiful Welcome Email when a new business signs up.
   */
  async sendWelcomeEmail(email: string, fullName: string, companyName: string): Promise<EmailResponse> {
    const subject = 'Welcome to Chronix! 🚀';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #193A5B; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Chronix!</h1>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6;">
          <h2 style="color: #193A5B; margin-top: 0;">Hello, ${fullName} 👋</h2>
          <p>Thank you for registering <strong>${companyName}</strong> with <strong>Chronix</strong> — the leading Workforce Attendance & Management platform built for Mauritian businesses.</p>
          <p>Your account is now active under the business profile you created. You can manage employees, track attendance, and handle leaves and reimbursements with ease.</p>
          <div style="margin: 24px 0; text-align: center;">
            <a href="${window.location.origin}/login" style="background-color: #F3AE2C; color: #193A5B; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 4px; display: inline-block;">Go to Dashboard</a>
          </div>
          <p>If you have any questions or need help setting up your team, feel free to contact us.</p>
          <p style="margin-bottom: 0;">Warm regards,<br/>The Chronix Team</p>
        </div>
        <div style="background-color: #f5f8fa; padding: 16px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #e1e8ed;">
          © ${new Date().getFullYear()} Chronix Ltd. Mauritius. All rights reserved.
        </div>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  },

  /**
   * Sends a Login Security Alert when a user logs in.
   */
  async sendLoginAlertEmail(email: string, role: string): Promise<EmailResponse> {
    const subject = 'Security Alert: New sign-in to Chronix 🔒';
    const timeString = new Date().toLocaleString('en-US', {
      timeZone: 'Indian/Mauritius',
      dateStyle: 'medium',
      timeStyle: 'medium',
    }) + ' (Mauritius Time)';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #193A5B; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Sign-In Detected</h1>
        </div>
        <div style="padding: 24px; color: #333333; line-height: 1.6;">
          <h2 style="color: #193A5B; margin-top: 0;">Security Alert 🔒</h2>
          <p>We detected a new sign-in to your Chronix account for the email address <strong>${email}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background-color: #f9fbfd; border-radius: 4px; border: 1px solid #e1e8ed;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e1e8ed; font-weight: bold; color: #555555; width: 120px;">Time:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e1e8ed; color: #333333;">${timeString}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e1e8ed; font-weight: bold; color: #555555;">Access Level:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e1e8ed; color: #333333; text-transform: capitalize;">${role} View</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #555555;">Location:</td>
              <td style="padding: 10px; color: #333333;">Mauritius (IP-based estimation)</td>
            </tr>
          </table>
          <p>If this was you, you can safely ignore this email. If you did not authorize this login, please change your password immediately or contact your administrator.</p>
          <p style="margin-bottom: 0;">Stay secure,<br/>The Chronix Team</p>
        </div>
        <div style="background-color: #f5f8fa; padding: 16px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #e1e8ed;">
          © ${new Date().getFullYear()} Chronix Ltd. Mauritius. All rights reserved.
        </div>
      </div>
    `;

    return this.sendEmail(email, subject, html);
  },
};
