const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const simuladoRoutes = require('../routes/simuladoRoutes');

// Cria app isolado para teste
const app = express();
app.use(bodyParser.json());
app.use('/api/simulados', simuladoRoutes);

describe('Rotas de Simulados', () => {
  let simuladoId;

  it('deve criar um simulado com idioma válido', async () => {
    const res = await request(app)
      .post('/api/simulados')
      .send({
        titulo: 'Simulado Teste Jest',
        duracao_minutos: 30,
        language: 'en'
      });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.language).toBe('en');
    simuladoId = res.body.id;
  });

  it('não deve criar simulado com idioma inválido', async () => {
    const res = await request(app)
      .post('/api/simulados')
      .send({
        titulo: 'Simulado Teste Jest',
        duracao_minutos: 30,
        language: 'xx'
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
    expect(res.text).toMatch(/Idioma inválido/);
  });

  it('deve editar o idioma do simulado', async () => {
    if (!simuladoId) return;
    const res = await request(app)
      .put(`/api/simulados/${simuladoId}`)
      .send({ titulo: 'Simulado Teste Jest', duracao_minutos: 30, language: 'es' });
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.language).toBe('es');
  });

  it('deve listar simulados com campo language padronizado', async () => {
    const res = await request(app).get('/api/simulados');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    res.body.forEach(simulado => {
      expect(['pt', 'en', 'fr', 'es']).toContain(simulado.language);
      expect(simulado).toHaveProperty('title');
      expect(simulado).toHaveProperty('questions_count');
    });
  });
});
