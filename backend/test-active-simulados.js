const axios = require('axios');

async function testActiveSimulados() {
  try {
    console.log('Testando rota de simulados ativos...');
    const response = await axios.get('http://localhost:3001/api/simulados/ativos');
    console.log('Status da resposta:', response.status);
    console.log('Dados recebidos:');
    console.log(JSON.stringify(response.data, null, 2));
    
    // Verificar se os dados estão no formato esperado
    if (Array.isArray(response.data)) {
      console.log(`Número de simulados ativos: ${response.data.length}`);
      
      // Verificar cada simulado
      response.data.forEach((simulado, index) => {
        console.log(`\nSimulado ${index + 1}:`);
        console.log(`ID: ${simulado.id}`);
        console.log(`Título: ${simulado.titulo}`);
        console.log(`Ativo: ${simulado.ativo}`);
        console.log(`Duração: ${simulado.duracao_minutos} minutos`);
        console.log(`Dificuldade: ${simulado.nivel_dificuldade}`);
      });
    } else {
      console.error('A resposta não é um array!');
    }
  } catch (error) {
    console.error('Erro ao testar rota de simulados ativos:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Dados:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

testActiveSimulados();
