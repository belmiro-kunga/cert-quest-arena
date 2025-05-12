const express = require('express');
const router = express.Router();
const resultModel = require('../models/resultModel');

// Salvar resultado do simulado
router.post('/', async (req, res) => {
  try {
    const result = req.body;
    // userId pode vir do token ou do body
    const userId = req.user?.id || result.userId || null;
    result.userId = userId;
    const id = await resultModel.saveResult(result);
    res.status(201).json({ id });
  } catch (err) {
    console.error('Erro ao salvar resultado:', err);
    res.status(500).json({ error: 'Erro ao salvar resultado' });
  }
});

// Buscar resultados de um usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await resultModel.getResultsByUser(userId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar resultados do usuário' });
  }
});

// Buscar resultados de um simulado
router.get('/simulado/:simuladoId', async (req, res) => {
  try {
    const { simuladoId } = req.params;
    const results = await resultModel.getResultsBySimulado(simuladoId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar resultados do simulado' });
  }
});

module.exports = router;
