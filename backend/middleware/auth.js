const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Middleware para controle de acesso por papel
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || !req.user.roles || !req.user.roles.includes(role)) {
            return res.status(403).json({ error: 'Acesso negado. Permissão insuficiente.' });
        }
        next();
    };
}

// Middleware para autenticação
function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido.' });
    }
}

module.exports = {
    auth,
    requireRole
}; 