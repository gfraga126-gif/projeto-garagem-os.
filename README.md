# 🚗 GarageOS Pro - Dark Edition

Sistema ERP completo e responsivo para gestão integrada de oficinas mecânicas. Este projeto foi desenvolvido como requisito avaliativo para a disciplina de **Programação II – Web**.

**Instituição:** UEMG (Universidade do Estado de Minas Gerais) - Unidade Passos  
**Curso:** Sistemas de Informação  
**Aluno:** Gabriel Henrique da Fraga Santos  
**Professor Responsável:** Eduardo Henrique Marques Ferreira  
**Período:** 5

---

## 🛠️ Funcionalidades do Sistema
O GarageOS Pro foi projetado com uma interface moderna (Dark Mode) focada em usabilidade mobile e desktop. O sistema conta com os seguintes módulos:
- **Dashboard e Histórico:** Visão geral de Ordens de Serviço (Abertas e Prontas) e cálculo automático de faturamento e comissões.
- **Gestão de Orçamentos:** Criação de orçamentos detalhados, envio automático de resumo para o cliente via WhatsApp e botão de "Aprovação" (que converte o orçamento em OS ativa).
- **Estoque Inteligente:** Cadastro de peças com atualização dinâmica e integração direta com o formulário de serviços.
- **Agenda Integrada:** Exibição cronológica dos serviços agendados para a semana atual.
- **Gestão de Equipe:** Cadastro de mecânicos e controle de especialidades.

## 💻 Tecnologias Utilizadas
- **Front-end:** HTML5, JavaScript (Vanilla Assíncrono com Fetch API), Tailwind CSS (via CDN) e FontAwesome (Ícones).
- **Back-end:** Node.js com Express.js e Cors.
- **Banco de Dados:** MySQL (Consultas relacionais estruturadas).

---

## 🚀 Como executar o projeto localmente

### 1. Configuração do Banco de Dados
1. Certifique-se de ter o XAMPP ou servidor MySQL ativo na sua máquina.
2. Importe ou execute o conteúdo do arquivo `database.sql` no seu gerenciador (ex: phpMyAdmin). 
3. O script criará automaticamente o banco `garagem_os_db`, as tabelas e inserirá dados de teste para facilitar a avaliação do sistema.

### 2. Inicialização do Servidor (Back-end)
1. Abra o terminal na pasta do projeto e navegue até a pasta do servidor:
   ```bash
   cd backend