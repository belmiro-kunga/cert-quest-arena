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
        porcentagem_desconto INTEGER DEFAULT 25,
        categoria VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Verificar se a coluna preco existe, se não, adicioná-la
    try {
      await db.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = 'pacotes' AND column_name = 'preco'
          ) THEN
            ALTER TABLE pacotes ADD COLUMN preco DECIMAL(10,2) DEFAULT 0;
          END IF;
        END $$;
      `);
      console.log('Verificação da coluna preco concluída');
    } catch (columnError) {
      console.error('Erro ao verificar/adicionar coluna preco:', columnError);
    }

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
  porcentagem_desconto: typeof pacote.porcentagem_desconto === 'number' ? pacote.porcentagem_desconto : 25,
  categoria: pacote.categoria || '',
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
      preco_usd,
      is_gratis,
      duracao_dias = 365, // Duração padrão de 1 ano
      simulado_ids,
      ativo = true,
      is_subscription = false,
      subscription_duration = 365, // Duração padrão da subscrição
      subscription_price,
      subscription_currency = 'BRL',
      porcentagem_desconto
    } = pacoteData;
    
    // Usar preco_usd como valor para preco também
    const preco = preco_usd;
    
    // Verificar quais colunas existem na tabela
    const tableInfo = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pacotes'
    `);
    
    const columns = tableInfo.rows.map(row => row.column_name);
    console.log('Colunas disponíveis:', columns);
    
    // Construir a query dinamicamente com base nas colunas existentes
    let insertColumns = ['titulo', 'descricao'];
    let insertValues = [titulo, descricao];
    let placeholders = ['$1', '$2'];
    let paramIndex = 3;
    
    if (columns.includes('preco')) {
      insertColumns.push('preco');
      insertValues.push(preco);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('preco_usd')) {
      insertColumns.push('preco_usd');
      insertValues.push(preco_usd);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('is_gratis')) {
      insertColumns.push('is_gratis');
      insertValues.push(is_gratis);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('duracao_dias')) {
      insertColumns.push('duracao_dias');
      insertValues.push(duracao_dias);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('ativo')) {
      insertColumns.push('ativo');
      insertValues.push(ativo);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('is_subscription')) {
      insertColumns.push('is_subscription');
      insertValues.push(is_subscription);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('subscription_duration')) {
      insertColumns.push('subscription_duration');
      insertValues.push(subscription_duration);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('subscription_price') && subscription_price) {
      insertColumns.push('subscription_price');
      insertValues.push(subscription_price);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('subscription_currency')) {
      insertColumns.push('subscription_currency');
      insertValues.push(subscription_currency);
      placeholders.push(`$${paramIndex++}`);
    }
    
    if (columns.includes('porcentagem_desconto')) {
      insertColumns.push('porcentagem_desconto');
      insertValues.push(porcentagem_desconto || 25);
      placeholders.push(`$${paramIndex++}`);
    }
    
    // Construir e executar a query
    const insertQuery = `
      INSERT INTO pacotes (${insertColumns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;
    
    console.log('Query de inserção:', insertQuery);
    console.log('Valores:', insertValues);
    
    const pacoteResult = await client.query(insertQuery, insertValues);
    
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
      preco_usd,
      is_gratis,
      duracao_dias,
      simulados,
      ativo,
      is_subscription,
      subscription_duration,
      subscription_price,
      subscription_currency,
      porcentagem_desconto
    } = pacoteData;
    
    // Usar preco_usd como valor para preco também
    const preco = preco_usd;
    
    // Verificar quais colunas existem na tabela
    const tableInfo = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'pacotes'
    `);
    
    const columns = tableInfo.rows.map(row => row.column_name);
    console.log('Colunas disponíveis para atualização:', columns);
    
    // Construir a query dinamicamente com base nas colunas existentes
    let updateParts = [];
    let updateValues = [];
    let paramIndex = 1;
    
    if (titulo !== undefined && columns.includes('titulo')) {
      updateParts.push(`titulo = $${paramIndex++}`);
      updateValues.push(titulo);
    }
    
    if (descricao !== undefined && columns.includes('descricao')) {
      updateParts.push(`descricao = $${paramIndex++}`);
      updateValues.push(descricao);
    }
    
    if (preco !== undefined && columns.includes('preco')) {
      updateParts.push(`preco = $${paramIndex++}`);
      updateValues.push(preco);
    }
    
    if (preco_usd !== undefined && columns.includes('preco_usd')) {
      updateParts.push(`preco_usd = $${paramIndex++}`);
      updateValues.push(preco_usd);
    }
    
    if (is_gratis !== undefined && columns.includes('is_gratis')) {
      updateParts.push(`is_gratis = $${paramIndex++}`);
      updateValues.push(is_gratis);
    }
    
    if (duracao_dias !== undefined && columns.includes('duracao_dias')) {
      updateParts.push(`duracao_dias = $${paramIndex++}`);
      updateValues.push(duracao_dias);
    }
    
    if (ativo !== undefined && columns.includes('ativo')) {
      updateParts.push(`ativo = $${paramIndex++}`);
      updateValues.push(ativo);
    }
    
    if (is_subscription !== undefined && columns.includes('is_subscription')) {
      updateParts.push(`is_subscription = $${paramIndex++}`);
      updateValues.push(is_subscription);
    }
    
    if (subscription_duration !== undefined && columns.includes('subscription_duration')) {
      updateParts.push(`subscription_duration = $${paramIndex++}`);
      updateValues.push(subscription_duration);
    }
    
    if (subscription_price !== undefined && columns.includes('subscription_price')) {
      updateParts.push(`subscription_price = $${paramIndex++}`);
      updateValues.push(subscription_price);
    }
    
    if (subscription_currency !== undefined && columns.includes('subscription_currency')) {
      updateParts.push(`subscription_currency = $${paramIndex++}`);
      updateValues.push(subscription_currency);
    }
    
    if (porcentagem_desconto !== undefined && columns.includes('porcentagem_desconto')) {
      updateParts.push(`porcentagem_desconto = $${paramIndex++}`);
      updateValues.push(porcentagem_desconto);
    }
    
    if (columns.includes('updated_at')) {
      updateParts.push(`updated_at = CURRENT_TIMESTAMP`);
    }
    
    // Adicionar o ID como último parâmetro
    updateValues.push(id);
    
    // Construir e executar a query de atualização
    const updateQuery = `
      UPDATE pacotes
      SET ${updateParts.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;
    
    console.log('Query de atualização:', updateQuery);
    console.log('Valores de atualização:', updateValues);
    
    const pacoteResult = await client.query(updateQuery, updateValues);
    
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
