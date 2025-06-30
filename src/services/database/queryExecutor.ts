
import { QueryResult, DatabaseConnection } from './types';
import { connectionPool } from './connectionPool';
import { productionLogger } from '@/utils/productionLogger';

export class QueryExecutor {
  private static instance: QueryExecutor;

  static getInstance(): QueryExecutor {
    if (!QueryExecutor.instance) {
      QueryExecutor.instance = new QueryExecutor();
    }
    return QueryExecutor.instance;
  }

  async executeQuery(
    connectionId: string, 
    query: string, 
    params?: any[]
  ): Promise<QueryResult> {
    const pool = connectionPool.getPool(connectionId);
    if (!pool) {
      throw new Error('Connection pool not found');
    }

    const startTime = Date.now();
    
    try {
      const result = await this.runQuery(pool, query, params);
      const executionTime = Date.now() - startTime;

      // Log query execution for analytics
      productionLogger.info(`Query executed on ${connectionId}`, {
        query: this.sanitizeQuery(query),
        executionTime,
        rowCount: result.rowCount
      });

      return {
        ...result,
        executionTime
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      productionLogger.error(`Query execution failed on ${connectionId}`, error, 'QueryExecutor');
      
      // Re-throw with additional context
      throw new Error(`Query execution failed after ${executionTime}ms: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getTestQuery(type: DatabaseConnection['type']): string {
    const testQueries = {
      postgresql: 'SELECT 1',
      mysql: 'SELECT 1',
      mssql: 'SELECT 1',
      oracle: 'SELECT 1 FROM DUAL',
      mongodb: '{ ping: 1 }',
      redis: 'PING'
    };
    
    return testQueries[type] || 'SELECT 1';
  }

  private async runQuery(pool: any, query: string, params?: any[]): Promise<Omit<QueryResult, 'executionTime'>> {
    // Mock execution - would integrate with actual database drivers
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 400));
    
    return {
      rows: [{ id: 1, name: 'Sample Data', created_at: new Date() }],
      rowCount: 1
    };
  }

  private sanitizeQuery(query: string): string {
    // Truncate and remove sensitive data from logs
    return query.substring(0, 100).replace(/password\s*=\s*'[^']*'/gi, "password='***'");
  }
}

export const queryExecutor = QueryExecutor.getInstance();
