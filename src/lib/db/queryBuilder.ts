import { QueryResult } from 'pg';

export class QueryBuilder {
  private query: string;
  private params: any[];
  private paramIndex: number;

  constructor() {
    this.query = '';
    this.params = [];
    this.paramIndex = 1;
  }

  select(fields: string[] = ['*']) {
    this.query = `SELECT ${fields.join(', ')}`;
    return this;
  }

  from(table: string) {
    this.query += ` FROM ${this.escapeIdentifier(table)}`;
    return this;
  }

  where(condition: string, value?: any) {
    if (value !== undefined) {
      this.query += ` WHERE ${condition} = $${this.paramIndex}`;
      this.params.push(value);
      this.paramIndex++;
    } else {
      this.query += ` WHERE ${condition}`;
    }
    return this;
  }

  andWhere(condition: string, value?: any) {
    if (value !== undefined) {
      this.query += ` AND ${condition} = $${this.paramIndex}`;
      this.params.push(value);
      this.paramIndex++;
    } else {
      this.query += ` AND ${condition}`;
    }
    return this;
  }

  orderBy(field: string, direction: 'ASC' | 'DESC' = 'ASC') {
    this.query += ` ORDER BY ${this.escapeIdentifier(field)} ${direction}`;
    return this;
  }

  limit(limit: number) {
    this.query += ` LIMIT $${this.paramIndex}`;
    this.params.push(limit);
    this.paramIndex++;
    return this;
  }

  offset(offset: number) {
    this.query += ` OFFSET $${this.paramIndex}`;
    this.params.push(offset);
    this.paramIndex++;
    return this;
  }

  private escapeIdentifier(identifier: string): string {
    return `"${identifier.replace(/"/g, '""')}"`;
  }

  build(): { text: string; values: any[] } {
    return {
      text: this.query,
      values: this.params
    };
  }
} 