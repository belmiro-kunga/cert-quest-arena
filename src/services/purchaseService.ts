import { pool } from '../lib/db/config';
import { Purchase, SimuladoAccess } from '../types/purchase';
import { logger } from '../utils/logger';
import { QueryBuilder } from '../lib/db/queryBuilder';

export class PurchaseService {
  private static instance: PurchaseService;
  private queryBuilder: QueryBuilder;

  private constructor() {
    this.queryBuilder = new QueryBuilder();
  }

  public static getInstance(): PurchaseService {
    if (!PurchaseService.instance) {
      PurchaseService.instance = new PurchaseService();
    }
    return PurchaseService.instance;
  }

  async createPurchase(purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Criar a compra
      const purchaseQuery = this.queryBuilder
        .insert('purchases')
        .values({
          user_id: purchase.userId,
          simulado_id: purchase.simuladoId,
          status: purchase.status,
          amount: purchase.amount,
          payment_method: purchase.paymentMethod,
          purchase_date: purchase.purchaseDate,
          expiration_date: purchase.expirationDate,
          access_code: purchase.accessCode,
          transaction_id: purchase.transactionId
        })
        .returning('*')
        .build();

      const purchaseResult = await client.query(purchaseQuery);
      const newPurchase = purchaseResult.rows[0];

      // Se a compra foi completada, criar o acesso
      if (purchase.status === 'completed') {
        await this.createSimuladoAccess({
          userId: purchase.userId,
          simuladoId: purchase.simuladoId,
          purchaseId: newPurchase.id,
          startDate: new Date(),
          endDate: purchase.expirationDate,
          isActive: true
        }, client);
      }

      await client.query('COMMIT');
      return newPurchase;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error creating purchase:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async createSimuladoAccess(
    access: Omit<SimuladoAccess, 'id'>,
    client = pool
  ): Promise<SimuladoAccess> {
    const accessQuery = this.queryBuilder
      .insert('simulado_access')
      .values({
        user_id: access.userId,
        simulado_id: access.simuladoId,
        purchase_id: access.purchaseId,
        start_date: access.startDate,
        end_date: access.endDate,
        is_active: access.isActive,
        last_access: access.lastAccess,
        progress: access.progress
      })
      .returning('*')
      .build();

    const result = await client.query(accessQuery);
    return result.rows[0];
  }

  async checkAccess(userId: string, simuladoId: string): Promise<boolean> {
    const query = this.queryBuilder
      .select('*')
      .from('simulado_access')
      .where({
        user_id: userId,
        simulado_id: simuladoId,
        is_active: true
      })
      .and('end_date > NOW()')
      .build();

    const result = await pool.query(query);
    return result.rows.length > 0;
  }

  async getUserPurchases(userId: string): Promise<Purchase[]> {
    const query = this.queryBuilder
      .select('*')
      .from('purchases')
      .where({ user_id: userId })
      .orderBy('purchase_date', 'DESC')
      .build();

    const result = await pool.query(query);
    return result.rows;
  }

  async getUserAccess(userId: string): Promise<SimuladoAccess[]> {
    const query = this.queryBuilder
      .select('*')
      .from('simulado_access')
      .where({ user_id: userId })
      .orderBy('start_date', 'DESC')
      .build();

    const result = await pool.query(query);
    return result.rows;
  }

  async updatePurchaseStatus(
    purchaseId: string,
    status: Purchase['status']
  ): Promise<Purchase> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const updateQuery = this.queryBuilder
        .update('purchases')
        .set({ status })
        .where({ id: purchaseId })
        .returning('*')
        .build();

      const result = await client.query(updateQuery);
      const updatedPurchase = result.rows[0];

      // Se a compra foi completada, criar o acesso
      if (status === 'completed') {
        await this.createSimuladoAccess({
          userId: updatedPurchase.user_id,
          simuladoId: updatedPurchase.simulado_id,
          purchaseId: updatedPurchase.id,
          startDate: new Date(),
          endDate: updatedPurchase.expiration_date,
          isActive: true
        }, client);
      }

      await client.query('COMMIT');
      return updatedPurchase;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Error updating purchase status:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateAccessProgress(
    accessId: string,
    progress: SimuladoAccess['progress']
  ): Promise<SimuladoAccess> {
    const query = this.queryBuilder
      .update('simulado_access')
      .set({
        progress,
        last_access: new Date()
      })
      .where({ id: accessId })
      .returning('*')
      .build();

    const result = await pool.query(query);
    return result.rows[0];
  }
} 