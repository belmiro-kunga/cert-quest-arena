const db = require('../db');

// Cria a tabela de resultados se não existir
const createTable = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS resultados (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      simulado_id INTEGER,
      user_id INTEGER,
      answers TEXT,
      correct_answers INTEGER,
      total_questions INTEGER,
      score REAL,
      time_spent INTEGER,
      passed_exam BOOLEAN,
      completed_at TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};

// Salva um novo resultado
const saveResult = async (result) => {
  await createTable();
  const {
    simuladoId,
    userId,
    answers,
    correctAnswers,
    totalQuestions,
    score,
    timeSpent,
    passedExam,
    completedAt
  } = result;
  const res = await db.run(
    `INSERT INTO resultados (simulado_id, user_id, answers, correct_answers, total_questions, score, time_spent, passed_exam, completed_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
    [simuladoId, userId, JSON.stringify(answers), correctAnswers, totalQuestions, score, timeSpent, passedExam ? 1 : 0, completedAt]
  );
  return res.lastID;
};

// Busca resultados por usuário
const getResultsByUser = async (userId) => {
  await createTable();
  return db.all('SELECT * FROM resultados WHERE user_id = ?', [userId]);
};

// Busca resultados por simulado
const getResultsBySimulado = async (simuladoId) => {
  await createTable();
  return db.all('SELECT * FROM resultados WHERE simulado_id = ?', [simuladoId]);
};

module.exports = {
  saveResult,
  getResultsByUser,
  getResultsBySimulado,
};
