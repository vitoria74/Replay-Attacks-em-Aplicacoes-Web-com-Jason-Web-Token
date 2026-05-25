const express = require('express');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const { randomUUID: uuidv4 } = require('crypto');
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'chave_mestra_reserva';

const redisClient = redis.createClient();
redisClient.connect()
    .then(() => console.log('✅ Conectado ao Redis com sucesso!'))
    .catch((err) => console.error('❌ Erro ao conectar ao Redis:', err));

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'vitoria' && password === '123456') {
        const jti = uuidv4();
        const token = jwt.sign({ username, jti }, SECRET, { expiresIn: '1h' });
        return res.json({ auth: true, token });
    }
   
    res.status(401).json({ message: 'Login inválido!' });
});

app.post('/transferir', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

    try {
        const decoded = jwt.verify(token, SECRET);
        const jti = decoded.jti;

        const jaFoiUsado = await redisClient.get(jti);

        if (jaFoiUsado) {
            return res.status(401).json({ 
                message: 'Ataque de Replay detectado! Este token já foi utilizado para uma operação.' 
            });
        }

        await redisClient.set(jti, 'usado', { EX: 3600 });
        
        res.json({ message: "Sucesso! Transferência realizada." });
    } catch (err) {
        res.status(500).json({ message: 'Falha ao autenticar token ou token inválido.' });
    }
});

app.listen(3001, () => {
    console.log(`🚀 Servidor Mitigado (JTI) rodando na porta 3001`);
});
