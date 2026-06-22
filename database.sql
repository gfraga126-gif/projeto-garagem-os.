CREATE DATABASE IF NOT EXISTS garagem_os_db;
USE garagem_os_db;

-- ==========================================
-- ESTRUTURA DA TABELA: MECÂNICOS
-- ==========================================
DROP TABLE IF EXISTS mecanicos;
CREATE TABLE mecanicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL
);

-- ==========================================
-- ESTRUTURA DA TABELA: ESTOQUE
-- ==========================================
DROP TABLE IF EXISTS estoque;
CREATE TABLE estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    quantidade INT NOT NULL,
    preco DECIMAL(10,2) NOT NULL
);

-- ==========================================
-- ESTRUTURA DA TABELA: ORDENS DE SERVIÇO
-- ==========================================
DROP TABLE IF EXISTS ordens_servico;
CREATE TABLE ordens_servico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modelo_veiculo VARCHAR(100) NOT NULL,
    placa VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    peca_id INT NULL,
    mecanico_id INT NULL,
    valor_mao_obra DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    valor_pecas DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    data_agendamento DATE NOT NULL,
    horario_entrega TIME NOT NULL,
    tempo_estimado TIME NOT NULL,
    logistica VARCHAR(50) NOT NULL,
    forma_pagamento VARCHAR(50) NOT NULL,
    total_pago DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    status_servico VARCHAR(20) NOT NULL DEFAULT 'Pendente'
);

-- ==========================================
-- DADOS DE TESTE E POPULAÇÃO INICIAL
-- ==========================================
INSERT INTO mecanicos (nome, especialidade, telefone) VALUES
('Carlos Silva', 'Motor e Câmbio', '(35) 99988-1122'),
('Marcos Souza', 'Suspensão e Freios', '(35) 99977-3344'),
('Julia Lima', 'Injeção Eletrônica', '(35) 99888-5566');

INSERT INTO estoque (nome, quantidade, preco) VALUES
('Bateria Moura 60Ah', 10, 420.00),
('Pastilha de Freio Cobreq', 15, 110.00),
('Kit Correia Dentada Gates', 5, 250.00);

INSERT INTO ordens_servico
(modelo_veiculo, placa, descricao, peca_id, mecanico_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, status_servico)
VALUES
('Honda Civic 2020', 'ABC-1234', 'Substituição da bateria e verificação do alternador.', 1, 1, 150.00, 420.00, '2026-06-20', '09:00', '01:00', 'Cliente busca', 'PIX', 541.50, 'Pronto'),
('VW Polo 2022', 'XYZ-5678', 'Barulho ao travar. Troca das pastilhas de freio dianteiras.', 2, 2, 120.00, 110.00, '2026-06-22', '14:30', '01:30', 'Mecânico leva', 'CARTAO_1X', 230.00, 'Pendente');