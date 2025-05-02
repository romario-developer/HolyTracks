# HolyTracks Backend

API RESTful para o aplicativo HolyTracks, desenvolvida com Node.js, Express e MongoDB.

## Recursos

- Autenticação de usuários com JWT
- Gerenciamento de perfil de usuário
- Proteção de rotas com middleware de autenticação
- Controle de acesso baseado em funções (user, admin)

## Requisitos

- Node.js 16+
- MongoDB
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/holytracks.git
cd holytracks/backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
npm run dev
```

## Configurações

### Variáveis de Ambiente

- `NODE_ENV`: Ambiente de execução (`development`, `production`)
- `PORT`: Porta onde o servidor irá rodar
- `MONGO_URI`: URL de conexão com o MongoDB
- `JWT_SECRET`: Segredo para assinar tokens JWT
- `JWT_EXPIRE`: Tempo de expiração dos tokens JWT

## Estrutura da API

### Autenticação

- `POST /api/auth/register`: Registrar um novo usuário
- `POST /api/auth/login`: Login de usuário
- `GET /api/auth/me`: Obter usuário atual
- `GET /api/auth/logout`: Logout de usuário

### Usuários

- `PUT /api/users/profile`: Atualizar perfil do usuário
- `PUT /api/users/password`: Alterar senha do usuário
- `GET /api/users/:id`: Obter um usuário pelo ID (apenas admin)
- `GET /api/users`: Obter todos os usuários (apenas admin)

## Exemplos de Uso

### Registrar um novo usuário

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "name": "Nome do Usuário",
  "email": "usuario@exemplo.com",
  "password": "senha123"
}' http://localhost:5000/api/auth/register
```

### Login

```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}' http://localhost:5000/api/auth/login
```

### Obter perfil do usuário atual

```bash
curl -X GET -H "Authorization: Bearer SEU_TOKEN" http://localhost:5000/api/auth/me
```

### Atualizar perfil

```bash
curl -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{
  "name": "Novo Nome",
  "email": "novo@exemplo.com"
}' http://localhost:5000/api/users/profile
```

## Integração com o Frontend

Para integrar este backend com o frontend React do HolyTracks:

1. Certifique-se de que o backend está rodando na porta 5000
2. Configure o frontend para acessar a API em `http://localhost:5000/api`
3. Use o serviço de autenticação para gerenciar tokens JWT
4. Armazene o token no localStorage para manter a sessão do usuário

## Estrutura do Projeto

```
holytracks-backend/
│
├── src/
│   ├── config/         # Configurações (banco de dados, etc.)
│   ├── controllers/    # Controladores da aplicação
│   ├── middleware/     # Middleware (autenticação, etc.)
│   ├── models/         # Modelos de dados (Mongoose)
│   └── routes/         # Rotas da API
│
├── .env                # Variáveis de ambiente
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Dependências e scripts
└── server.js           # Ponto de entrada da aplicação
```
