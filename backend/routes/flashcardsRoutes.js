const express = require('express');
const router = express.Router();

// Rota GET /api/flashcards - retorna uma lista vazia
router.get('/', async (req, res) => {
  res.json([]);
});

module.exports = router; 