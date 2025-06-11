
export class RateLimiter {
  private attempts: number = 0;
  private lastAttempt: number = 0;
  private readonly maxAttempts: number = 5;
  private readonly windowMs: number = 15 * 60 * 1000; // 15 minutes
  private readonly storageKey: string = 'auth_rate_limit';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.attempts = data.attempts || 0;
        this.lastAttempt = data.lastAttempt || 0;
      }
    } catch (error) {
      console.warn('Failed to load rate limit data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify({
        attempts: this.attempts,
        lastAttempt: this.lastAttempt
      }));
    } catch (error) {
      console.warn('Failed to save rate limit data:', error);
    }
  }

  checkRateLimit(): void {
    const now = Date.now();
    
    // Reset if window has passed
    if (now - this.lastAttempt > this.windowMs) {
      this.attempts = 0;
    }

    if (this.attempts >= this.maxAttempts) {
      const timeLeft = Math.ceil((this.windowMs - (now - this.lastAttempt)) / 1000 / 60);
      throw new Error(`Too many attempts. Please try again in ${timeLeft} minutes.`);
    }

    this.attempts++;
    this.lastAttempt = now;
    this.saveToStorage();
  }

  resetAttempts(): void {
    this.attempts = 0;
    this.lastAttempt = 0;
    this.saveToStorage();
  }

  getRemainingAttempts(): number {
    const now = Date.now();
    if (now - this.lastAttempt > this.windowMs) {
      return this.maxAttempts;
    }
    return Math.max(0, this.maxAttempts - this.attempts);
  }
}
