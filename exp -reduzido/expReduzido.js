const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const SECRET = process.env.JWT_SECRET || 'chave_mestra_reserva';
const JANELA_SEGURA_SEGUNDOS = 30;

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'vitoria' && password === '123456') {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        return res.json({ auth: true, token });
    }
    res.status(401).json({ message: 'Login inválido!' });
});

app.post('/transferir', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: 'Token não fornecido.' });

    try {
        const decoded = jwt.verify(token, SECRET);
        const agora = Math.floor(Date.now() / 1000); 
        const idadeDoToken = agora - decoded.iat;

        if (idadeDoToken > JANELA_SEGURA_SEGUNDOS) {
            return res.status(401).json({ 
                message: `Operação Negada: A janela de segurança de 30s expirou (Idade: ${idadeDoToken}s).` 
            });
        }

        res.json({ message: `Sucesso! Transferência autorizada (Token com ${idadeDoToken}s).` });

    } catch (err) {
        res.status(500).json({ message: 'Falha na autenticação: Token inválido ou expirado.' });
    }
});

app.listen(3002, () => {
    console.log(`🚀 Servidor (Tempo de Expiração Reduzido) rodando na porta 3002`);
});
