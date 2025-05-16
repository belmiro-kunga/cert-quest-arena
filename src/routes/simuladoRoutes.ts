import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { checkSimuladoAccess } from '../middleware/accessCheck';
import { SimuladoService } from '../services/simuladoService';
import { logger } from '../utils/logger';

const router = Router();
const simuladoService = SimuladoService.getInstance();

// Rota para listar simulados (inclui informação se é pago e se o usuário tem acesso)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const simulados = await simuladoService.getAllSimulados();
    const simuladosWithAccess = await Promise.all(
      simulados.map(async (simulado) => {
        const hasAccess = simulado.isPaid
          ? await simuladoService.checkUserAccess(req.user?.id!, simulado.id)
          : true;
        return {
          ...simulado,
          hasAccess
        };
      })
    );
    res.json(simuladosWithAccess);
  } catch (error) {
    logger.error('Error fetching simulados:', error);
    res.status(500).json({
      error: 'Internal server error while fetching simulados'
    });
  }
});

// Rota para obter um simulado específico
router.get('/:simuladoId', authenticateToken, async (req, res) => {
  try {
    const simulado = await simuladoService.getSimuladoById(req.params.simuladoId);
    
    if (!simulado) {
      return res.status(404).json({
        error: 'Simulado not found'
      });
    }

    // Se for um simulado pago, verifica o acesso
    if (simulado.isPaid) {
      const hasAccess = await simuladoService.checkUserAccess(
        req.user?.id!,
        simulado.id
      );
      
      if (!hasAccess) {
        return res.status(403).json({
          error: 'You do not have access to this simulado. Please purchase it first.',
          simulado: {
            id: simulado.id,
            title: simulado.title,
            description: simulado.description,
            price: simulado.price,
            isPaid: true
          }
        });
      }
    }

    res.json(simulado);
  } catch (error) {
    logger.error('Error fetching simulado:', error);
    res.status(500).json({
      error: 'Internal server error while fetching simulado'
    });
  }
});

// Rota para iniciar um simulado
router.post('/:simuladoId/start', authenticateToken, checkSimuladoAccess, async (req, res) => {
  try {
    const simulado = await simuladoService.startSimulado(
      req.user?.id!,
      req.params.simuladoId
    );
    res.json(simulado);
  } catch (error) {
    logger.error('Error starting simulado:', error);
    res.status(500).json({
      error: 'Internal server error while starting simulado'
    });
  }
});

// Rota para submeter respostas
router.post('/:simuladoId/submit', authenticateToken, checkSimuladoAccess, async (req, res) => {
  try {
    const result = await simuladoService.submitAnswers(
      req.user?.id!,
      req.params.simuladoId,
      req.body.answers
    );
    res.json(result);
  } catch (error) {
    logger.error('Error submitting answers:', error);
    res.status(500).json({
      error: 'Internal server error while submitting answers'
    });
  }
});

// Rota para obter resultados
router.get('/:simuladoId/results', authenticateToken, checkSimuladoAccess, async (req, res) => {
  try {
    const results = await simuladoService.getResults(
      req.user?.id!,
      req.params.simuladoId
    );
    res.json(results);
  } catch (error) {
    logger.error('Error fetching results:', error);
    res.status(500).json({
      error: 'Internal server error while fetching results'
    });
  }
});

export default router; 