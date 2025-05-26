
interface RateLimitState {
  attemptCount: number;
  lastAttempt: number;
}

export class RateLimiter {
  private state: RateLimitState = {
    attemptCount: 0,
    lastAttempt: 0
  };

  checkRateLimit(): void {
    const now = Date.now();
    const timeDiff = now - this.state.lastAttempt;
    
    // Reset attempt count after 15 minutes
    if (timeDiff > 15 * 60 * 1000) {
      this.state.attemptCount = 0;
    }
    
    // Block if more than 5 attempts in 15 minutes
    if (this.state.attemptCount >= 5 && timeDiff < 15 * 60 * 1000) {
      throw new Error('Too many login attempts. Please try again later.');
    }
    
    this.state.attemptCount += 1;
    this.state.lastAttempt = now;
  }

  resetAttempts(): void {
    this.state.attemptCount = 0;
  }
}
