const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const { randomBytes } = require('crypto'); 
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'chave_mestra_reserva';
const redisClient = redis.createClient();
redisClient.connect().then(() => console.log('✅ Redis conectado para Refresh Tokens!'));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'vitoria' && password === '123456') {
        
        const accessToken = jwt.sign({ username }, SECRET, { expiresIn: '1m' });
        const refreshToken = randomBytes(40).toString('hex');
        await redisClient.set(`refresh:${refreshToken}`, username, { EX: 7 * 24 * 60 * 60 });

        return res.json({ accessToken, refreshToken });
    }
    res.status(401).json({ message: 'Login inválido!' });
});

app.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;
    const username = await redisClient.get(`refresh:${refreshToken}`);

    if (!username) {
        return res.status(403).json({ message: 'Refresh Token inválido ou expirado.' });
    }

    const newAccessToken = jwt.sign({ username }, SECRET, { expiresIn: '1m' });
    res.json({ accessToken: newAccessToken });
});

app.post('/transferir', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET);
        res.json({ message: "Sucesso! Transferência realizada." });
    } catch (err) {
        res.status(401).json({ message: "Token expirado. Peça um novo via Refresh Token." });
    }
});

app.listen(3004, () => console.log('🚀 Servidor (Refresh Token) rodando na porta 3004'));
