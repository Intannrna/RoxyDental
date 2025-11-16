import crypto from 'crypto';

export class EmailService {
  private resetTokens: Map<string, { token: string; expiry: Date }> = new Map();

  generateResetToken(email: string): string {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);
    
    this.resetTokens.set(email, { token, expiry });
    
    return token;
  }

  verifyResetToken(email: string, token: string): boolean {
    const stored = this.resetTokens.get(email);
    
    if (!stored) {
      return false;
    }

    if (stored.token !== token) {
      return false;
    }

    if (new Date() > stored.expiry) {
      this.resetTokens.delete(email);
      return false;
    }

    return true;
  }

  clearResetToken(email: string): void {
    this.resetTokens.delete(email);
  }

  async sendResetEmail(email: string, token: string): Promise<void> {
    console.log(`
      ========================================
      PASSWORD RESET TOKEN
      ========================================
      Email: ${email}
      Token: ${token}
      Reset Link: ${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}
      Expires: 1 hour
      ========================================
    `);
  }
}

export const emailService = new EmailService();