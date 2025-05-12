/**
 * Modelo para a tabela de simulados
 * Este arquivo contém funções para interagir com a tabela 'simulados' no banco de dados
 */

const db = require('../db');

// Criar a tabela de simulados se ela não existir
const createTableIfNotExists = async () => {
  try {
    // Primeiro, criar a tabela se não existir com os campos básicos
    await db.query(`
      CREATE TABLE IF NOT EXISTS simulados (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        duracao_minutos INTEGER NOT NULL,
        nivel_dificuldade VARCHAR(50) DEFAULT 'Médio',
        data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ativo BOOLEAN DEFAULT TRUE
      )
    `);
    
    // Verificar se as colunas adicionais existem e adicioná-las se necessário
    // Verificar coluna is_gratis
    const checkIsGratis = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'is_gratis'
    `);
    
    if (checkIsGratis.rows.length === 0) {
      console.log('Adicionando coluna is_gratis à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN is_gratis BOOLEAN DEFAULT FALSE`);
    }
    
    // Verificar coluna preco
    const checkPreco = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'preco'
    `);
    
    if (checkPreco.rows.length === 0) {
      console.log('Adicionando coluna preco à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN preco DECIMAL(10, 2) DEFAULT 0`);
    }
    
    // Verificar coluna preco_desconto
    const checkPrecoDesconto = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'preco_desconto'
    `);
    
    if (checkPrecoDesconto.rows.length === 0) {
      console.log('Adicionando coluna preco_desconto à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN preco_desconto DECIMAL(10, 2)`);
    }
    
    // Verificar coluna porcentagem_desconto
    const checkPorcentagemDesconto = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'porcentagem_desconto'
    `);
    
    if (checkPorcentagemDesconto.rows.length === 0) {
      console.log('Adicionando coluna porcentagem_desconto à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN porcentagem_desconto INTEGER`);
    }
    
    // Verificar coluna desconto_expira_em
    const checkDescontoExpiraEm = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'desconto_expira_em'
    `);
    
    if (checkDescontoExpiraEm.rows.length === 0) {
      console.log('Adicionando coluna desconto_expira_em à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN desconto_expira_em TIMESTAMP`);
    }
    
    // Verificar coluna quantidade_questoes
    const checkQuantidadeQuestoes = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'quantidade_questoes'
    `);
    
    if (checkQuantidadeQuestoes.rows.length === 0) {
      console.log('Adicionando coluna quantidade_questoes à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN quantidade_questoes INTEGER DEFAULT 0`);
    }
    
    // Verificar coluna nota_minima
    const checkNotaMinima = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'nota_minima'
    `);
    
    if (checkNotaMinima.rows.length === 0) {
      console.log('Adicionando coluna nota_minima à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN nota_minima INTEGER DEFAULT 70`);
    }
    
    console.log('Tabela de simulados verificada/criada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de simulados:', error);
    throw error;
  }
};

// Obter todos os simulados
const getAllSimulados = async () => {
  try {
    const result = await db.query('SELECT * FROM simulados ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar todos os simulados:', error);
    throw error;
  }
};

// Obter todos os simulados ativos para os alunos
const getActiveSimulados = async () => {
  try {
    const result = await db.query('SELECT * FROM simulados WHERE ativo = TRUE ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar simulados ativos:', error);
    throw error;
  }
};

// Obter um simulado pelo ID com contagem de questões
const getSimuladoById = async (id) => {
  try {
    // Primeiro, buscar o simulado
    const simuladoResult = await db.query('SELECT * FROM simulados WHERE id = $1', [id]);
    const simulado = simuladoResult.rows[0]; // Retorna o primeiro resultado ou undefined se não encontrar
    
    if (!simulado) {
      return null; // Simulado não encontrado
    }
    
    // Buscar a contagem de questões associadas a este simulado
    const questoesResult = await db.query('SELECT COUNT(*) as quantidade_questoes FROM questoes WHERE simulado_id = $1', [id]);
    const quantidadeQuestoes = parseInt(questoesResult.rows[0].quantidade_questoes, 10);
    
    // Atualizar o objeto simulado com a contagem de questões
    simulado.quantidade_questoes = quantidadeQuestoes;
    
    console.log(`Simulado ID ${id} tem ${quantidadeQuestoes} questões`);
    
    return simulado;
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${id}:`, error);
    throw error;
  }
};

// Criar um novo simulado
const createSimulado = async (simuladoData) => {
  const { 
    titulo, 
    descricao, 
    is_gratis, 
    preco, 
    preco_desconto, 
    porcentagem_desconto, 
    desconto_expira_em, 
    quantidade_questoes, 
    duracao_minutos, 
    nivel_dificuldade, 
    nota_minima, 
    ativo 
  } = simuladoData;
  
  if (!niveisValidos.includes(nivel_dificuldade)) {
    throw new Error('Nível de dificuldade inválido');
  }
  
  try {
    const result = await db.query(
      `INSERT INTO simulados 
       (titulo, descricao, is_gratis, preco, preco_desconto, porcentagem_desconto, 
        desconto_expira_em, quantidade_questoes, duracao_minutos, nivel_dificuldade, 
        nota_minima, ativo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
       RETURNING *`,
      [
        titulo, 
        descricao, 
        is_gratis ?? false, 
        preco ?? 0, 
        preco_desconto, 
        porcentagem_desconto, 
        desconto_expira_em, 
        quantidade_questoes ?? 0, 
        duracao_minutos, 
        nivel_dificuldade, 
        nota_minima ?? 70, 
        ativo ?? true
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Erro ao criar simulado:', error);
    throw error;
  }
};

// Atualizar um simulado existente
const updateSimulado = async (id, simuladoData) => {
  const { 
    titulo, 
    descricao, 
    is_gratis, 
    preco, 
    preco_desconto, 
    porcentagem_desconto, 
    desconto_expira_em, 
    quantidade_questoes, 
    duracao_minutos, 
    nivel_dificuldade, 
    nota_minima, 
    ativo 
  } = simuladoData;
  
  try {
    const result = await db.query(
      `UPDATE simulados 
       SET titulo = $1, 
           descricao = $2, 
           is_gratis = $3, 
           preco = $4, 
           preco_desconto = $5, 
           porcentagem_desconto = $6, 
           desconto_expira_em = $7, 
           quantidade_questoes = $8, 
           duracao_minutos = $9, 
           nivel_dificuldade = $10, 
           nota_minima = $11, 
           ativo = $12
       WHERE id = $13 
       RETURNING *`,
      [
        titulo, 
        descricao, 
        is_gratis, 
        preco, 
        preco_desconto, 
        porcentagem_desconto, 
        desconto_expira_em, 
        quantidade_questoes, 
        duracao_minutos, 
        nivel_dificuldade, 
        nota_minima, 
        ativo, 
        id
      ]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Erro ao atualizar simulado com ID ${id}:`, error);
    throw error;
  }
};

// Deletar um simulado
const deleteSimulado = async (id) => {
  try {
    const result = await db.query('DELETE FROM simulados WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    console.error(`Erro ao deletar simulado com ID ${id}:`, error);
    throw error;
  }
};



// Inicializar o modelo (criar tabela se necessário)
const initialize = async () => {
  await createTableIfNotExists();
};

module.exports = {
  initialize,
  getAllSimulados,
  getActiveSimulados,
  getSimuladoById,
  createSimulado,
  updateSimulado,
  deleteSimulado
};
