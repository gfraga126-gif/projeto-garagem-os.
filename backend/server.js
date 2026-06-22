const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'garagem_os_db'
});

db.connect((err) => {
    if (err) { console.error('Erro no DB:', err); return; }
    console.log('✅ Banco GarageOS Pro conectado!');
});

// ================= ROTAS OS =================
app.get('/api/os', (req, res) => { 
    const query = `
        SELECT os.*, m.nome AS mecanico_nome, e.nome AS peca_nome 
        FROM ordens_servico os 
        LEFT JOIN mecanicos m ON os.mecanico_id = m.id 
        LEFT JOIN estoque e ON os.peca_id = e.id 
        ORDER BY os.id DESC
    `;
    db.query(query, (err, rows) => res.json(rows)); 
});

// 👉 ROTA DE BUSCA INDIVIDUAL (É ELA QUE PREENCHE A EDIÇÃO)
app.get('/api/os/:id', (req, res) => {
    db.query('SELECT * FROM ordens_servico WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows[0] || {});
    });
});

app.post('/api/os', (req, res) => { 
    const { modelo_veiculo, placa, descricao, peca_id, mecanico_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, status_servico } = req.body; 
    
    if (status_servico === 'Pendente' && peca_id) { 
        db.query('UPDATE estoque SET quantidade = quantidade - 1 WHERE id = ? AND quantidade > 0', [peca_id]); 
    }

    db.query('INSERT INTO ordens_servico (modelo_veiculo, placa, descricao, peca_id, mecanico_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, status_servico) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
    [modelo_veiculo, placa, descricao, peca_id || null, mecanico_id || null, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, status_servico || 'Orçamento'], 
    (err, result) => {
        if (err) return res.status(500).json({erro: err.message});
        res.status(201).json({ id: result.insertId }); 
    }); 
});

// 👉 ROTA QUE SALVA AS ALTERAÇÕES DA EDIÇÃO
app.put('/api/os/:id', (req, res) => {
    const { modelo_veiculo, placa, descricao, peca_id, mecanico_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago } = req.body; 
    const query = `UPDATE ordens_servico SET modelo_veiculo=?, placa=?, descricao=?, peca_id=?, mecanico_id=?, valor_mao_obra=?, valor_pecas=?, data_agendamento=?, horario_entrega=?, tempo_estimado=?, logistica=?, forma_pagamento=?, total_pago=? WHERE id=?`;
    
    db.query(query, [modelo_veiculo, placa, descricao, peca_id || null, mecanico_id || null, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, req.params.id], 
    (err) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ msg: 'OK' });
    }); 
});

// 👉 ROTA DE APROVAÇÃO (ORÇAMENTO -> O.S.)
app.put('/api/os/:id/aprovar', (req, res) => {
    db.query('SELECT peca_id FROM ordens_servico WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if(rows && rows[0] && rows[0].peca_id) {
            db.query('UPDATE estoque SET quantidade = quantidade - 1 WHERE id = ? AND quantidade > 0', [rows[0].peca_id]);
        }
        
        db.query('UPDATE ordens_servico SET status_servico = "Pendente" WHERE id = ?', [req.params.id], (err2) => {
            if (err2) return res.status(500).json({ erro: err2.message });
            res.json({ msg: 'Aprovado' });
        });
    });
});

app.put('/api/os/:id/pronto', (req, res) => { db.query('UPDATE ordens_servico SET status_servico = "Pronto" WHERE id = ?', [req.params.id], (err) => res.json({ msg: 'OK' })); });
app.delete('/api/os/:id', (req, res) => { db.query('DELETE FROM ordens_servico WHERE id=?', [req.params.id], (err) => res.json({ msg: 'OK' })); });

// ================= ROTAS ESTOQUE E EQUIPE =================
app.get('/api/estoque', (req, res) => { db.query('SELECT * FROM estoque', (err, rows) => res.json(rows)); });
app.post('/api/estoque', (req, res) => { 
    const { nome, quantidade, preco } = req.body; 
    db.query('INSERT INTO estoque (nome, quantidade, preco) VALUES (?,?,?)', [nome, quantidade, preco], (err, result) => res.status(201).json({ id: result.insertId })); 
});
app.delete('/api/estoque/:id', (req, res) => { db.query('DELETE FROM estoque WHERE id=?', [req.params.id], (err) => res.json({ msg: 'OK' })); });

app.get('/api/mecanicos', (req, res) => { db.query('SELECT * FROM mecanicos', (err, rows) => res.json(rows)); });
app.post('/api/mecanicos', (req, res) => { 
    const { nome, especialidade, telefone } = req.body; 
    db.query('INSERT INTO mecanicos (nome, especialidade, telefone) VALUES (?,?,?)', [nome, especialidade, telefone], (err, result) => res.status(201).json({ id: result.insertId })); 
});
app.delete('/api/mecanicos/:id', (req, res) => { db.query('DELETE FROM mecanicos WHERE id=?', [req.params.id], (err) => res.json({ msg: 'OK' })); });

// 👉 A MENSAGEM SECRETA ESTÁ AQUI
app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000 (Versão com Edição Ativa!)'));