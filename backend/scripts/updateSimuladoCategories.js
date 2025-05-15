/**
 * Script para atualizar as categorias dos simulados existentes
 * Este script deve ser executado uma vez para garantir que os simulados tenham categorias válidas
 */

const db = require('../db');

const updateSimuladoCategories = async () => {
  try {
    console.log('Iniciando atualização de categorias de simulados...');
    
    // Obter todos os simulados
    const simulados = await db.query('SELECT id, titulo, descricao FROM simulados');
    
    // Categorias disponíveis
    const categories = [
      { name: 'aws', keywords: ['aws', 'amazon', 'cloud practitioner', 'solutions architect', 'developer associate', 'sysops'] },
      { name: 'azure', keywords: ['azure', 'microsoft azure', 'az-900', 'az-104', 'az-204', 'az-400'] },
      { name: 'gcp', keywords: ['gcp', 'google cloud', 'cloud engineer', 'cloud architect', 'data engineer'] },
      { name: 'comptia', keywords: ['comptia', 'a+', 'network+', 'security+', 'cloud+', 'linux+'] },
      { name: 'cisco', keywords: ['cisco', 'ccna', 'ccnp', 'ccie', 'devnet', 'network'] }
    ];
    
    // Atualizar cada simulado com uma categoria baseada em seu título ou descrição
    for (const simulado of simulados.rows) {
      const text = (simulado.titulo + ' ' + (simulado.descricao || '')).toLowerCase();
      
      // Determinar a categoria com base nas palavras-chave
      let matchedCategory = null;
      for (const category of categories) {
        if (category.keywords.some(keyword => text.includes(keyword.toLowerCase()))) {
          matchedCategory = category.name;
          break;
        }
      }
      
      // Se não encontrou uma categoria, atribui uma aleatória para fins de demonstração
      if (!matchedCategory) {
        const randomIndex = Math.floor(Math.random() * categories.length);
        matchedCategory = categories[randomIndex].name;
      }
      
      // Atualizar o simulado com a categoria
      await db.query(
        'UPDATE simulados SET categoria = $1 WHERE id = $2',
        [matchedCategory, simulado.id]
      );
      
      console.log(`Simulado ID ${simulado.id} atualizado com categoria: ${matchedCategory}`);
    }
    
    console.log('Atualização de categorias concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar categorias:', error);
  } finally {
    // Fechar a conexão com o banco de dados
    process.exit(0);
  }
};

// Executar a função
updateSimuladoCategories();
