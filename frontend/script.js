const API_OS_URL = 'http://localhost:3000/api/os';
const API_ESTOQUE_URL = 'http://localhost:3000/api/estoque';

let totalCalculadoFinal = 0;

document.addEventListener('DOMContentLoaded', () => {
    carregarEstoque();
    carregarOS();
});

// ================= NAVEGAÇÃO DE ABAS E LOGOS DINÂMICAS =================
function changeTab(tab) {
    document.querySelectorAll('.app-container > div > .flex-1 > div').forEach(el => el.classList.add('hidden'));
    
    document.getElementById('btn-home').className = 'w-1/4 flex flex-col items-center gap-1 transition-all text-gray-500';
    document.getElementById('btn-estoque').className = 'w-1/4 flex flex-col items-center gap-1 transition-all text-gray-500';
    document.getElementById('btn-painel').className = 'w-1/4 flex flex-col items-center gap-1 transition-all text-gray-500';

    document.getElementById('view-' + tab).classList.remove('hidden');
    if (tab !== 'agendar') {
        document.getElementById('btn-' + tab).classList.replace('text-gray-500', 'text-accent');
    }

    const logo = document.getElementById('logo-img');
    if (logo) {
        logo.src = (tab === 'painel' || tab === 'estoque') ? "14.png" : "15.png";
    }
}

// ================= LÓGICA DE CÁLCULO E COMISSÃO =================
const selectPeca = document.getElementById('select_peca');
const iptPecas = document.getElementById('valor_pecas');
const iptMaoObra = document.getElementById('valor_mao_obra');
const selectPagamento = document.getElementById('pagamento');

selectPeca.addEventListener('change', function() {
    const preco = parseFloat(this.options[this.selectedIndex].getAttribute('data-preco')) || 0;
    if(preco > 0) {
        iptPecas.value = preco.toFixed(2);
        iptPecas.readOnly = true; iptPecas.classList.add('opacity-60');
    } else {
        iptPecas.value = '';
        iptPecas.readOnly = false; iptPecas.classList.remove('opacity-60');
    }
    calcularPreview();
});

function calcularPreview() {
    const maoObra = parseFloat(iptMaoObra.value) || 0;
    const pecas = parseFloat(iptPecas.value) || 0;
    const pagamento = selectPagamento.value;

    const subtotal = maoObra + pecas;
    let total = subtotal; let diferenca = 0; let label = "Desconto (5%):";
    
    const comissaoPecas = pecas * 0.03;
    document.getElementById('preview-comissao').innerText = '+ R$ ' + comissaoPecas.toFixed(2).replace('.', ',');

    if (pagamento === 'PIX' || pagamento === 'DINHEIRO') {
        total = subtotal * 0.95; diferenca = subtotal - total; label = "Desconto (5%):";
    } else if (pagamento.startsWith('CARTAO_')) {
        const parcelas = parseInt(pagamento.split('_')[1]) || 1;
        if (parcelas >= 4) { total = subtotal * 1.03; diferenca = total - subtotal; label = "Juros (+3%):"; } 
        else { total = subtotal; diferenca = 0; label = "Sem juros:"; }
    }
    
    totalCalculadoFinal = total;
    
    document.getElementById('preview-subtotal').innerText = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    document.getElementById('preview-label-desconto').innerText = label;
    
    const campoDesconto = document.getElementById('preview-desconto');
    if (pagamento === 'PIX' || pagamento === 'DINHEIRO') {
        campoDesconto.className = "font-bold text-green-500"; campoDesconto.innerText = '-R$ ' + diferenca.toFixed(2).replace('.', ',');
    } else if (pagamento.startsWith('CARTAO_') && parseInt(pagamento.split('_')[1]) >= 4) {
        campoDesconto.className = "font-bold text-red-500"; campoDesconto.innerText = '+R$ ' + diferenca.toFixed(2).replace('.', ',');
    } else {
        campoDesconto.className = "font-bold text-gray-600"; campoDesconto.innerText = 'R$ 0,00';
    }
    document.getElementById('preview-total').innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
}

iptMaoObra.addEventListener('input', calcularPreview);
iptPecas.addEventListener('input', calcularPreview);
selectPagamento.addEventListener('change', calcularPreview);

// ================= ROTAS DE DADOS (API) =================

