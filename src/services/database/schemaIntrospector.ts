
import { DatabaseSchema, DatabaseConnection } from './types';
import { queryExecutor } from './queryExecutor';
import { productionLogger } from '@/utils/productionLogger';

export class SchemaIntrospector {
  private static instance: SchemaIntrospector;

  static getInstance(): SchemaIntrospector {
    if (!SchemaIntrospector.instance) {
      SchemaIntrospector.instance = new SchemaIntrospector();
    }
    return SchemaIntrospector.instance;
  }

  async introspectSchema(connectionId: string, dbType: DatabaseConnection['type']): Promise<DatabaseSchema> {
    try {
      const queries = this.getIntrospectionQueries(dbType);
      
      const [tablesResult, columnsResult, indexesResult, viewsResult, functionsResult] = await Promise.all([
        queryExecutor.executeQuery(connectionId, queries.tables),
        queryExecutor.executeQuery(connectionId, queries.columns),
        queryExecutor.executeQuery(connectionId, queries.indexes),
        queryExecutor.executeQuery(connectionId, queries.views),
        queryExecutor.executeQuery(connectionId, queries.functions)
      ]);

      return this.buildSchema({
        tables: tablesResult.rows,
        columns: columnsResult.rows,
        indexes: indexesResult.rows,
        views: viewsResult.rows,
        functions: functionsResult.rows
      });
    } catch (error) {
      productionLogger.error(`Schema introspection failed: ${connectionId}`, error, 'SchemaIntrospector');
      throw error;
    }
  }

  private getIntrospectionQueries(type: DatabaseConnection['type']): Record<string, string> {
    const postgresQueries = {
      tables: `
        SELECT table_name, table_schema 
        FROM information_schema.tables 
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
      `,
      columns: `
        SELECT table_name, column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
        ORDER BY table_name, ordinal_position
      `,
      indexes: `
        SELECT tablename, indexname, indexdef
        FROM pg_indexes
        WHERE schemaname = 'public'
      `,
      views: `
        SELECT table_name, view_definition
        FROM information_schema.views
        WHERE table_schema = 'public'
      `,
      functions: `
        SELECT routine_name, parameter_style, data_type
        FROM information_schema.routines
        WHERE routine_schema = 'public'
      `
    };

    // Could extend for other database types
    return postgresQueries;
  }

  private buildSchema(results: any): DatabaseSchema {
    return {
      tables: results.tables.map((table: any) => ({
        name: table.table_name,
        columns: results.columns
          .filter((col: any) => col.table_name === table.table_name)
          .map((col: any) => ({
            name: col.column_name,
            type: col.data_type,
            nullable: col.is_nullable === 'YES',
            primaryKey: false, // Would be determined from constraints
            foreignKey: undefined
          })),
        indexes: results.indexes
          .filter((idx: any) => idx.tablename === table.table_name)
          .map((idx: any) => ({
            name: idx.indexname,
            columns: [],
            unique: false,
            type: 'btree'
          })),
        relationships: []
      })),
      views: results.views.map((view: any) => ({
        name: view.table_name,
        definition: view.view_definition
      })),
      functions: results.functions.map((func: any) => ({
        name: func.routine_name,
        parameters: [],
        returnType: func.data_type
      }))
    };
  }
}

export const schemaIntrospector = SchemaIntrospector.getInstance();
