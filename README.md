# � Sistema de Farmácia - E-commerce Completo

Sistema completo de e-commerce para farmácia desenvolvido com **React + TypeScript** no frontend e **Node.js + Express + Prisma** no backend.

## 🚀 Funcionalidades

### � **Sistema de Autenticação**
- ✅ Login e registro para clientes e vendedores  
- ✅ Autenticação JWT com roles (CUSTOMER/SELLER)
- ✅ Cadastro completo (telefone, aniversário)

### 🛍️ **Para Clientes**
- ✅ Catálogo de produtos por categorias
- ✅ Busca inteligente por nome/descrição/marca
- ✅ Carrinho de compras com validação de estoque
- ✅ Checkout completo com histórico de pedidos
- ✅ Interface responsiva (grid/lista)

### 🏪 **Para Vendedores**
- ✅ Dashboard com estatísticas de vendas
- ✅ CRUD completo de produtos com upload de imagens
- ✅ Gerenciamento de estoque em tempo real
- ✅ Visualização de vendas realizadas

### 🎨 **Interface**
- ✅ Design moderno com Tailwind CSS
- ✅ Responsivo para mobile e desktop
- ✅ Navegação intuitiva por categorias
- ✅ Feedback visual para todas as ações

## 🏗️ Arquitetura

```
pharmacy/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + Prisma
├── vercel.json        # Configuração do Vercel
└── README.md
```

## ⚙️ Como Rodar o Projeto

### 📋 **Pré-requisitos**
- Node.js 18+ 
- PostgreSQL
- npm ou yarn

### 🔧 **1. Clone o Repositório**
```bash
git clone https://github.com/Douglasffjw/pharmacy.git
cd pharmacy
```



### 🔨 **3. Setup do Backend**
```bash
cd backend

# Instalar dependências
npm install

# Rodar migrações do banco
npx prisma migrate dev

# Popular banco com dados de teste (opcional)
npm run seed

# Iniciar servidor de desenvolvimento
npm run dev
```

**✅ Backend rodando em:** `http://localhost:3000`

### 🎨 **4. Setup do Frontend**
```bash
# Em outro terminal
cd frontend

# Instalar dependências  
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

**✅ Frontend rodando em:** `http://localhost:5173`

## 🧪 **Dados de Teste**

Após rodar `npm run seed`, você terá:

### 🔑 **Credenciais de Login:**
- **Admin/Vendedor**: `admin@farmasaude.com` / `admin123`
- **Cliente**: `cliente@exemplo.com` / `123456`

### 📦 **Produtos de Exemplo:**
- 10 produtos em diferentes categorias
- Medicamentos, Cosméticos, Higiene, etc.
- Com imagens e preços definidos

## 🚀 Deploy

### **Frontend (Vercel)**
O arquivo `vercel.json` já está configurado:
```bash
# Deploy automático ao fazer push para main
git push origin main
```

### **Backend (Railway/Render/Heroku)**
Configure as mesmas variáveis de ambiente:
- `DATABASE_URL`
- `JWT_SECRET`

## 📚 **Tecnologias Utilizadas**

### **Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (estilização)
- React Router (roteamento)
- Axios (HTTP client)
- Lucide React (ícones)

### **Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (autenticação)
- bcrypt (hash de senhas)
- Multer (upload de arquivos)

## �️ **Scripts Disponíveis**

### **Backend (`/backend`)**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Iniciar servidor de produção
npm run seed         # Popular banco com dados de teste
```

### **Frontend (`/frontend`)**
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Visualizar build localmente
```

## 🔐 **Variáveis de Ambiente**