async function carregarEstoque() {
    try {
        const res = await fetch(API_ESTOQUE_URL); const lista = await res.json();
        const painel = document.getElementById('estoque-lista'); painel.innerHTML = '';
        if(lista.length === 0) painel.innerHTML = '<div class="text-center text-gray-600 text-xs py-4">O seu estoque está vazio.</div>';
        
        selectPeca.innerHTML = '<option value="" data-preco="0">Nenhuma peça (Ou digitar manual)</option>';

        lista.forEach(p => {
            painel.innerHTML += `
            <div class="card-dark p-3 flex justify-between items-center bg-[#0f0f0f] mb-3">
                <div>
                    <div class="text-sm font-bold text-gray-200">${p.nome}</div>
                    <div class="text-[10px] text-accent font-bold mt-1">R$ ${parseFloat(p.preco).toFixed(2).replace('.',',')}</div>
                </div>
                <div class="text-center px-3 py-1 bg-[#1a1a1a] rounded-lg border border-[#333]">
                    <div class="text-[8px] text-gray-500 uppercase">Estoque</div>
                    <div class="font-black text-lg ${p.quantidade > 0 ? 'text-green-500' : 'text-red-500'}">${p.quantidade}</div>
                </div>
            </div>`;
            
            selectPeca.innerHTML += `<option value="${p.id}" data-preco="${p.preco}" ${p.quantidade <= 0 ? 'disabled' : ''}>${p.nome} (Est. ${p.quantidade}) - R$ ${parseFloat(p.preco).toFixed(2).replace('.',',')}</option>`;
        });
    } catch(e) {}
}

async function carregarOS() {
    try {
        const res = await fetch(API_OS_URL); const lista = await res.json();
        
        let abertas = 0; let prontas = 0; let fatMao = 0; let fatPeca = 0; let totalFat = 0; let comissao = 0;
        
        const painel = document.getElementById('os-lista'); painel.innerHTML = '';
        if(lista.length === 0) painel.innerHTML = '<div class="text-center p-8 text-gray-600 mt-10">Nenhuma O.S. cadastrada.</div>';

        lista.forEach(os => {
            if(os.status_servico === 'Pendente') { abertas++; }
            else {
                prontas++; fatMao += parseFloat(os.valor_mao_obra); fatPeca += parseFloat(os.valor_pecas); totalFat += parseFloat(os.total_pago);
                comissao += (parseFloat(os.valor_pecas) * 0.03);
            }

            const comissaoOS = parseFloat(os.valor_pecas) * 0.03;
            const dataFmt = new Date(os.data_agendamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            const cor = os.status_servico === 'Pronto' ? 'green' : 'yellow';

            painel.innerHTML += `
            <div class="card-dark p-4 relative overflow-hidden mb-3">
                <div class="absolute left-0 top-0 bottom-0 w-1 bg-${cor}-500"></div>
                <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-gray-400"><i class="fa-solid fa-car-side"></i></div>
                        <div><h3 class="font-bold text-sm leading-none uppercase text-white">${os.modelo_veiculo}</h3><span class="text-[10px] font-mono text-accent">${os.placa}</span></div>
                    </div>
                    <span class="text-[9px] px-2 py-0.5 rounded border border-${cor}-900 text-${cor}-500 bg-${cor}-900/20 uppercase">${os.status_servico}</span>
                </div>
                <div class="bg-[#0f0f0f] rounded-lg p-3 text-xs text-gray-400 mb-3 border border-[#1a1a1a]">
                    <div class="flex gap-2 mb-1"><i class="fa-solid fa-wrench text-gray-600 mt-0.5"></i><span class="text-gray-300 italic flex-1">${os.descricao}</span></div>
                    <div class="flex justify-between items-center mt-2 pt-2 border-t border-[#1a1a1a] text-[9px] uppercase">
                        <span><i class="fa-regular fa-calendar mr-1"></i> ${dataFmt}</span>
                        <span><i class="fa-solid fa-hand-holding-dollar mr-1 text-green-500"></i> Com: R$ ${comissaoOS.toFixed(2).replace('.',',')}</span>
                        <span><i class="fa-solid fa-wallet mr-1"></i> ${os.forma_pagamento.split('_')[0]}</span>
                    </div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="font-black text-lg text-white">R$ ${parseFloat(os.total_pago).toFixed(2).replace('.',',')}</div>
                    <div class="flex gap-2">
                        ${os.status_servico === 'Pendente' ? `<button onclick="marcarPronto(${os.id})" class="w-8 h-8 bg-green-900/30 text-green-500 rounded flex items-center justify-center hover:bg-green-900/60" title="Marcar Pronto"><i class="fa-solid fa-check text-xs"></i></button>` : ''}
                        <button onclick="carregarParaEdicao(${os.id})" class="w-8 h-8 bg-blue-900/30 text-blue-500 rounded flex items-center justify-center hover:bg-blue-900/60" title="Editar OS"><i class="fa-solid fa-pencil text-xs"></i></button>
                        <button onclick="excluirOS(${os.id})" class="w-8 h-8 bg-red-900/30 text-red-500 rounded flex items-center justify-center hover:bg-red-900/60" title="Excluir"><i class="fa-solid fa-trash text-xs"></i></button>
                    </div>
                </div>
            </div>`;
        });

        document.getElementById('dash-abertas').innerText = abertas.toString().padStart(2, '0');
        document.getElementById('dash-prontas').innerText = prontas.toString().padStart(2, '0');
        document.getElementById('dash-mao-obra').innerText = 'R$ ' + fatMao.toFixed(2).replace('.',',');
        document.getElementById('dash-pecas').innerText = 'R$ ' + fatPeca.toFixed(2).replace('.',',');
        document.getElementById('dash-comissao').innerText = '+ R$ ' + comissao.toFixed(2).replace('.',',');
        document.getElementById('dash-total').innerText = 'R$ ' + totalFat.toFixed(2).replace('.',',');

    } catch(e) {}
}

// ================= SALVAMENTOS, EDIÇÃO E AÇÕES =================

document.getElementById('formEstoque').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = { nome: document.getElementById('nome_peca').value, preco: document.getElementById('preco_peca').value, quantidade: document.getElementById('quantidade_peca').value };
    await fetch(API_ESTOQUE_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)});
    document.getElementById('formEstoque').reset();
    carregarEstoque(); changeTab('estoque'); alert("Peça cadastrada!");
});

