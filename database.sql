CREATE DATABASE IF NOT EXISTS garagem_os_db;
USE garagem_os_db;

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
-- DADOS DE TESTE: ESTOQUE
-- ==========================================
INSERT INTO estoque (nome, quantidade, preco) VALUES 
('Bateria Moura 60Ah', 8, 380.00),
('Pastilha de Freio Cobreq', 15, 95.50),
('Óleo Sintético 5W30 (1L)', 40, 45.00),
('Filtro de Ar Condicionado', 12, 35.00),
('Correia Dentada Gates', 5, 120.00);

-- ==========================================
-- DADOS DE TESTE: ORDENS DE SERVIÇO
-- ==========================================
INSERT INTO ordens_servico 
(modelo_veiculo, placa, descricao, peca_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, status_servico) 
VALUES 
('Honda Civic 2020', 'ABC-1234', 'Troca da bateria e revisão elétrica geral.', 1, 150.00, 380.00, '2026-06-20', '09:00', '01:30', 'Cliente busca', 'PIX', 503.50, 'Pronto'),
('VW Polo Highline', 'XYZ-9876', 'Barulho na roda dianteira. Substituição das pastilhas de freio.', 2, 120.00, 95.50, '2026-06-21', '14:00', '02:00', 'Mecânico leva', 'CARTAO_1X', 215.50, 'Pendente'),
('Chevrolet Onix', 'QWE-5555', 'Revisão básica, troca de óleo e filtro.', 3, 80.00, 45.00, '2026-06-21', '10:30', '00:45', 'Cliente busca', 'DINHEIRO', 118.75, 'Pronto'),
('Jeep Compass', 'JEP-0001', 'Troca preventiva da correia dentada.', 5, 300.00, 120.00, '2026-06-22', '08:00', '04:00', 'Cliente busca', 'CARTAO_4X', 432.60, 'Pendente');