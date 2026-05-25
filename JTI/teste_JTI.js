import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InZpdG9yaWEiLCJqdGkiOiJmNzIwNzk2Yy1jMDM3LTQ3NzctODJkYi1hN2Q2MTFmYWYwODMiLCJpYXQiOjE3Nzk2NjU2ODIsImV4cCI6MTc3OTY2OTI4Mn0.4VCtvYeOR-1CSrB4gXYGeQAvgOeOhCykHEniwIfzouw";

export default function () {
  const url = 'http://127.0.0.1:3001/transferir';

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
    'bloqueado com sucesso (401)': (r) => r.status === 401,
  });

  sleep(0.1);
}
