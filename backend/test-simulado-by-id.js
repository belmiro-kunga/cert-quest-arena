const axios = require('axios');

async function testSimuladoById(id) {
  try {
    console.log(`Testando busca de simulado com ID ${id}...`);
    const response = await axios.get(`http://localhost:3001/api/simulados/${id}`);
    console.log('Status da resposta:', response.status);
    console.log('Dados recebidos:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Verificar se o campo quantidade_questoes está presente
    if (response.data && response.data.quantidade_questoes !== undefined) {
      console.log(`Número de questões: ${response.data.quantidade_questoes}`);
    } else {
      console.log('Campo quantidade_questoes não encontrado na resposta!');
    }
  } catch (error) {
    console.error('Erro ao testar busca de simulado:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Dados:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

// Testar com o ID 3
testSimuladoById(3);
