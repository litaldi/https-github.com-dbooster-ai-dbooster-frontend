
export class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  checkRateLimit(identifier: string = 'default'): void {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return;
    }

    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return;
    }

    if (record.count >= this.maxAttempts) {
      throw new Error(`Rate limit exceeded. Try again later.`);
    }

    record.count++;
    record.lastAttempt = now;
  }

  resetAttempts(identifier: string = 'default'): void {
    this.attempts.delete(identifier);
  }
}
