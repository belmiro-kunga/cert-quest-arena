/**
 * Modelo para gerenciamento de questões
 */

const db = require('../db');

// Criar a tabela de questões se ela não existir
const createTableIfNotExists = async () => {
  try {
    // Tabela principal de questões
    await db.query(`
      CREATE TABLE IF NOT EXISTS questoes (
        id SERIAL PRIMARY KEY,
        simulado_id INTEGER REFERENCES simulados(id) ON DELETE CASCADE,
        texto TEXT NOT NULL,
        tipo VARCHAR(50) NOT NULL,
        explicacao TEXT,
        categoria VARCHAR(100),
        dificuldade VARCHAR(50) DEFAULT 'Médio',
        pontos INTEGER DEFAULT 1,
        tags TEXT[],
        url_referencia TEXT,
        referencia_ativa BOOLEAN DEFAULT TRUE
      )
    `);
    
    // Tabela para opções de questões de múltipla escolha
    await db.query(`
      CREATE TABLE IF NOT EXISTS opcoes_questao (
        id SERIAL PRIMARY KEY,
        questao_id INTEGER REFERENCES questoes(id) ON DELETE CASCADE,
        texto TEXT NOT NULL,
        correta BOOLEAN DEFAULT FALSE
      )
    `);
    
    console.log('Tabelas de questões verificadas/criadas com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar tabelas de questões:', error);
    throw error;
  }
};

// Inicializar o modelo
const initialize = async () => {
  try {
    await createTableIfNotExists();
    return true;
  } catch (error) {
    console.error('Erro ao inicializar modelo de questões:', error);
    throw error;
  }
};

