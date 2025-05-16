/**
 * Rotas para gerenciamento de questões
 */

const express = require('express');
const router = express.Router();
const questaoModel = require('../models/questaoModel');

// Inicializar o modelo (criar tabela se necessário)
questaoModel.initialize().catch(err => {
  console.error('Erro ao inicializar modelo de questões:', err);
});

// GET /api/questoes/simulado/:simuladoId - Listar todas as questões de um simulado
router.get('/simulado/:simuladoId', async (req, res) => {
  try {
    const simuladoId = req.params.simuladoId;
    const language = req.query.language;
    const questoes = await questaoModel.getQuestoesBySimuladoId(simuladoId, language);
    res.json(questoes);
  } catch (error) {
    console.error(`Erro ao buscar questões do simulado ${req.params.simuladoId}:`, error);
    res.status(500).json({ error: 'Erro ao buscar questões', details: error.message });
  }
});

// GET /api/questoes/:id - Obter uma questão específica pelo ID
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const questao = await questaoModel.getQuestaoById(id);
    
    if (!questao) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    
    res.json(questao);
  } catch (error) {
    console.error(`Erro ao buscar questão com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao buscar questão', details: error.message });
  }
});

// POST /api/questoes - Criar uma nova questão
router.post('/', async (req, res) => {
  try {
    console.log('Recebido POST para criar questão:', req.body);
    
    // Validação básica
    const { simulado_id, texto, tipo } = req.body;
    if (!simulado_id) {
      return res.status(400).json({ error: 'ID do simulado é obrigatório' });
    }
    if (!texto) {
      return res.status(400).json({ error: 'Texto da questão é obrigatório' });
    }
    if (!tipo) {
      return res.status(400).json({ error: 'Tipo da questão é obrigatório' });
    }
    
    const novaQuestao = await questaoModel.createQuestao(req.body);
    res.status(201).json(novaQuestao);
  } catch (error) {
    console.error('Erro ao criar questão:', error);
    res.status(500).json({ error: 'Erro ao criar questão', details: error.message });
  }
});

// PUT /api/questoes/:id - Atualizar uma questão existente
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`Recebido PUT para atualizar questão ${id}:`, req.body);
    
    // Verificar se a questão existe
    const questaoExistente = await questaoModel.getQuestaoById(id);
    if (!questaoExistente) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    
    // Validação básica
    const { texto, tipo } = req.body;
    if (!texto) {
      return res.status(400).json({ error: 'Texto da questão é obrigatório' });
    }
    if (!tipo) {
      return res.status(400).json({ error: 'Tipo da questão é obrigatório' });
    }
    
    const questaoAtualizada = await questaoModel.updateQuestao(id, req.body);
    res.json(questaoAtualizada);
  } catch (error) {
    console.error(`Erro ao atualizar questão ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao atualizar questão', details: error.message });
  }
});

// DELETE /api/questoes/:id - Excluir uma questão
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se a questão existe
    const questaoExistente = await questaoModel.getQuestaoById(id);
    if (!questaoExistente) {
      return res.status(404).json({ error: 'Questão não encontrada' });
    }
    
    await questaoModel.deleteQuestao(id);
    res.status(204).send();
  } catch (error) {
    console.error(`Erro ao excluir questão ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao excluir questão', details: error.message });
  }
});

module.exports = router;
