import { Router } from 'express';
import { PurchaseService } from '../services/purchaseService';
import { authenticateToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { validatePurchase } from '../utils/validation';

const router = Router();
const purchaseService = PurchaseService.getInstance();

// Rota para criar uma nova compra
router.post('/', authenticateToken, async (req, res) => {
  try {
    const purchaseData = {
      ...req.body,
      userId: req.user?.id,
      purchaseDate: new Date()
    };

    const validationResult = validatePurchase(purchaseData);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Invalid purchase data',
        details: validationResult.error
      });
    }

    const purchase = await purchaseService.createPurchase(purchaseData);
    logger.info(`New purchase created: ${purchase.id} for user ${req.user?.id}`);
    res.status(201).json(purchase);
  } catch (error) {
    logger.error('Error creating purchase:', error);
    res.status(500).json({
      error: 'Internal server error while creating purchase'
    });
  }
});

// Rota para listar compras do usuário
router.get('/my-purchases', authenticateToken, async (req, res) => {
  try {
    const purchases = await purchaseService.getUserPurchases(req.user?.id!);
    res.json(purchases);
  } catch (error) {
    logger.error('Error fetching user purchases:', error);
    res.status(500).json({
      error: 'Internal server error while fetching purchases'
    });
  }
});

// Rota para listar acessos do usuário
router.get('/my-access', authenticateToken, async (req, res) => {
  try {
    const access = await purchaseService.getUserAccess(req.user?.id!);
    res.json(access);
  } catch (error) {
    logger.error('Error fetching user access:', error);
    res.status(500).json({
      error: 'Internal server error while fetching access'
    });
  }
});

// Rota para atualizar status da compra (usado pelo webhook de pagamento)
router.patch('/:purchaseId/status', async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const { status } = req.body;

    if (!status || !['completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status'
      });
    }

    const purchase = await purchaseService.updatePurchaseStatus(purchaseId, status);
    logger.info(`Purchase ${purchaseId} status updated to ${status}`);
    res.json(purchase);
  } catch (error) {
    logger.error('Error updating purchase status:', error);
    res.status(500).json({
      error: 'Internal server error while updating purchase status'
    });
  }
});

// Rota para atualizar progresso do simulado
router.patch('/access/:accessId/progress', authenticateToken, async (req, res) => {
  try {
    const { accessId } = req.params;
    const { progress } = req.body;

    const access = await purchaseService.updateAccessProgress(accessId, progress);
    logger.info(`Progress updated for access ${accessId}`);
    res.json(access);
  } catch (error) {
    logger.error('Error updating access progress:', error);
    res.status(500).json({
      error: 'Internal server error while updating progress'
    });
  }
});

export default router; 