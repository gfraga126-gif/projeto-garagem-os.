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
    if (err) { console.error('❌ ERRO NO DB:', err.message); return; }
    console.log('✅ Conectado ao banco GarageOS Pro!');
});

// ================= ROTAS OS =================
app.get('/api/os', (req, res) => { 
    db.query('SELECT * FROM ordens_servico ORDER BY id DESC', (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows);
    }); 
});

// 👉 ROTA NOVA: Puxar apenas UMA O.S. para preencher o formulário
app.get('/api/os/:id', (req, res) => { 
    db.query('SELECT * FROM ordens_servico WHERE id = ?', [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows[0] || {});
    }); 
});

app.post('/api/os', (req, res) => { 
    const { modelo_veiculo, placa, descricao, peca_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago } = req.body; 
    
    if (peca_id) { db.query('UPDATE estoque SET quantidade = quantidade - 1 WHERE id = ? AND quantidade > 0', [peca_id]); }

    const query = `INSERT INTO ordens_servico (modelo_veiculo, placa, descricao, peca_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, status_servico) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.query(query, [modelo_veiculo, placa, descricao, peca_id || null, valor_mao_obra || 0, valor_pecas || 0, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago || 0, 'Pendente'], 
    (err, result) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.status(201).json({ id: result.insertId }); 
    }); 
});

// 👉 ROTA NOVA: Salvar a Edição (UPDATE)
app.put('/api/os/:id', (req, res) => {
    const { modelo_veiculo, placa, descricao, peca_id, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago } = req.body; 
    
    const query = `UPDATE ordens_servico SET modelo_veiculo=?, placa=?, descricao=?, peca_id=?, valor_mao_obra=?, valor_pecas=?, data_agendamento=?, horario_entrega=?, tempo_estimado=?, logistica=?, forma_pagamento=?, total_pago=? WHERE id=?`;
    
    db.query(query, [modelo_veiculo, placa, descricao, peca_id || null, valor_mao_obra, valor_pecas, data_agendamento, horario_entrega, tempo_estimado, logistica, forma_pagamento, total_pago, req.params.id], 
    (err) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ msg: 'OK' });
    }); 
});

app.put('/api/os/:id/pronto', (req, res) => { 
    db.query('UPDATE ordens_servico SET status_servico = "Pronto" WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ msg: 'OK' });
    }); 
});

app.delete('/api/os/:id', (req, res) => { 
    db.query('DELETE FROM ordens_servico WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json({ msg: 'OK' });
    }); 
});

// ================= ROTAS ESTOQUE =================
app.get('/api/estoque', (req, res) => { db.query('SELECT * FROM estoque', (err, rows) => res.json(rows)); });
app.post('/api/estoque', (req, res) => { 
    const { nome, quantidade, preco } = req.body; 
    db.query('INSERT INTO estoque (nome, quantidade, preco) VALUES (?,?,?)', [nome, quantidade, preco || 0], (err, result) => res.status(201).json({ id: result.insertId })); 
});
app.delete('/api/estoque/:id', (req, res) => { db.query('DELETE FROM estoque WHERE id=?', [req.params.id], (err) => res.json({ msg: 'OK' })); });

app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));