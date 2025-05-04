const fetch = require('node-fetch');

async function createUser() {
  try {
    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Aluno Teste',
        email: 'aluno@teste.com',
        senha: 'password'
      })
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Erro:', error);
  }
}

createUser(); 