document.getElementById('formOS').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        modelo_veiculo: document.getElementById('modelo_veiculo').value,
        placa: document.getElementById('placa_veiculo').value,
        descricao: document.getElementById('descricao_servico').value,
        peca_id: document.getElementById('select_peca').value || null,
        valor_mao_obra: document.getElementById('valor_mao_obra').value,
        valor_pecas: document.getElementById('valor_pecas').value,
        data_agendamento: document.getElementById('data_agendamento').value,
        horario_entrega: document.getElementById('horario_entrega').value,
        tempo_estimado: document.getElementById('tempo_estimado').value,
        logistica: document.getElementById('logistica').value,
        forma_pagamento: document.getElementById('pagamento').value,
        total_pago: totalCalculadoFinal
    };

    await fetch(API_OS_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)});
    document.getElementById('formOS').reset();
    carregarOS(); carregarEstoque(); changeTab('painel'); alert("Ordem de Serviço criada com sucesso!");
});

async function carregarParaEdicao(id) {
    const res = await fetch(`${API_OS_URL}/${id}`); 
    // Em nossa API atual, a rota base /api/os retorna a lista, então precisamos buscar da lista
    const lista = await res.json();
    const os = Array.isArray(lista) ? lista.find(item => item.id === id) : lista;
    
    if(!os) return alert("Erro ao carregar os dados.");

    changeTab('agendar'); 
    
    document.getElementById('modelo_veiculo').value = os.modelo_veiculo;
    document.getElementById('placa_veiculo').value = os.placa;
    document.getElementById('descricao_servico').value = os.descricao;
    document.getElementById('select_peca').value = os.peca_id || '';
    document.getElementById('valor_mao_obra').value = os.valor_mao_obra;
    document.getElementById('valor_pecas').value = os.valor_pecas;
    document.getElementById('data_agendamento').value = os.data_agendamento ? os.data_agendamento.split('T')[0] : '';
    document.getElementById('horario_entrega').value = os.horario_entrega || '';
    document.getElementById('tempo_estimado').value = os.tempo_estimado || '';
    document.getElementById('logistica').value = os.logistica;
    document.getElementById('pagamento').value = os.forma_pagamento;
    
    calcularPreview();
    
    const form = document.getElementById('formOS');
    form.onsubmit = async (e) => {
        e.preventDefault();
        const dadosAtualizados = {
            modelo_veiculo: document.getElementById('modelo_veiculo').value,
            placa: document.getElementById('placa_veiculo').value,
            descricao: document.getElementById('descricao_servico').value,
            peca_id: document.getElementById('select_peca').value || null,
            valor_mao_obra: document.getElementById('valor_mao_obra').value,
            valor_pecas: document.getElementById('valor_pecas').value,
            data_agendamento: document.getElementById('data_agendamento').value,
            horario_entrega: document.getElementById('horario_entrega').value,
            tempo_estimado: document.getElementById('tempo_estimado').value,
            logistica: document.getElementById('logistica').value,
            forma_pagamento: document.getElementById('pagamento').value,
            total_pago: totalCalculadoFinal
        };
        // O PUT vai mandar os dados para a API atualizar a OS
        await fetch(`${API_OS_URL}/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dadosAtualizados)});
        alert("Ordem de Serviço atualizada com sucesso!");
        location.reload(); 
    };
}

async function marcarPronto(id) { await fetch(`${API_OS_URL}/${id}/pronto`, { method: 'PUT' }); carregarOS(); }
async function excluirOS(id) { if(confirm('Excluir O.S.?')) { await fetch(`${API_OS_URL}/${id}`, { method: 'DELETE' }); carregarOS(); } }

setInterval(() => { const relogio = document.getElementById('relogio'); if(relogio) relogio.innerText = new Date().toLocaleTimeString('pt-BR'); }, 1000);