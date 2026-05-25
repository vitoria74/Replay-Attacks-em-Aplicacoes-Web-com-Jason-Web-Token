import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpdG9yaWEiLCJpYXQiOjE3Nzk2NjY3MDMsImV4cCI6MTc3OTY3MDMwM30.uoRs11ccEo_n3FCs3eV13uC7_5AtQA-xMwBiIn5XI7Y";

export default function () {
  const url = 'http://127.0.0.1:3002/transferir';

  const payload = JSON.stringify({
    valor: 100
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status é 200': (r) => r.status === 200,
  });

  sleep(0.1);
}