// Criar uma nova questão
const createQuestao = async (questao) => {
  // Validação de idioma
  const idiomasValidos = ['pt', 'en', 'fr', 'es'];
  if (questao.language && !idiomasValidos.includes(questao.language)) {
    throw new Error(`Idioma inválido: ${questao.language}. Os valores aceitos são: ${idiomasValidos.join(', ')}`);
  }
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Inserir a questão principal
    const questaoResult = await client.query(
      `INSERT INTO questoes 
        (simulado_id, texto, tipo, explicacao, categoria, dificuldade, pontos, tags, url_referencia, referencia_ativa, language) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       RETURNING *`,
      [
        questao.simulado_id,
        questao.texto,
        questao.tipo,
        questao.explicacao || '',
        questao.categoria || '',
        questao.dificuldade || 'Médio',
        questao.pontos || 1,
        questao.tags || [],
        questao.url_referencia || '',
        typeof questao.referencia_ativa === 'boolean' ? questao.referencia_ativa : true,
        questao.language || 'pt'
      ]
    );
    
    const novaQuestao = questaoResult.rows[0];
    
    // Se for questão de múltipla escolha ou escolha única, inserir as opções
    if (questao.opcoes && (questao.tipo === 'multiple_choice' || questao.tipo === 'single_choice')) {
      for (const opcao of questao.opcoes) {
        await client.query(
          `INSERT INTO opcoes_questao (questao_id, texto, correta) VALUES ($1, $2, $3)`,
          [novaQuestao.id, opcao.texto, opcao.correta]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Buscar a questão completa com suas opções
    return await getQuestaoById(novaQuestao.id);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao criar questão:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Obter todas as questões de um simulado
// Agora aceita parâmetro opcional de idioma
const getQuestoesBySimuladoId = async (simuladoId, language) => {
  try {
    let questoesResult;
    if (language) {
      questoesResult = await db.query(
        `SELECT * FROM questoes WHERE simulado_id = $1 AND language = $2 ORDER BY id`,
        [simuladoId, language]
      );
    } else {
      questoesResult = await db.query(
        `SELECT * FROM questoes WHERE simulado_id = $1 ORDER BY id`,
        [simuladoId]
      );
    }
    const questoes = questoesResult.rows;
    // Para cada questão, buscar suas opções (se aplicável)
    for (const questao of questoes) {
      if (questao.tipo === 'multiple_choice' || questao.tipo === 'single_choice') {
        const opcoesResult = await db.query(
          `SELECT * FROM opcoes_questao WHERE questao_id = $1 ORDER BY id`,
          [questao.id]
        );
        questao.opcoes = opcoesResult.rows;
      }
    }
    return questoes;
  } catch (error) {
    console.error(`Erro ao buscar questões do simulado ${simuladoId}:`, error);
    throw error;
  }
};

// Obter uma questão específica pelo ID
const getQuestaoById = async (questaoId) => {
  try {
    // Buscar a questão
    const questaoResult = await db.query(
      `SELECT * FROM questoes WHERE id = $1`,
      [questaoId]
    );
    
    if (questaoResult.rows.length === 0) {
      return null;
    }
    
    const questao = questaoResult.rows[0];
    
    // Buscar as opções da questão (se aplicável)
    if (questao.tipo === 'multiple_choice' || questao.tipo === 'single_choice') {
      const opcoesResult = await db.query(
        `SELECT * FROM opcoes_questao WHERE questao_id = $1 ORDER BY id`,
        [questao.id]
      );
      questao.opcoes = opcoesResult.rows;
    }
    
    return questao;
  } catch (error) {
    console.error(`Erro ao buscar questão ${questaoId}:`, error);
    throw error;
  }
};

// Atualizar uma questão
const updateQuestao = async (questaoId, questao) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    // Atualizar a questão principal
    console.log('DEBUG updateQuestao - dados recebidos:', {
  texto: questao.texto,
  tipo: questao.tipo,
  explicacao: questao.explicacao,
  categoria: questao.categoria,
  dificuldade: questao.dificuldade,
  pontos: questao.pontos,
  tags: questao.tags,
  url_referencia: questao.url_referencia,
  referencia_ativa: questao.referencia_ativa,
  questaoId: questaoId
});
await client.query(
      `UPDATE questoes 
       SET texto = $1, tipo = $2, explicacao = $3, categoria = $4, 
           dificuldade = $5, pontos = $6, tags = $7, url_referencia = $8, referencia_ativa = $9
       WHERE id = $10`,
      [
        questao.texto,
        questao.tipo,
        questao.explicacao || '',
        questao.categoria || '',
        questao.dificuldade || 'Médio',
        questao.pontos || 1,
        questao.tags || [],
        questao.url_referencia || '',
        typeof questao.referencia_ativa === 'boolean' ? questao.referencia_ativa : true,
        questaoId
      ]
    );
    
    // Se for questão de múltipla escolha ou escolha única, atualizar as opções
    if (questao.opcoes && (questao.tipo === 'multiple_choice' || questao.tipo === 'single_choice')) {
      // Remover opções antigas
      await client.query(
        `DELETE FROM opcoes_questao WHERE questao_id = $1`,
        [questaoId]
      );
      
      // Inserir novas opções
      for (const opcao of questao.opcoes) {
        await client.query(
          `INSERT INTO opcoes_questao (questao_id, texto, correta) VALUES ($1, $2, $3)`,
          [questaoId, opcao.texto, opcao.correta]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Buscar a questão atualizada
    return await getQuestaoById(questaoId);
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Erro ao atualizar questão ${questaoId}:`, error);
    throw error;
  } finally {
    client.release();
  }
};

// Excluir uma questão
const deleteQuestao = async (questaoId) => {
  try {
    // As opções serão excluídas automaticamente devido à restrição ON DELETE CASCADE
    await db.query(
      `DELETE FROM questoes WHERE id = $1`,
      [questaoId]
    );
    
    return true;
  } catch (error) {
    console.error(`Erro ao excluir questão ${questaoId}:`, error);
    throw error;
  }
};

module.exports = {
  initialize,
  createQuestao,
  getQuestoesBySimuladoId,
  getQuestaoById,
  updateQuestao,
  deleteQuestao
};