### **Backend (`.env`)**
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/pharmacy_db"
JWT_SECRET="seu_jwt_secret_muito_seguro_aqui"
```

### **Frontend** (opcional)
```env
VITE_API_URL="http://localhost:3001"  # URL da API
```
- **React Router DOM** - Roteamento e proteção de rotas
- **Tailwind CSS** - Estilização responsiva
- **Lucide React** - Ícones modernos
- **Vite** - Build tool e dev server
- **Context API** - Gerenciamento de estado global

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas

## 📦 Instalação e Execução

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Git

### Credenciais de Teste
```
Vendedor Admin:
Email: admin@farmasaude.com
Senha: admin123
```

### Passos para instalação

1. **Clone o repositório**
```bash
git clone (https://github.com/DarcMary/pharmacy.git)
cd pharmacy
```

2. **Instale as dependências**
```bash
npm install
```

3. **Execute o projeto em modo de desenvolvimento**
```bash
npm run dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

### Scripts disponíveis

```bash
# Frontend (na pasta frontend)
npm run dev      # Inicia o servidor de desenvolvimento

# Backend (na pasta backend)
npm run dev      # Inicia o servidor de desenvolvimento

```

## 🏗️ Estrutura do Projeto

```
frontend/
└── src/
    ├── components/          # Componentes reutilizáveis
    │   ├── Header.tsx      # Cabeçalho com navegação
    │   ├── ProductCard.tsx # Card de produto
    │   └── PrivateRoute.tsx # Proteção de rotas
    ├── contexts/           # Contextos React
    │   ├── CartContext.tsx # Gerenciamento do carrinho
    │   └── AuthContext.tsx # Autenticação e autorização
    ├── data/              # Dados estáticos
    │   └── products.ts    # Base de produtos
    ├── pages/             # Páginas da aplicação
    │   ├── HomePage.tsx   # Página de produtos
    │   ├── WelcomePage.tsx # Página inicial
    │   ├── LoginPage.tsx  # Login de usuários
    │   ├── RegisterCustomerPage.tsx # Registro de clientes
    │   ├── RegisterSellerPage.tsx # Registro de vendedores
    │   ├── ProductDetailPage.tsx # Detalhes do produto
    │   └── CartPage.tsx   # Carrinho de compras
    ├── types/            # Definições de tipos
    │   └── auth.ts      # Tipos de autenticação
    ├── App.tsx          # Componente principal
    ├── main.tsx        # Ponto de entrada
    └── index.css       # Estilos globais

backend/
└── src/
    ├── controllers/    # Controladores da API
    │   └── AuthController.ts # Autenticação
    ├── middlewares/   # Middlewares Express
    │   ├── auth.ts    # Autenticação JWT
    │   └── sellerAuth.ts # Autorização de vendedor
    ├── types/        # Definições de tipos
    │   └── auth.ts   # Tipos de autenticação
    ├── utils/        # Utilitários
    │   └── jwt.ts    # Geração de tokens
    └── index.ts      # Ponto de entrada
```

## 🛍️ Produtos Disponíveis

A aplicação conta com mais de 100 produtos distribuídos nas seguintes categorias:

### 💊 Medicamentos (33 produtos)
- Analgésicos e antitérmicos
- Anti-inflamatórios
- Antibióticos (com receita)
- Anti-hipertensivos (com receita)
- Antidepressivos (com receita)
- E muito mais...

### 💄 Cosméticos (20 produtos)
- Protetores solares
- Cremes hidratantes
- Produtos capilares
- Cuidados faciais
- Maquiagem básica

### 💊 Vitaminas e Suplementos (20 produtos)
- Vitaminas A, B, C, D, E, K
- Complexos vitamínicos
- Minerais (Zinco, Magnésio, Ferro)
- Ômega 3 e Colágeno
- Suplementos especializados

### 🧼 Higiene e Cuidados (20+ produtos)
- Produtos de higiene bucal
- Cuidados corporais
- Produtos infantis
- Antissépticos
- Produtos íntimos

### 🩺 Equipamentos (7 produtos)
- Termômetros
- Máscaras cirúrgicas
- Equipamentos de medição
- Materiais de primeiros socorros

## 🎨 Design System

### Cores Principais
- **Verde Primário**: `#059669` (green-600)
- **Verde Secundário**: `#047857` (green-700)
- **Cinza Neutro**: `#6B7280` (gray-500)
- **Branco**: `#FFFFFF`
- **Vermelho Alerta**: `#EF4444` (red-500)

### Tipografia
- **Fonte Principal**: Sistema (sans-serif)
- **Tamanhos**: 12px a 48px
- **Pesos**: 400 (normal), 600 (semibold), 700 (bold)

## 🔧 Funcionalidades Técnicas

### Gerenciamento de Estado
- **Context API** para carrinho de compras
- **useReducer** para operações complexas
- **Estado local** para componentes específicos

### Roteamento
- **React Router DOM v7** para navegação
- **Rotas dinâmicas** para detalhes de produtos
- **Navegação programática** com hooks

### Responsividade
- **Mobile-first** approach
- **Breakpoints Tailwind**: sm, md, lg, xl
- **Grid responsivo** para produtos
- **Menu adaptativo** para mobile

Desenvolvido com ❤️ para demonstrar as melhores práticas em desenvolvimento React.

## 📝 Últimas mudanças

- Migracao Prisma adicionada: `prisma/migrations/20251227235000_initial` (cria enums `Papel` e `StatusPedido`, tabelas `usuarios`, `produtos`, `pedidos` e `itens_pedido`, índices e chaves estrangeiras).
- Seed atualizado: `backend/src/seed.ts` e `backend/src/run-seed.ts` agora criam automaticamente um usuário admin, um cliente de exemplo, um vendedor de exemplo e 10 produtos de demonstração (IDs fixos para compatibilidade com o frontend). Credenciais geradas pelo seed:
   - Admin: `admin@farmasaude.com` / `admin123`
   - Cliente: `cliente@exemplo.com` / `123456`
   - Vendedor: `vendedor@exemplo.com` / `vendedor123`
- Adicionado `backend/regenerate-prisma.js` como workaround automatizado para regenerar o Prisma Client (`npx prisma generate`) caso haja problemas locais com a pasta `.prisma`.
- Script de seed: execute `npm run seed` dentro de `backend` (rode `ts-node src/run-seed.ts`).
- Observação de ambiente: o servidor backend inicia por padrão na porta `3000` (arquivo `backend/src/index.ts`) e ativa o seed na inicialização para garantir as credenciais e dados de teste.

Se desejar, posso também ajustar outras seções do README para refletir mudanças adicionais (por exemplo, onde indicar o local do `.env`).
