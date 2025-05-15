/**
 * Modelo para a tabela de pacotes de simulados
 * Este arquivo contém funções para interagir com a tabela 'pacotes' no banco de dados
 */
const db = require('../db');
const simuladoModel = require('./simuladoModel');

// Criar a tabela de pacotes se ela não existir
const createTableIfNotExists = async () => {
  try {
    // Criar tabela de pacotes
    await db.query(`
      CREATE TABLE IF NOT EXISTS pacotes (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) DEFAULT 0,
        preco_usd DECIMAL(10,2) DEFAULT 0,
        is_gratis BOOLEAN DEFAULT FALSE,
        duracao_dias INTEGER DEFAULT 365,
        ativo BOOLEAN DEFAULT TRUE,
        is_subscription BOOLEAN DEFAULT FALSE,
        subscription_duration INTEGER DEFAULT 365,
        subscription_price DECIMAL(10,2),
        subscription_currency VARCHAR(3) DEFAULT 'BRL',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela de relacionamento entre pacotes e simulados
    await db.query(`
      CREATE TABLE IF NOT EXISTS pacote_simulados (
        id SERIAL PRIMARY KEY,
        pacote_id INTEGER REFERENCES pacotes(id) ON DELETE CASCADE,
        simulado_id INTEGER REFERENCES simulados(id) ON DELETE CASCADE,
        UNIQUE(pacote_id, simulado_id)
      )
    `);

    console.log('Tabelas de pacotes verificadas/criadas com sucesso');
  } catch (error) {
    console.error('Erro ao criar tabelas de pacotes:', error);
    throw error;
  }
};

// Mapear pacote do banco para o formato da API
const mapPacoteToAPI = (pacote, simulados = []) => ({
  id: String(pacote.id),
  titulo: pacote.titulo || '',
  descricao: pacote.descricao || '',
  preco: parseFloat(pacote.preco) || 0,
  preco_usd: parseFloat(pacote.preco_usd) || 0,
  is_gratis: pacote.is_gratis || false,
  duracao_dias: pacote.duracao_dias || 365,
  ativo: pacote.ativo !== false,
  is_subscription: pacote.is_subscription || false,
  subscription_duration: pacote.subscription_duration || 365,
  subscription_price: pacote.subscription_price ? parseFloat(pacote.subscription_price) : null,
  subscription_currency: pacote.subscription_currency || 'BRL',
  simulados: simulados,
  created_at: pacote.created_at || '',
  updated_at: pacote.updated_at || ''
});

// Obter todos os pacotes ativos
const getAllPacotes = async () => {
  try {
    const result = await db.query('SELECT * FROM pacotes WHERE ativo = TRUE ORDER BY titulo');
    return result.rows;
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    throw error;
  }
};

// Obter um pacote pelo ID
const getPacoteById = async (id) => {
  try {
    const result = await db.query('SELECT * FROM pacotes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return null;
    }
    
    // Buscar simulados associados ao pacote
    const simuladosResult = await db.query(`
      SELECT s.* FROM simulados s
      JOIN pacote_simulados ps ON s.id = ps.simulado_id
      WHERE ps.pacote_id = $1
    `, [id]);
    
    const pacote = result.rows[0];
    const simulados = simuladosResult.rows.map(simulado => simuladoModel.mapSimuladoToExam(simulado));
    
    return mapPacoteToAPI(pacote, simulados);
  } catch (error) {
    console.error(`Erro ao buscar pacote com ID ${id}:`, error);
    throw error;
  }
};

// Criar um novo pacote
const createPacote = async (pacoteData) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const {
      titulo,
      descricao,
      preco,
      preco_usd,
      is_gratis,
      duracao_dias = 365, // Duração padrão de 1 ano
      simulado_ids,
      ativo = true,
      is_subscription = false,
      subscription_duration = 365, // Duração padrão da subscrição
      subscription_price,
      subscription_currency = 'BRL'
    } = pacoteData;
    
    // Inserir o pacote
    const pacoteResult = await client.query(`
      INSERT INTO pacotes (titulo, descricao, preco, preco_usd, is_gratis, duracao_dias, is_subscription, subscription_duration, subscription_price, subscription_currency)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [titulo, descricao, preco, preco_usd, is_gratis, duracao_dias, is_subscription, subscription_duration, subscription_price, subscription_currency]);
    
    const pacoteId = pacoteResult.rows[0].id;
    
    // Associar simulados ao pacote
    if (Array.isArray(simulado_ids) && simulado_ids.length > 0) {
      for (const simuladoId of simulado_ids) {
        await client.query(`
          INSERT INTO pacote_simulados (pacote_id, simulado_id)
          VALUES ($1, $2)
          ON CONFLICT (pacote_id, simulado_id) DO NOTHING
        `, [pacoteId, simuladoId]);
      }
    }
    
    await client.query('COMMIT');
    
    // Retornar o pacote completo
    return getPacoteById(pacoteId);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar pacote:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Atualizar um pacote existente
const updatePacote = async (id, pacoteData) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const {
      titulo,
      descricao,
      preco,
      preco_usd,
      is_gratis,
      duracao_dias,
      simulados,
      ativo,
      is_subscription,
      subscription_duration,
      subscription_price,
      subscription_currency
    } = pacoteData;
    
    // Atualizar o pacote
    const pacoteResult = await client.query(`
      UPDATE pacotes
      SET titulo = COALESCE($1, titulo),
          descricao = COALESCE($2, descricao),
          preco = COALESCE($3, preco),
          preco_usd = COALESCE($4, preco_usd),
          is_gratis = COALESCE($5, is_gratis),
          duracao_dias = COALESCE($6, duracao_dias),
          ativo = COALESCE($7, ativo),
          is_subscription = COALESCE($8, is_subscription),
          subscription_duration = COALESCE($9, subscription_duration),
          subscription_price = COALESCE($10, subscription_price),
          subscription_currency = COALESCE($11, subscription_currency),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `, [titulo, descricao, preco, preco_usd, is_gratis, duracao_dias, ativo, is_subscription, subscription_duration, subscription_price, subscription_currency, id]);
    
    if (pacoteResult.rows.length === 0) {
      throw new Error(`Pacote com ID ${id} não encontrado`);
    }
    
    // Se simulados foi fornecido, atualizar as associações
    if (Array.isArray(simulados)) {
      // Remover todas as associações existentes
      await client.query('DELETE FROM pacote_simulados WHERE pacote_id = $1', [id]);
      
      // Adicionar as novas associações
      for (const simuladoId of simulados) {
        await client.query(`
          INSERT INTO pacote_simulados (pacote_id, simulado_id)
          VALUES ($1, $2)
          ON CONFLICT (pacote_id, simulado_id) DO NOTHING
        `, [id, simuladoId]);
      }
    }
    
    await client.query('COMMIT');
    
    // Retornar o pacote atualizado
    return getPacoteById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Erro ao atualizar pacote com ID ${id}:`, error);
    throw error;
  } finally {
    client.release();
  }
};

// Excluir um pacote
const deletePacote = async (id) => {
  try {
    // Verificar se o pacote existe
    const checkResult = await db.query('SELECT id FROM pacotes WHERE id = $1', [id]);
    if (checkResult.rows.length === 0) {
      throw new Error(`Pacote com ID ${id} não encontrado`);
    }
    
    // Excluir o pacote (as associações serão excluídas automaticamente devido à restrição ON DELETE CASCADE)
    await db.query('DELETE FROM pacotes WHERE id = $1', [id]);
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir pacote com ID ${id}:`, error);
    throw error;
  }
};

