import { Request, Response, NextFunction } from 'express';
import { PurchaseService } from '../services/purchaseService';
import { logger } from '../utils/logger';

export const checkSimuladoAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const simuladoId = req.params.simuladoId;

    if (!userId || !simuladoId) {
      return res.status(400).json({
        error: 'User ID and Simulado ID are required'
      });
    }

    const purchaseService = PurchaseService.getInstance();
    const hasAccess = await purchaseService.checkAccess(userId, simuladoId);

    if (!hasAccess) {
      logger.warn(`Access denied for user ${userId} to simulado ${simuladoId}`);
      return res.status(403).json({
        error: 'You do not have access to this simulado. Please purchase it first.'
      });
    }

    next();
  } catch (error) {
    logger.error('Error checking simulado access:', error);
    res.status(500).json({
      error: 'Internal server error while checking access'
    });
  }
}; 