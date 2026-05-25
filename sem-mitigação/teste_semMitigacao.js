import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 10, 
  duration: '30s', 
};

export default function () {
  const url = 'http://127.0.0.1:3000/transferir'; 
  
  const params = {
    headers: {
      'Authorization': 'Bearer INSIRA_O_SEU_TOKEN_DO_BURP_AQUI',
      'Content-Type': 'application/json',
    },
  };
  
  const payload = JSON.stringify({ 
    valor: 100 
  });

  http.post(url, payload, params);
  sleep(0.1); 
}
