# 🚗 GarageOS Pro - Dark Edition

Sistema web completo de gestão para oficinas mecânicas, desenvolvido com arquitetura em camadas e focado em dispositivos móveis (Design Mobile-First) com interface em tema escuro imersivo. O sistema gerencia o fluxo completo de ordens de serviço, controle automático de estoque de peças, comissionamento e alocação de mecânicos responsáveis.

Projeto desenvolvido como requisito avaliativo para a disciplina de **Programação II – Web** do curso de **Sistemas de Informação** (UEMG – Unidade Passos).

---

## 🛠️ Tecnologias Utilizadas

**Front-end:**
* HTML5, CSS3 e JavaScript (Vanilla / API Fetch)
* Tailwind CSS (Responsividade e estilização UI/UX)
* FontAwesome (Ícones)

**Back-end e API:**
* Node.js
* Express.js (Roteamento e Servidor Web)
* CORS (Controle de acesso)

**Banco de Dados:**
* MySQL (Persistência de Dados e Relacionamentos)

---

## ✨ Principais Funcionalidades Implementadas

O sistema atende a todos os requisitos de **CRUD (Create, Read, Update, Delete)** exigidos, distribuídos nos seguintes módulos:

* **Dashboard Financeiro Dinâmico:** Monitoramento em tempo real de ordens abertas e concluídas, faturamento bruto detalhado (mão de obra vs. peças) e cálculo automático de comissão de 3% sobre autopeças.
* **Gestão de Equipe (Mecânicos):** Cadastro e listagem completa do corpo técnico da oficina mecânica.
* **Vínculo de Atribuição:** Permite selecionar qual mecânico será responsável por executar determinada Ordem de Serviço, exibindo seu nome no histórico de atendimentos através de junções (`JOIN`) no banco de dados.
* **Fluxo Inteligente de Estoque:** Ao vincular uma peça do estoque a uma OS, o sistema debita automaticamente 1 unidade do saldo do banco de dados e impede novas seleções caso o item atinja o estoque zero.
* **Regras de Negócio e Precificação:** Cálculo em tempo real com descontos para pagamentos à vista (PIX/Dinheiro com 5% OFF) ou acréscimos automáticos de juros para parcelamentos em cartão de crédito (4x ou mais com +3% de juros).

---

## 📁 Estrutura de Pastas do Projeto

O projeto adota uma arquitetura limpa, separando a regra de negócios da interface visual:

```text
/projeto-garagem-uemg
│
├── /backend/              # Camada de Servidor e API (Node.js)
│   ├── node_modules/      # Dependências do Node
│   ├── server.js          # Arquivo principal de rotas e conexão DB
│   ├── package.json       # Configurações de pacotes (Express, MySQL2, Cors)
│
├── /frontend/             # Camada Visual (HTML, CSS, JS)
│   ├── index.html         # Estrutura e Interface SPA (Single Page Application)
│   ├── script.js          # Lógica Front-end e consumo da API REST
│   ├── 14.png / 15.png    # Assets e imagens de fundo/logo
│
├── database.sql           # Script completo de criação e população do Banco de Dados
└── README.md              # Documentação técnica