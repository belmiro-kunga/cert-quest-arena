import { db } from '../lib/db/config';
import { Question } from '../types/question';

export const questionService = {
  async createQuestion(question: Question) {
    const query = `
      INSERT INTO questions (title, description, type, content, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    
    const params = [
      question.title,
      question.description,
      question.type,
      JSON.stringify(question.content)
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  },

  async getQuestionById(id: string) {
    const query = `
      SELECT * FROM questions
      WHERE id = $1
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async updateQuestion(id: string, question: Partial<Question>) {
    const query = `
      UPDATE questions
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        content = COALESCE($3, content),
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
    
    const params = [
      question.title,
      question.description,
      question.content ? JSON.stringify(question.content) : null,
      id
    ];

    const result = await db.query(query, params);
    return result.rows[0];
  },

  async deleteQuestion(id: string) {
    const query = `
      DELETE FROM questions
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async listQuestions(filters?: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let query = `
      SELECT * FROM questions
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.type) {
      query += ` AND type = $${paramIndex}`;
      params.push(filters.type);
      paramIndex++;
    }

    if (filters?.search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    if (filters?.page && filters?.limit) {
      const offset = (filters.page - 1) * filters.limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      params.push(filters.limit, offset);
    }

    const result = await db.query(query, params);
    return result.rows;
  }
}; 