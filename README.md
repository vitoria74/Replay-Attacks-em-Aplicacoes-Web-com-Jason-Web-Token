# Replay-Attacks-em-Aplicações-Web-com-Jason-Web-Token

# 💻 Como Executar e Replicar os Experimentos

Este repositório está organizado em pastas individuais para cada estratégia de mitigação avaliada contra Replay Attacks. Para executar os servidores e rodar os testes de carga, siga os passos abaixo.

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
* **Node.js** (v20 ou superior)
* **Redis Server** (v7 ou superior)
* **k6** (Ferramenta de teste de carga da Grafana)

---

## 🛠️ Passo 1: Inicializar o Banco de Dados (Redis)

No terminal do seu sistema operacional, inicialize o serviço do Redis:

```bash
# No Linux (usei o Ubuntu)
sudo systemctl start redis-server

# Ou executando diretamente via CLI se instalado localmente
redis-server
```
---

## 🛠️ Passo 2: Configurar e Rodar o Servidor do Cenário Desejado

Abra o terminal e navegue até a pasta do cenário que deseja testar (por exemplo, a pasta sem-mitigação):

```bash
cd sem-mitigação
```
Caso seja a primeira vez executando, inicialize o gerenciador de pacotes e instale as dependências necessárias para a API:

```bash
npm init -y
npm install express jsonwebtoken redis dotenv
```

Inicialize o servidor da API Node.js correspondente:

```bash
node semMitigacao.js
```
---

## 🛠️ Passo 3: Executar os Testes de Carga com o k6

Com o servidor do cenário ativo em um terminal, abra outra janela de terminal na mesma pasta para disparar os testes automatizados com os Usuários Virtuais.

```bash
k6 run teste_semMitigacao.js
```
