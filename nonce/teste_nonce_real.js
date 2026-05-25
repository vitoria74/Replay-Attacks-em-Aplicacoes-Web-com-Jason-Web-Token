import http from 'k6/http';
import { sleep } from 'k6';
import crypto from 'k6/crypto';
import encoding from 'k6/encoding';

export const options = {
    scenarios: {
        cenario_real: {
            executor: 'constant-vus',
            exec: 'testarCenarioReal',
            vus: 10,
            duration: '30s',
        },
    },
};

function gerarTokenTCC() {
    const header = b64url(encoding.b64encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
    const payload = b64url(encoding.b64encode(JSON.stringify({ 
        username: "vitoria", 
        role: "admin",
        exp: Math.floor(Date.now() / 1000) + 3600 
    })));
    const assinatura = crypto.hmac("sha256", "chave_mestra_reserva", `${header}.${payload}`, "hex");
    const assinaturaB64 = b64url(encoding.b64encode(assinatura));
    return `${header}.${payload}.${assinaturaB64}`;
}

function b64url(input) {
    return input.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

const TOKEN = gerarTokenTCC();

export function testarCenarioReal() {
    const params = {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    const rNonce = http.get('http://127.0.0.1:3003/gerar-nonce');
    
    if (rNonce.status === 200) {
        const nonceValido = JSON.parse(rNonce.body).nonce;
        const payload = JSON.stringify({ nonce: nonceValido });
        
        http.post('http://127.0.0.1:3003/transferir-legitimo', payload, params);
    }

    sleep(0.1);
}

export function testarCenarioAtaque() {
    const params = {
        headers: {
            'Authorization': `Bearer ${TOKEN}`,
            'Content-Type': 'application/json',
        },
    };

    const payload = JSON.stringify({ nonce: "nonce_ataque_replay_falso" });
    http.post('http://127.0.0.1:3003/transferir', payload, params);

    sleep(0.1);
}
