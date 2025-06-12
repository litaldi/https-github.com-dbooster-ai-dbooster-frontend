
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  checkRateLimit(identifier: string = 'default'): void {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return;
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return;
    }

    if (userAttempts.count >= this.maxAttempts) {
      const timeLeft = Math.ceil((this.windowMs - (now - userAttempts.lastAttempt)) / 1000 / 60);
      throw new Error(`Too many attempts. Please try again in ${timeLeft} minutes.`);
    }

    userAttempts.count++;
    userAttempts.lastAttempt = now;
  }

  resetAttempts(identifier: string = 'default'): void {
    this.attempts.delete(identifier);
  }
}
