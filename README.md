# 🚗 GarageOS Pro - Dark Edition

Sistema completo de gestão para oficinas mecânicas. Uma aplicação web moderna, desenhada com foco em dispositivos móveis (Mobile First), utilizando um tema escuro imersivo. O sistema controla fluxo de serviços, comissionamento automático de peças e integração financeira inteligente.

## 🛠️ Tecnologias Utilizadas
* **Front-end:** HTML5, CSS3, JavaScript (Vanilla API Fetch), Tailwind CSS (para responsividade e estilização UI/UX), FontAwesome (ícones).
* **Back-end:** Node.js com Express e CORS.
* **Banco de Dados:** MySQL.

## ✨ Funcionalidades Principais
* **Dashboard Financeiro (Tempo Real):** Visualização de OS abertas vs. prontas, cálculo de faturamento total, separação automática entre mão de obra e peças, e cálculo de comissão de 3% sobre peças vendidas.
* **Gestão de Estoque Inteligente:** Controle de entrada de peças. Ao vincular uma peça a uma nova Ordem de Serviço, o sistema deduz automaticamente 1 unidade do banco de dados e bloqueia a seleção de peças sem saldo.
* **Ordens de Serviço Dinâmicas:**
  * Lançamento de dados veiculares, cliente, logística e horários.
  * Regras de pagamento processadas na hora: **5% de desconto** imediato no PIX/Dinheiro ou **3% de acréscimo** (juros) para Cartão parcelado em 4x ou mais.
* **UI/UX Dinâmica:** Navegação por abas sem carregamento de página (*Single Page Application*), fundo translúcido e alternância dinâmica do logótipo da oficina consoante a secção acedida.

## 🚀 Como Executar o Projeto

### 1. Configurando o Banco de Dados
* Abra seu servidor MySQL (via XAMPP, WAMP, MySQL Workbench, etc.).
* Execute o script contido no arquivo `database.sql` para gerar o banco de dados `garagem_os_db`, criar as tabelas e popular o sistema com dados de teste financeiros.

### 2. Executando o Back-end (API Node.js)
* Abra o terminal na pasta onde o arquivo `server.js` e `package.json` estão localizados.
* Instale as dependências do projeto executando o comando: 
```bash
  npm install