// Obter pacotes por categoria
const getPacotesByCategoria = async (categoria) => {
  try {
    const result = await db.query('SELECT * FROM pacotes WHERE categoria = $1 AND ativo = TRUE ORDER BY titulo', [categoria]);
    
    const pacotes = [];
    for (const pacote of result.rows) {
      // Buscar simulados associados ao pacote
      const simuladosResult = await db.query(`
        SELECT s.* FROM simulados s
        JOIN pacote_simulados ps ON s.id = ps.simulado_id
        WHERE ps.pacote_id = $1
      `, [pacote.id]);
      
      const simulados = simuladosResult.rows.map(simulado => simuladoModel.mapSimuladoToExam(simulado));
      pacotes.push(mapPacoteToAPI(pacote, simulados));
    }
    
    return pacotes;
  } catch (error) {
    console.error(`Erro ao buscar pacotes da categoria ${categoria}:`, error);
    throw error;
  }
};

// Função para agrupar simulados automaticamente em pacotes por título e categoria
const criarPacotesAutomaticos = async () => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Buscar todos os simulados pagos agrupados por título
    const result = await client.query(`
      SELECT 
        titulo, 
        COUNT(*) as quantidade, 
        ARRAY_AGG(id) as simulado_ids
      FROM simulados 
      WHERE is_gratis = FALSE
      GROUP BY titulo
      HAVING COUNT(*) > 1
    `);
    
    const pacotesCriados = [];
    
    for (const grupo of result.rows) {
      // Verificar se já existe um pacote com este título
      const pacoteExistente = await client.query(
        'SELECT id FROM pacotes WHERE titulo = $1',
        [grupo.titulo]
      );
      
      let pacoteId;
      
      if (pacoteExistente.rows.length > 0) {
        // Atualizar pacote existente
        pacoteId = pacoteExistente.rows[0].id;
        await client.query(`
          UPDATE pacotes 
          SET updated_at = CURRENT_TIMESTAMP 
          WHERE id = $1
        `, [pacoteId]);
        
        // Limpar associações existentes
        await client.query('DELETE FROM pacote_simulados WHERE pacote_id = $1', [pacoteId]);
      } else {
        // Criar novo pacote
        const descricao = `Pacote completo com ${grupo.quantidade} simulados de ${grupo.titulo} com diferentes níveis de dificuldade. Economize 25% comprando o pacote!`;
        
        const novoPacote = await client.query(`
          INSERT INTO pacotes (titulo, descricao, preco, preco_usd, is_gratis, duracao_dias, is_subscription, subscription_duration)
          VALUES ($1, $2, 0, 0, FALSE, 365, FALSE, 365)
          RETURNING id
        `, [grupo.titulo, descricao]);
        
        pacoteId = novoPacote.rows[0].id;
      }
      
      // Associar simulados ao pacote
      for (const simuladoId of grupo.simulado_ids) {
        await client.query(`
          INSERT INTO pacote_simulados (pacote_id, simulado_id)
          VALUES ($1, $2)
          ON CONFLICT (pacote_id, simulado_id) DO NOTHING
        `, [pacoteId, simuladoId]);
      }
      
      pacotesCriados.push({
        id: pacoteId,
        titulo: grupo.titulo,
        quantidade_simulados: grupo.quantidade
      });
    }
    
    await client.query('COMMIT');
    return pacotesCriados;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar pacotes automáticos:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Exportar funções
module.exports = {
  createTableIfNotExists,
  getAllPacotes,
  getPacoteById,
  createPacote,
  updatePacote,
  deletePacote,
  getPacotesByCategoria,
  criarPacotesAutomaticos
};
