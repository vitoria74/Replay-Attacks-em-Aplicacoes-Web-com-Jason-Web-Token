const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'chave_mestra_reserva';

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'vitoria' && password === '123456') {
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
        return res.json({ auth: true, token });
    }
    
    res.status(401).json({ message: 'Login inválido!' });
});

app.post('/transferir', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(500).json({ message: 'Falha ao autenticar token.' });

        res.json({ message: `Sucesso! R$ 100,00 transferidos por ${decoded.username}.` });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
       console.log(`Servidor rodando na porta ${PORT}...`);
});
