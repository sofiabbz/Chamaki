# Chamaki Helpdesk

Sistema de helpdesk para abertura e gerenciamento de chamados técnicos. Permite que clientes abram chamados e técnicos os gerenciem, com autenticação JWT, upload de anexos e relatórios.

## Stack Tecnológica

- **Frontend:** React 19, React Router, Axios, Vite
- **Backend:** Express 5, Prisma ORM, JWT, bcrypt, multer
- **Banco de Dados:** PostgreSQL

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalação e execução

### Backend

```bash
cd backend
npm install
```

Crie um arquivo `.env` na pasta `backend/` com:

```
DATABASE_URL="postgresql://usuario:senha@localhost:5432/chamaki"
JWT_SECRET=sua-chave-secreta-aqui
```

Execute as migrations e inicie o servidor:

```bash
npx prisma migrate dev
npm run dev
```

O servidor roda em `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
```

Opcionalmente, crie um arquivo `.env` na pasta `frontend/`:

```
VITE_API_URL=http://localhost:3000/api
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

## Variáveis de Ambiente

| Variável | Local | Descrição |
|---|---|---|
| `DATABASE_URL` | backend/.env | URL de conexão com o PostgreSQL |
| `JWT_SECRET` | backend/.env | Chave secreta para assinatura dos tokens JWT |
| `VITE_API_URL` | frontend/.env | URL base da API (padrão: http://localhost:3000/api) |

## Estrutura de Pastas

```
ChamakiHelpdesk/
├── backend/
│   ├── prisma/           # Schema e migrations do banco
│   ├── src/
│   │   ├── lib/          # PrismaClient centralizado
│   │   ├── middleware/    # Auth JWT, upload multer
│   │   ├── routes/       # Rotas de usuário e tickets
│   │   └── server.js     # Entrada do servidor Express
│   └── uploads/          # Arquivos anexados aos chamados
├── frontend/
│   ├── public/           # Ícones e assets estáticos
│   └── src/
│       ├── assets/       # Imagens e logos
│       ├── components/   # Sidebar, Toast, ProtectedRoute, etc.
│       ├── pages/        # Páginas da aplicação
│       ├── services/     # Instância centralizada do axios
│       └── utils/        # Máscaras de input (CPF, telefone)
└── README.md
```
