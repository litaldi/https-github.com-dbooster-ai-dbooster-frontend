
import { DatabaseConnection, ConnectionConfig } from './types';
import { connectionPool } from './connectionPool';
import { queryExecutor } from './queryExecutor';
import { schemaIntrospector } from './schemaIntrospector';
import { performanceMonitor } from './performanceMonitor';
import { productionLogger } from '@/utils/productionLogger';

class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private connections: Map<string, DatabaseConnection> = new Map();

  static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }

  async createConnection(config: ConnectionConfig): Promise<DatabaseConnection> {
    const connectionId = `${config.type}-${config.host}-${config.database}`;
    
    const connection: DatabaseConnection = {
      id: connectionId,
      name: config.name,
      type: config.type,
      host: config.host,
      port: config.port,
      database: config.database,
      username: config.username,
      status: 'connecting'
    };

    this.connections.set(connectionId, connection);

    try {
      // Create connection pool
      await connectionPool.createPool(connectionId, config);

      // Test connection
      await this.testConnection(connectionId);
      
      // Introspect schema
      const schema = await schemaIntrospector.introspectSchema(connectionId, config.type);
      
      // Get performance metrics
      const performance = await performanceMonitor.getPerformanceMetrics(connectionId, config.type);

      const updatedConnection: DatabaseConnection = {
        ...connection,
        status: 'connected',
        lastConnected: new Date(),
        schema,
        performance
      };

      this.connections.set(connectionId, updatedConnection);
      
      // Store connection locally
      await this.storeConnectionLocally(updatedConnection);

      productionLogger.secureInfo(`Database connection established: ${connectionId}`, {
        type: config.type,
        host: config.host,
        database: config.database
      });

      return updatedConnection;
    } catch (error) {
      const errorConnection = {
        ...connection,
        status: 'error' as const
      };
      
      this.connections.set(connectionId, errorConnection);
      
      productionLogger.error(`Database connection failed: ${connectionId}`, error, 'DatabaseConnectionManager');
      throw error;
    }
  }

  async getConnection(connectionId: string): Promise<DatabaseConnection | null> {
    return this.connections.get(connectionId) || null;
  }

  async getAllConnections(): Promise<DatabaseConnection[]> {
    return Array.from(this.connections.values());
  }

  async testConnection(connectionId: string): Promise<boolean> {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    try {
      const testQuery = queryExecutor.getTestQuery(connection.type);
      await queryExecutor.executeQuery(connectionId, testQuery);
      return true;
    } catch (error) {
      productionLogger.error(`Connection test failed: ${connectionId}`, error, 'DatabaseConnectionManager');
      return false;
    }
  }

  async executeQuery(connectionId: string, query: string, params?: any[]) {
    return queryExecutor.executeQuery(connectionId, query, params);
  }

  async introspectSchema(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    return schemaIntrospector.introspectSchema(connectionId, connection.type);
  }

  async getPerformanceMetrics(connectionId: string) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }
    return performanceMonitor.getPerformanceMetrics(connectionId, connection.type);
  }

  async closeConnection(connectionId: string): Promise<void> {
    await connectionPool.closePool(connectionId);
    this.connections.delete(connectionId);
  }

  private async storeConnectionLocally(connection: DatabaseConnection): Promise<void> {
    try {
      const connections = JSON.parse(localStorage.getItem('database_connections') || '[]');
      const existingIndex = connections.findIndex((c: any) => c.id === connection.id);
      
      const connectionData = {
        id: connection.id,
        name: connection.name,
        type: connection.type,
        host: connection.host,
        port: connection.port,
        database: connection.database,
        username: connection.username,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (existingIndex >= 0) {
        connections[existingIndex] = connectionData;
      } else {
        connections.push(connectionData);
      }

      localStorage.setItem('database_connections', JSON.stringify(connections));
    } catch (error) {
      productionLogger.error('Failed to store connection locally', error, 'DatabaseConnectionManager');
    }
  }
}

export const databaseConnectionManager = DatabaseConnectionManager.getInstance();
export type { DatabaseConnection, ConnectionConfig };
