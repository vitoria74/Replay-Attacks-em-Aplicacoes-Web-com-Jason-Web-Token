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

function gerarTokenExpirado() {
    const header = b64url(encoding.b64encode(JSON.stringify({ alg: "HS256", typ: "JWT" })));
    const payload = b64url(encoding.b64encode(JSON.stringify({ 
        username: "vitoria", 
        role: "admin",
        exp: Math.floor(Date.now() / 1000) - 10 
    })));
    const assinatura = crypto.hmac("sha256", "chave_mestra_reserva", `${header}.${payload}`, "hex");
    const assinaturaB64 = b64url(encoding.b64encode(assinatura));
    return `${header}.${payload}.${assinaturaB64}`;
}

function b64url(input) {
    return input.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function testarCenarioReal() {
    const loginUrl = 'http://127.0.0.1:3004/login';
    const loginPayload = JSON.stringify({ username: "vitoria", password: "123456" });
    const loginParams = { headers: { 'Content-Type': 'application/json' } };
    
    const loginRes = http.post(loginUrl, loginPayload, loginParams);
    
    if (loginRes.status === 200) {
        const accessToken = JSON.parse(loginRes.body).accessToken;
        
        const params = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        };

        const payload = JSON.stringify({ valor: 100 });
        http.post('http://127.0.0.1:3004/transferir', payload, params);
    }
    
    sleep(0.1);
}

export function testarCenarioAtaque() {
    const token = gerarTokenExpirado();
    const params = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    const payload = JSON.stringify({ valor: 100 });
    http.post('http://127.0.0.1:3004/transferir', payload, params);
    sleep(0.1);
}
