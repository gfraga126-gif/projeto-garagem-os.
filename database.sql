-- Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS garagem_os_db;
USE garagem_os_db;

-- 1. Tabela de Equipe (Mecânicos)
CREATE TABLE IF NOT EXISTS mecanicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

-- 2. Tabela de Estoque
CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL DEFAULT 0,
    preco DECIMAL(10, 2) NOT NULL
);

-- 3. Tabela de Ordens de Serviço (Agora 100% integrada)
CREATE TABLE IF NOT EXISTS ordens_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status_servico VARCHAR(50) NOT NULL,
    modelo_veiculo VARCHAR(100) NOT NULL,
    placa VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    mecanico_id INT NULL,
    peca_id INT NULL,
    valor_mao_obra DECIMAL(10,2) DEFAULT 0.00,
    valor_pecas DECIMAL(10,2) DEFAULT 0.00,
    data_agendamento DATE NULL,
    horario_entrega TIME NULL,
    tempo_estimado VARCHAR(50) NULL,
    logistica VARCHAR(100) NULL,
    forma_pagamento VARCHAR(50) NULL,
    total_pago DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (mecanico_id) REFERENCES mecanicos(id) ON DELETE SET NULL,
    FOREIGN KEY (peca_id) REFERENCES estoque(id) ON DELETE SET NULL
);

-- ==========================================
-- INSERÇÃO DE DADOS DE TESTE (Para Avaliação)
-- ==========================================

INSERT INTO mecanicos (nome, especialidade, telefone) VALUES 
('Carlos Silva', 'Mecânica Geral', '(11) 98888-1111'),
('Roberto Mendes', 'Elétrica Automotiva', '(11) 97777-2222'),
('João Paulo', 'Suspensão e Freios', '(11) 96666-3333');

INSERT INTO estoque (nome, quantidade, preco) VALUES 
('Óleo de Motor 5W30 Sintético (1L)', 50, 45.90),
('Filtro de Óleo Universal', 35, 28.50),
('Jogo de Pastilhas de Freio Dianteira', 15, 125.00),
('Bateria 60Ah', 8, 450.00);

INSERT INTO ordens_servico (status_servico, modelo_veiculo, placa, descricao, mecanico_id, peca_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago) VALUES 
('Pendente', 'Honda Civic 2020', 'ABC-1234', 'Revisão dos 40.000km', 1, 1, 200.00, 45.90, '2026-07-02', '09:00', '2h', 'Cliente busca', 'PIX', 233.60),
('Pronto', 'Fiat Argo 2022', 'XYZ-9876', 'Troca de Óleo e Filtros', 2, 2, 100.00, 28.50, '2026-07-01', '14:30', '1h', 'Leva e Traz', 'CARTAO_1', 128.50),
('Orçamento', 'Jeep Compass', 'QWE-5544', 'Higienização e gás do ar condicionado', 3, null, 300.00, 0.00, '2026-07-03', '15:00', '3h', 'Cliente busca', 'PIX', 285.00);