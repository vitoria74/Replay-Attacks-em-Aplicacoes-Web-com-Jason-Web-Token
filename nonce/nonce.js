const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const { randomBytes } = require('crypto'); 
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'chave_mestra_reserva';
const redisClient = redis.createClient();
redisClient.connect().then(() => console.log('✅ Redis conectado para Nonce Unificado!'));

app.get('/gerar-nonce', async (req, res) => {
    try {
        const nonce = randomBytes(16).toString('hex');
        await redisClient.set(`nonce:${nonce}`, 'valido', { EX: 300 }); 
        res.json({ nonce });
    } catch (err) {
        res.status(500).json({ error: "Erro ao gerar Nonce" });
    }
});

app.post('/transferir-legitimo', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { nonce } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET);
        const nonceExiste = await redisClient.get(`nonce:${nonce}`);
        
        if (!nonceExiste) {
            return res.status(401).json({ message: "Nonce inválido ou já utilizado." });
        }

        await redisClient.del(`nonce:${nonce}`); 
        res.json({ message: "Sucesso! Transferência realizada." });
    } catch (err) {
        res.status(401).json({ message: "Token expirado ou inválido." });
    }
});

app.post('/transferir', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    const { nonce } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET);
        const nonceExiste = await redisClient.get(`nonce:${nonce}`);
        
        if (!nonceExiste) {
            return res.status(401).json({ message: "Nonce inválido ou já utilizado." });
        }

        await redisClient.del(`nonce:${nonce}`);
        res.json({ message: "Sucesso! Transferência realizada." });
    } catch (err) {
        res.status(401).json({ message: "Token expirado ou inválido." });
    }
});

app.listen(3003, () => console.log('🚀 Servidor (Nonce Unificado) rodando na porta 3003'));
