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
    
    // Verificar coluna topicos (array de texto)
    const checkTopicos = await db.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'simulados' AND column_name = 'topicos'
    `);
    if (checkTopicos.rows.length === 0) {
      console.log('Adicionando coluna topicos à tabela simulados');
      await db.query(`ALTER TABLE simulados ADD COLUMN topicos TEXT[]`);
    }
    
    console.log('Tabela de simulados verificada/criada com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabela de simulados:', error);
    throw error;
  }
};

// Obter todos os simulados
const mapSimuladoToExam = (simulado) => ({
  id: String(simulado.id),
  title: simulado.titulo || '',
  description: simulado.descricao || '',
  price: Number(simulado.preco) || 0,
  preco_usd: simulado.preco_usd !== undefined ? Number(simulado.preco_usd) : undefined,
  discountPrice: simulado.preco_desconto ? Number(simulado.preco_desconto) : undefined,
  language: simulado.language || 'pt',
  difficulty: simulado.nivel_dificuldade || 'Médio',
  duration: simulado.duracao_minutos || 60,
  questions_count: simulado.quantidade_questoes || 0,
  category: simulado.categoria || '',
  image_url: simulado.image_url || '',
  created_at: simulado.data_criacao || '',
  updated_at: simulado.data_atualizacao || '',
});

const getAllSimulados = async () => {
  try {
    const result = await db.query('SELECT * FROM simulados ORDER BY id');
    return result.rows.map(mapSimuladoToExam);
  } catch (error) {
    console.error('Erro ao buscar todos os simulados:', error);
    throw error;
  }
};

// Obter todos os simulados ativos para os alunos
const getActiveSimulados = async () => {
  try {
    const result = await db.query('SELECT * FROM simulados WHERE ativo = TRUE ORDER BY id');
    return result.rows.map(mapSimuladoToExam);
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
    
    return mapSimuladoToExam(simulado);
  } catch (error) {
    console.error(`Erro ao buscar simulado com ID ${id}:`, error);
    throw error;
  }
};

// Criar um novo simulado
const createSimulado = async (simuladoData) => {
  // Log de auditoria
  console.log(`[AUDIT][${new Date().toISOString()}] Criando simulado:`, {
    titulo: simuladoData.titulo,
    language: simuladoData.language,
    usuario: simuladoData.usuario || 'N/A',
    dados: simuladoData
  });
  const { 
    titulo, 
    descricao, 
    is_gratis, 
    preco, 
    preco_usd, 
    preco_desconto, 
    porcentagem_desconto, 
    desconto_expira_em, 
    quantidade_questoes, 
    duracao_minutos, 
    nivel_dificuldade, 
    nota_minima, 
    ativo, 
    language // novo campo
  } = simuladoData;

  // Validação explícita de idioma
  const idiomasValidos = ['pt', 'en', 'fr', 'es'];
  if (language && !idiomasValidos.includes(language)) {
    throw new Error(`Idioma inválido: ${language}. Os valores aceitos são: ${idiomasValidos.join(', ')}`);
  }
  // Corrigir: definir niveisValidos
  const niveisValidos = ['Fácil', 'Médio', 'Difícil', 'Avançado'];
  if (nivel_dificuldade && !niveisValidos.includes(nivel_dificuldade)) {
    throw new Error('Nível de dificuldade inválido');
  }
  
  try {
    const result = await db.query(
      `INSERT INTO simulados 
       (titulo, descricao, is_gratis, preco, preco_usd, preco_desconto, porcentagem_desconto, 
        desconto_expira_em, quantidade_questoes, duracao_minutos, nivel_dificuldade, 
        nota_minima, ativo, language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       RETURNING *`,
      [
        titulo, 
        descricao, 
        is_gratis ?? false, 
        preco ?? 0, 
        preco_usd, 
        preco_desconto, 
        porcentagem_desconto, 
        desconto_expira_em, 
        quantidade_questoes ?? 0, 
        duracao_minutos, 
        nivel_dificuldade, 
        nota_minima ?? 70, 
        ativo ?? true,
        language || 'pt'
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
  // Log de auditoria antes da alteração
  try {
    const simuladoAntes = await getSimuladoById(id);
    console.log(`[AUDIT][${new Date().toISOString()}] Atualizando simulado ID ${id}:`, {
      usuario: simuladoData.usuario || 'N/A',
      antes: simuladoAntes,
      depois: simuladoData
    });
  } catch (err) {
    console.warn(`[AUDIT] Não foi possível obter simulado antes da atualização:`, err);
  }
  const { 
    titulo, 
    descricao, 
    is_gratis, 
    preco, 
    preco_usd, 
    preco_desconto, 
    porcentagem_desconto, 
    desconto_expira_em, 
    quantidade_questoes, 
    duracao_minutos, 
    nivel_dificuldade, 
    nota_minima, 
    ativo, 
    language // novo campo
  } = simuladoData;

  // Validação explícita de idioma
  const idiomasValidos = ['pt', 'en', 'fr', 'es'];
  if (language && !idiomasValidos.includes(language)) {
    throw new Error(`Idioma inválido: ${language}. Os valores aceitos são: ${idiomasValidos.join(', ')}`);
  }
  
  try {
    const result = await db.query(
      `UPDATE simulados 
       SET titulo = $1, 
           descricao = $2, 
           is_gratis = $3, 
           preco = $4, 
           preco_usd = $5, 
           preco_desconto = $6, 
           porcentagem_desconto = $7, 
           desconto_expira_em = $8, 
           quantidade_questoes = $9, 
           duracao_minutos = $10, 
           nivel_dificuldade = $11, 
           nota_minima = $12, 
           ativo = $13, 
           language = $14
       WHERE id = $15 
       RETURNING *`,
      [
        titulo, 
        descricao, 
        is_gratis, 
        preco, 
        preco_usd, 
        preco_desconto, 
        porcentagem_desconto, 
        desconto_expira_em, 
        quantidade_questoes, 
        duracao_minutos, 
        nivel_dificuldade, 
        nota_minima, 
        ativo, 
        language || 'pt',
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
  // Log de auditoria antes da deleção
  try {
    const simuladoAntes = await getSimuladoById(id);
    console.log(`[AUDIT][${new Date().toISOString()}] Deletando simulado ID ${id}:`, {
      usuario: 'N/A',
      dados: simuladoAntes
    });
  } catch (err) {
    console.warn(`[AUDIT] Não foi possível obter simulado antes da deleção:`, err);
  }
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
