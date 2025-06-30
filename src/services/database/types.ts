
export interface DatabaseConnection {
  id: string;
  name: string;
  type: 'postgresql' | 'mysql' | 'mssql' | 'oracle' | 'mongodb' | 'redis';
  host: string;
  port: number;
  database: string;
  username: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastConnected?: Date;
  schema?: DatabaseSchema;
  performance?: ConnectionPerformance;
}

export interface DatabaseSchema {
  tables: Array<{
    name: string;
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
      primaryKey: boolean;
      foreignKey?: {
        table: string;
        column: string;
      };
    }>;
    indexes: Array<{
      name: string;
      columns: string[];
      unique: boolean;
      type: string;
    }>;
    relationships: Array<{
      table: string;
      type: 'one-to-one' | 'one-to-many' | 'many-to-many';
    }>;
  }>;
  views: Array<{
    name: string;
    definition: string;
  }>;
  functions: Array<{
    name: string;
    parameters: string[];
    returnType: string;
  }>;
}

export interface ConnectionPerformance {
  latency: number;
  throughput: number;
  activeConnections: number;
  maxConnections: number;
  slowQueries: number;
  errorRate: number;
  lastUpdated: Date;
}

export interface ConnectionConfig {
  name: string;
  type: DatabaseConnection['type'];
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  options?: Record<string, any>;
}

export interface QueryResult {
  rows: any[];
  rowCount: number;
  executionTime: number;
  executionPlan?: any;
}
