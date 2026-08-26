<h1 align="center">BorrachaPro - Sistema de Gestão de Estoque e Integração com Mercado Livre</h1>

<p align="center">
  Uma plataforma web completa para controle de estoque de pneus, automatizando a baixa no estoque local assim que uma venda é realizada no Mercado Livre via Webhooks.
</p>

## 💻 Sobre o Projeto

O **BorrachaPro** nasceu para resolver a dor de cabeça de atualizar o estoque manualmente no Mercado Livre e localmente (na loja física), evitando vendas duplicadas. O sistema foi desenvolvido para ser utilizado por donos de borracharias e funcionários, com uma interface responsiva (PWA/Web) que pode ser acessada do balcão de atendimento no computador ou via celular para consultas rápidas.

A interface foi construída seguindo o estilo Dark Mode Premium com detalhes em amarelo, lembrando as cores oficiais do Mercado Livre, transmitindo modernidade e confiabilidade.

## 🛠 Tecnologias Utilizadas

Este projeto foi desenvolvido com as seguintes tecnologias:

### Frontend
- **React + Vite**: Para uma interface rápida, reativa e de alta performance.
- **Tailwind CSS / Vanilla CSS**: Para a construção de um design limpo, moderno e responsivo.
- **Lucide React**: Ícones da interface.

### Backend
- **Node.js + Express**: Servidor rápido e escalável para gerenciar a API.
- **Prisma ORM**: Para modelagem e consultas simplificadas ao banco de dados.
- **Integração Webhooks (Mercado Livre)**: Para atualização em tempo real de vendas.

### Banco de Dados
- **PostgreSQL**: Banco de dados relacional robusto.
- **Supabase**: Plataforma de Backend-as-a-Service para hospedagem do banco e conexão segura via pooler.

## ⚙️ Funcionalidades

- Integração nativa com a API do Mercado Livre.
- Recebimento de Webhooks em tempo real a cada nova venda no ML.
- Sincronização automática do estoque local, evitando vendas de produtos esgotados.
- Interface amigável focada na agilidade do dia a dia no balcão da borracharia.

## 🚀 Como executar o projeto localmente

Para clonar e executar este aplicativo, você precisará do [Git](https://git-scm.com), [Node.js](https://nodejs.org/en/download/) instalados no seu computador.

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
cd SEU_REPOSITORIO
```

### 2. Configurar e rodar o Backend
```bash
cd backend
npm install
# Configure seu arquivo .env com as variáveis de ambiente (Supabase / Mercado Livre)
npx prisma generate
npm run dev
```

### 3. Configurar e rodar o Frontend
Em outro terminal:
```bash
cd frontend
npm install
npm run dev
```

---
Feito com dedicação para construir soluções que impactam o dia a dia! 🚀
