/**
 * Rotas para gerenciamento de simulados
 */

const express = require('express');
const router = express.Router();
const simuladoModel = require('../models/simuladoModel');

// Inicializar o modelo (criar tabela se necessário)
simuladoModel.initialize().catch(err => {
  console.error('Erro ao inicializar modelo de simulados:', err);
});

// GET /api/simulados - Listar todos os simulados
router.get('/', async (req, res) => {
  try {
    const simulados = await simuladoModel.getAllSimulados();
    res.json(simulados);
  } catch (error) {
    console.error('Erro ao buscar simulados:', error);
    res.status(500).json({ error: 'Erro ao buscar simulados', details: error.message });
  }
});

// GET /api/simulados/:id - Obter um simulado específico pelo ID
router.get('/:id', async (req, res) => {
  // Verificar se o ID é 'ativos' e redirecionar para a rota de simulados ativos
  if (req.params.id === 'ativos') {
    try {
      const simuladosAtivos = await simuladoModel.getActiveSimulados();
      return res.json(simuladosAtivos);
    } catch (error) {
      console.error('Erro ao buscar simulados ativos:', error);
      return res.status(500).json({ error: 'Erro ao buscar simulados ativos', details: error.message });
    }
  }
  
  // Continuar com a busca normal por ID
  try {
    const id = req.params.id;
    const simulado = await simuladoModel.getSimuladoById(id);
    
    if (!simulado) {
      return res.status(404).json({ error: 'Simulado não encontrado' });
    }
    
    res.json(simulado);
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao buscar simulado', details: error.message });
  }
});

// POST /api/simulados - Criar um novo simulado
router.post('/', async (req, res) => {
  try {
    console.log('Recebido POST para criar simulado:', req.body);
    
    // Validação básica
    const { titulo, duracao_minutos } = req.body;
    if (!titulo) {
      console.error('Erro de validação: Título não fornecido');
      return res.status(400).json({ error: 'Título é obrigatório' });
    }
    
    if (!duracao_minutos) {
      console.error('Erro de validação: Duração não fornecida');
      return res.status(400).json({ error: 'Duração é obrigatória' });
    }
    
    // Converter duração para número se for string
    const dadosValidados = {
      ...req.body,
      duracao_minutos: Number(duracao_minutos)
    };
    
    console.log('Dados validados:', dadosValidados);
    
    const novoSimulado = await simuladoModel.createSimulado(dadosValidados);
    res.status(201).json(novoSimulado);
  } catch (error) {
    console.error('Erro ao criar simulado:', error);
    res.status(500).json({ error: 'Erro ao criar simulado', details: error.message });
  }
});

// PUT /api/simulados/:id - Atualizar um simulado existente
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o simulado existe
    const simuladoExistente = await simuladoModel.getSimuladoById(id);
    if (!simuladoExistente) {
      return res.status(404).json({ error: 'Simulado não encontrado' });
    }
    
    // Validação básica
    const { titulo, duracao_minutos } = req.body;
    if (!titulo || !duracao_minutos) {
      return res.status(400).json({ error: 'Título e duração são obrigatórios' });
    }
    
    const simuladoAtualizado = await simuladoModel.updateSimulado(id, req.body);
    res.json(simuladoAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar simulado com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao atualizar simulado', details: error.message });
  }
});

// DELETE /api/simulados/:id - Deletar um simulado
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar se o simulado existe
    const simuladoExistente = await simuladoModel.getSimuladoById(id);
    if (!simuladoExistente) {
      return res.status(404).json({ error: 'Simulado não encontrado' });
    }
    
    const simuladoDeletado = await simuladoModel.deleteSimulado(id);
    res.json({ message: 'Simulado deletado com sucesso', simulado: simuladoDeletado });
  } catch (error) {
    console.error(`Erro ao deletar simulado com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao deletar simulado', details: error.message });
  }
});

module.exports = router;
