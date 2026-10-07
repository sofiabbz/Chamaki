# Chamaki Helpdesk

Sistema de helpdesk para abertura e gerenciamento de chamados técnicos. Permite que clientes registrem solicitações de suporte e técnicos gerenciem os chamados com controle de status, prioridade, categorias e comentários — tudo com autenticação segura e upload de anexos.

## Stack Tecnológica

- **Frontend:** React 19, React Router 7, Axios, React Icons, Vite 8
- **Backend:** Express 5, Prisma ORM, JWT, bcrypt, Multer
- **Banco de Dados:** PostgreSQL (via Docker)

## Funcionalidades

- Cadastro e login com autenticação JWT
- Dois perfis de acesso: **Cliente** e **Técnico** (com chave de acesso)
- Abertura de chamados com assunto, descrição, categoria e anexo (até 5MB)
- Auto-categorização e auto-prioridade com base no assunto selecionado
- Técnicos podem alterar status e prioridade dos chamados
- Sistema de comentários por chamado
- Dashboards com contadores e filtros por status/prioridade
- Relatórios estatísticos (técnico)
- Perfil do usuário com CPF e telefone
- Landing page institucional

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://www.docker.com/) (para o PostgreSQL) ou PostgreSQL 14+ local

## Instalação e Execução

### 1. Banco de Dados (Docker)

```bash
docker run --name chamaki-db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=chamaki -p 5433:5432 -d postgres
```

### 2. Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/chamaki?schema=public"
JWT_SECRET=sua-chave-secreta-aqui
TECH_ACCESS_KEY=chave-de-acesso-para-tecnicos
```

```bash
npx prisma migrate dev
npm run dev
```

O servidor roda em `http://localhost:3000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend roda em `http://localhost:5173`.

## Variáveis de Ambiente

| Variável | Local | Descrição |
|---|---|---|
| `DATABASE_URL` | `backend/.env` | URL de conexão com o PostgreSQL |
| `JWT_SECRET` | `backend/.env` | Chave secreta para assinatura dos tokens JWT |
| `TECH_ACCESS_KEY` | `backend/.env` | Chave de acesso para registro de técnicos |
| `VITE_API_URL` | `frontend/.env` | URL base da API (padrão: `http://localhost:3000/api`) |

## Estrutura de Pastas

```
ChamakiHelpdesk/
├── backend/
│   ├── prisma/              # Schema e migrations
│   ├── src/
│   │   ├── lib/             # PrismaClient centralizado
│   │   ├── middleware/      # Auth JWT, upload Multer
│   │   ├── routes/          # Rotas (users, tickets)
│   │   └── server.js
│   └── uploads/             # Anexos dos chamados
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/          # Imagens e logos
│       ├── components/      # Sidebar, Navbar, Toast, ProtectedRoute
│       ├── pages/           # Páginas da aplicação
│       ├── services/        # Instância Axios
│       ├── styles/          # CSS global e variáveis de cores
│       └── utils/           # Máscaras de input (CPF, telefone)
└── README.md
```

## Licença

Este projeto é de uso acadêmico/educacional.
