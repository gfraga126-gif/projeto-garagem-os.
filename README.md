# 🚗 GarageOS Pro - Dark Edition

Sistema web completo de gestão para oficinas mecânicas, desenvolvido com arquitetura em camadas e focado em dispositivos móveis (Design Mobile-First) com interface em tema escuro imersivo. O sistema gerencia o fluxo completo de ordens de serviço, orçamentos, controle automático de estoque de peças, comissionamento e alocação de mecânicos responsáveis.

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

O sistema atende a todos os requisitos de **CRUD (Create, Read, Update, Delete)** exigidos, distribuídos nos seguintes módulos inteligentes:

* **Módulo de Orçamentos e Integração WhatsApp:** Geração de orçamentos com botão para aprovação rápida (transformando o orçamento em OS e debitando o estoque na hora) e botão para envio do resumo tabulado diretamente para o WhatsApp do cliente.
* **Agenda da Semana Inteligente:** O dashboard filtra e exibe dinamicamente apenas os serviços agendados para a semana atual (Domingo a Sábado), organizados por horário.
* **Dashboard Financeiro:** Monitoramento em tempo real de ordens abertas e concluídas, faturamento bruto (mão de obra vs. peças) e cálculo automático de comissão de 3% sobre autopeças.
* **Gestão de Equipe (Mecânicos):** Cadastro, listagem e vínculo de mecânicos responsáveis pela execução das Ordens de Serviço.
* **Fluxo Automatizado de Estoque:** Ao vincular uma peça a uma OS (ou ao aprovar um orçamento), o sistema debita 1 unidade do banco de dados e impede seleções de itens sem saldo.
* **Regras de Precificação:** Descontos automáticos para pagamentos à vista (PIX/Dinheiro com 5% OFF) ou acréscimos de juros para parcelamentos longos (Cartão 4x com +3% de juros).

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