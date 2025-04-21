# Backend do App Missa

API RESTful para o aplicativo App Missa, desenvolvida com Node.js, Express e MongoDB.

## Recursos

- Autenticação de usuários com JWT
- Upload de arquivos para Amazon S3
- CRUD completo para músicas e tracks
- Suporte a diferentes tempos litúrgicos
- Gerenciamento de marcadores para cada música

## Requisitos

- Node.js 16+
- MongoDB
- Conta AWS (para armazenamento S3)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/app-missa.git
cd app-missa/server
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
- `AWS_ACCESS_KEY_ID`: Chave de acesso da AWS
- `AWS_SECRET_ACCESS_KEY`: Chave secreta da AWS
- `AWS_REGION`: Região da AWS
- `AWS_BUCKET_NAME`: Nome do bucket S3

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

### Músicas

- `GET /api/songs`: Obter todas as músicas do usuário
- `GET /api/songs/:id`: Obter uma música pelo ID
- `POST /api/songs`: Criar uma nova música
- `PUT /api/songs/:id`: Atualizar uma música
- `DELETE /api/songs/:id`: Excluir uma música
- `POST /api/songs/:id/markers`: Adicionar um marcador à música
- `DELETE /api/songs/:id/markers/:markerId`: Remover um marcador da música

### Upload

- `POST /api/upload`: Upload de um arquivo de áudio
- `POST /api/upload/multiple`: Upload de múltiplos arquivos de áudio
- `DELETE /api/upload/:id`: Excluir um arquivo de áudio
- `GET /api/upload/:id/download`: Obter URL para download do arquivo

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

### Criar uma música

```bash
curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer SEU_TOKEN" -d '{
  "title": "Santo - Comunhão",
  "key": "D",
  "bpm": 120,
  "timeSignature": "4/4",
  "tempo": "comum",
  "notes": "Música para a comunhão"
}' http://localhost:5000/api/songs
```

## Autores

Equipe App Missa