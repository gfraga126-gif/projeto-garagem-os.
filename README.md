# Sistema Garagem OS - Programação II

Projeto avaliativo desenvolvido para a disciplina de Programação II – Web. O sistema consiste em uma aplicação web para gerenciamento de Ordens de Serviço de uma oficina mecânica.

## 🛠️ Tecnologias Utilizadas
* **Front-end:** HTML, CSS, JavaScript Vanilla, Bootstrap (para responsividade).
* **Back-end:** Node.js com Express.
* **Banco de Dados:** MySQL.

## 🚀 Como Executar a Aplicação

### 1. Configuração do Banco de Dados
* Acesse o seu servidor MySQL.
* Execute o script contido no arquivo `database.sql` (localizado na raiz do projeto).
* Isso criará o banco de dados `garagem_os_db` e a tabela `ordens_servico`.

### 2. Executando o Back-end
* Abra o terminal na pasta `backend`.
* Instale as dependências rodando o comando: `npm install`.
* Verifique no arquivo `server.js` se o usuário e senha do MySQL estão corretos.
* Inicie o servidor rodando: `node server.js`.
* O back-end ficará rodando em `http://localhost:3000`.

### 3. Executando o Front-end
* Vá até a pasta `frontend`.
* Abra o arquivo `index.html` em qualquer navegador web (ou utilize a extensão Live Server do VS Code).
* O sistema estará pronto para uso.

## ✨ Principais Funcionalidades Implementadas
* **Cadastro:** Criação de novas Ordens de Serviço informando cliente, veículo e problema.
* **Listagem Geral:** Visualização de todas as OSs em formato de tabela.
* **Consulta e Atualização:** Possibilidade de editar os dados e mudar o status da OS (Pendente, Em Andamento, Concluído).
* **Exclusão:** Remoção de Ordens de Serviço do banco de dados.

## 🌐 Endpoints da API Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET`  | `/api/os` | Lista todas as ordens de serviço. |
| `GET`  | `/api/os/:id` | Busca os dados de uma única ordem de serviço pelo ID. |
| `POST` | `/api/os` | Cadastra uma nova OS no banco de dados. |
| `PUT`  | `/api/os/:id` | Atualiza os dados de uma OS existente. |
| `DELETE`| `/api/os/:id` | Remove uma OS do banco de dados. |

**Exemplo de Requisição POST para `/api/os` (JSON):**
```json
{
  "cliente": "João Silva",
  "veiculo": "Fiat Uno Placa ABC-1234",
  "descricao_problema": "Bateria não carrega",
  "status": "Pendente"
}