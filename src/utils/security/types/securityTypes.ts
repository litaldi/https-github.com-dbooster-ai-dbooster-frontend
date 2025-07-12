
export interface SecurityInitializationConfig {
  environment: string;
  timestamp: string;
}

export interface SecurityStatus {
  initialized: boolean;
  errors: string[];
}
