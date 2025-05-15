/**
 * Rotas para gerenciamento de pacotes de simulados
 */
const express = require('express');
const router = express.Router();
const pacoteModel = require('../models/pacoteModel');
const { auth, isAdmin } = require('../middleware/auth');

// Inicializar tabelas
pacoteModel.createTableIfNotExists()
  .then(() => console.log('Tabelas de pacotes inicializadas'))
  .catch(err => console.error('Erro ao inicializar tabelas de pacotes:', err));

// Obter todos os pacotes
router.get('/', async (req, res) => {
  try {
    const pacotes = await pacoteModel.getAllPacotes();
    
    // Para cada pacote, buscar os simulados associados
    const pacotesCompletos = [];
    for (const pacote of pacotes) {
      const pacoteCompleto = await pacoteModel.getPacoteById(pacote.id);
      pacotesCompletos.push(pacoteCompleto);
    }
    
    res.json(pacotesCompletos);
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacotes', details: error.message });
  }
});

// Obter pacote por ID
router.get('/:id', async (req, res) => {
  try {
    const pacote = await pacoteModel.getPacoteById(req.params.id);
    if (!pacote) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }
    res.json(pacote);
  } catch (error) {
    console.error(`Erro ao buscar pacote com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao buscar pacote', details: error.message });
  }
});

// Obter pacotes por categoria
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const pacotes = await pacoteModel.getPacotesByCategoria(req.params.categoria);
    res.json(pacotes);
  } catch (error) {
    console.error(`Erro ao buscar pacotes da categoria ${req.params.categoria}:`, error);
    res.status(500).json({ error: 'Erro ao buscar pacotes por categoria', details: error.message });
  }
});

// Criar novo pacote (apenas admin)
// TODO: Restaurar middlewares de autenticação em produção
router.post('/', async (req, res) => {
  try {
    const pacote = await pacoteModel.createPacote(req.body);
    res.status(201).json(pacote);
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    res.status(500).json({ error: 'Erro ao criar pacote', details: error.message });
  }
});

// Atualizar pacote existente (apenas admin)
// TODO: Restaurar middlewares de autenticação em produção
router.put('/:id', async (req, res) => {
  try {
    const pacote = await pacoteModel.updatePacote(req.params.id, req.body);
    res.json(pacote);
  } catch (error) {
    console.error(`Erro ao atualizar pacote com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao atualizar pacote', details: error.message });
  }
});

// Excluir pacote (apenas admin)
// TODO: Restaurar middlewares de autenticação em produção
router.delete('/:id', async (req, res) => {
  try {
    await pacoteModel.deletePacote(req.params.id);
    res.json({ message: 'Pacote excluído com sucesso' });
  } catch (error) {
    console.error(`Erro ao excluir pacote com ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Erro ao excluir pacote', details: error.message });
  }
});

// Criar pacotes automaticamente a partir de simulados existentes (apenas admin)
// TODO: Restaurar middlewares de autenticação em produção
router.post('/criar-automaticos', async (req, res) => {
  try {
    const pacotesCriados = await pacoteModel.criarPacotesAutomaticos();
    res.status(201).json({
      message: `${pacotesCriados.length} pacotes criados/atualizados com sucesso`,
      pacotes: pacotesCriados
    });
  } catch (error) {
    console.error('Erro ao criar pacotes automáticos:', error);
    res.status(500).json({ error: 'Erro ao criar pacotes automáticos', details: error.message });
  }
});

module.exports = router;
