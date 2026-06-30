const API_OS_URL = 'http://localhost:3000/api/os';
const API_ESTOQUE_URL = 'http://localhost:3000/api/estoque';
const API_MECANICOS_URL = 'http://localhost:3000/api/mecanicos';

let totalCalculadoFinal = 0;
let modoEdicaoId = null;

document.addEventListener('DOMContentLoaded', () => {
    carregarEstoque();
    carregarEquipe();
    carregarOS();
});

function changeTab(tab) {
    document.querySelectorAll('.app-container > div > .flex-1 > div').forEach(el => el.classList.add('hidden'));
    
    document.getElementById('btn-home').className = 'w-1/5 flex flex-col items-center gap-1 text-gray-500';
    document.getElementById('btn-estoque').className = 'w-1/5 flex flex-col items-center gap-1 text-gray-500';
    document.getElementById('btn-orcamentos').className = 'w-1/5 flex flex-col items-center gap-1 text-gray-500';
    document.getElementById('btn-equipe').className = 'w-1/5 flex flex-col items-center gap-1 text-gray-500';
    document.getElementById('btn-painel').className = 'w-1/5 flex flex-col items-center gap-1 text-gray-500';

    document.getElementById('view-' + tab).classList.remove('hidden');
    
    if (tab !== 'agendar') {
        document.getElementById('btn-' + tab).className = 'w-1/5 flex flex-col items-center gap-1 text-accent';
    } else if (modoEdicaoId === null) {
        document.getElementById('formOS').reset();
        calcularPreview();
    }

    const logo = document.getElementById('logo-img');
    if (logo) logo.src = (tab === 'painel' || tab === 'estoque' || tab === 'equipe' || tab === 'orcamentos') ? "14.png" : "15.png";
}

// ================= CÁLCULOS FINANCEIROS =================
const selectPeca = document.getElementById('select_peca');
const iptPecas = document.getElementById('valor_pecas');
const iptMaoObra = document.getElementById('valor_mao_obra');
const selectPagamento = document.getElementById('pagamento');

if (selectPeca) {
    selectPeca.addEventListener('change', function() {
        const preco = parseFloat(this.options[this.selectedIndex].getAttribute('data-preco')) || 0;
        if(preco > 0) { iptPecas.value = preco.toFixed(2); iptPecas.readOnly = true; iptPecas.classList.add('opacity-60'); } 
        else { iptPecas.value = ''; iptPecas.readOnly = false; iptPecas.classList.remove('opacity-60'); }
        calcularPreview();
    });
}

function calcularPreview() {
    const maoObra = parseFloat(iptMaoObra.value) || 0; const pecas = parseFloat(iptPecas.value) || 0; const pagamento = selectPagamento ? selectPagamento.value : 'PIX';
    const subtotal = maoObra + pecas; let total = subtotal; let diferenca = 0; let label = "Desconto (5%):";
    
    const prevComissao = document.getElementById('preview-comissao');
    if(prevComissao) prevComissao.innerText = '+ R$ ' + (pecas * 0.03).toFixed(2).replace('.', ',');

    if (pagamento === 'PIX' || pagamento === 'DINHEIRO') { total = subtotal * 0.95; diferenca = subtotal - total; label = "Desconto (5%):"; } 
    else if (pagamento.startsWith('CARTAO_')) {
        const parcelas = parseInt(pagamento.split('_')[1]) || 1;
        if (parcelas >= 4) { total = subtotal * 1.03; diferenca = total - subtotal; label = "Juros (+3%):"; } else { total = subtotal; diferenca = 0; label = "Sem juros:"; }
    }
    
    totalCalculadoFinal = total;
    
    const prevSubtotal = document.getElementById('preview-subtotal');
    if(prevSubtotal) prevSubtotal.innerText = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
    
    const prevLabelDesconto = document.getElementById('preview-label-desconto');
    if(prevLabelDesconto) prevLabelDesconto.innerText = label;
    
    const campoDesconto = document.getElementById('preview-desconto');
    if(campoDesconto) {
        if (pagamento === 'PIX' || pagamento === 'DINHEIRO') { campoDesconto.className = "font-bold text-green-500"; campoDesconto.innerText = '-R$ ' + diferenca.toFixed(2).replace('.', ','); } 
        else if (pagamento.startsWith('CARTAO_') && parseInt(pagamento.split('_')[1]) >= 4) { campoDesconto.className = "font-bold text-red-500"; campoDesconto.innerText = '+R$ ' + diferenca.toFixed(2).replace('.', ','); } 
        else { campoDesconto.className = "font-bold text-gray-600"; campoDesconto.innerText = 'R$ 0,00'; }
    }
    
    const prevTotal = document.getElementById('preview-total');
    if(prevTotal) prevTotal.innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
}

if(iptMaoObra) iptMaoObra.addEventListener('input', calcularPreview); 
if(iptPecas) iptPecas.addEventListener('input', calcularPreview); 
if(selectPagamento) selectPagamento.addEventListener('change', calcularPreview);

// ================= FETCH E LISTAGENS =================

async function carregarEstoque() {
    try {
        const res = await fetch(API_ESTOQUE_URL); const lista = await res.json();
        const painel = document.getElementById('estoque-lista'); 
        if(!painel) return;
        painel.innerHTML = '';
        if(lista.length === 0) painel.innerHTML = '<div class="text-center text-gray-600 text-xs py-4">O seu estoque está vazio.</div>';
        
        if(selectPeca) selectPeca.innerHTML = '<option value="" data-preco="0">Nenhuma peça</option>';
        
        lista.forEach(p => {
            painel.innerHTML += `<div class="card-dark p-3 flex justify-between items-center bg-[#0f0f0f] mb-3"><div><div class="text-sm font-bold text-gray-200">${p.nome}</div><div class="text-[10px] text-accent font-bold mt-1">R$ ${parseFloat(p.preco).toFixed(2).replace('.',',')}</div></div><div class="flex items-center gap-3"><div class="text-center px-3 py-1 bg-[#1a1a1a] rounded-lg border border-[#333]"><div class="text-[8px] text-gray-500 uppercase">Estoque</div><div class="font-black text-lg ${p.quantidade > 0 ? 'text-green-500' : 'text-red-500'}">${p.quantidade}</div></div><button onclick="excluirPeca(${p.id})" class="text-red-500 opacity-50 hover:opacity-100"><i class="fa-solid fa-trash"></i></button></div></div>`;
            if(selectPeca) selectPeca.innerHTML += `<option value="${p.id}" data-preco="${p.preco}" ${p.quantidade <= 0 ? 'disabled' : ''}>${p.nome} (Est. ${p.quantidade}) - R$ ${parseFloat(p.preco).toFixed(2).replace('.',',')}</option>`;
        });
    } catch(e) {}
}

async function carregarEquipe() {
    try {
        const res = await fetch(API_MECANICOS_URL); const lista = await res.json();
        const painel = document.getElementById('equipe-lista'); 
        if(!painel) return;
        painel.innerHTML = '';
        
        const selectMecanico = document.getElementById('select_mecanico');
        
        if(lista.length === 0) painel.innerHTML = '<div class="text-center text-gray-600 text-xs py-4">Nenhum mecânico cadastrado.</div>';
        if(selectMecanico) selectMecanico.innerHTML = '<option value="">Não atribuído</option>';

        lista.forEach(m => {
            painel.innerHTML += `<div class="card-dark p-3 flex justify-between items-center bg-[#0f0f0f] mb-3"><div><div class="text-sm font-bold text-gray-200"><i class="fa-solid fa-user-gear text-gray-500 mr-2"></i>${m.nome}</div><div class="text-[10px] text-accent font-bold mt-1">${m.especialidade} | ${m.telefone}</div></div><button onclick="excluirMecanico(${m.id})" class="text-red-500 opacity-50 hover:opacity-100 p-2"><i class="fa-solid fa-trash"></i></button></div>`;
            if(selectMecanico) selectMecanico.innerHTML += `<option value="${m.id}">${m.nome} (${m.especialidade})</option>`;
        });
    } catch(e) {}
}

async function carregarOS() {
    try {
        const res = await fetch(API_OS_URL); const lista = await res.json();
        let abertas = 0; let prontas = 0; let fatMao = 0; let fatPeca = 0; let totalFat = 0; let comissao = 0;
        
        const painelOS = document.getElementById('os-lista'); 
        if(painelOS) painelOS.innerHTML = '';
        
        const painelOrcamentos = document.getElementById('orcamento-lista'); 
        if(painelOrcamentos) painelOrcamentos.innerHTML = '';

        lista.forEach(os => {
            const comissaoOS = parseFloat(os.valor_pecas || 0) * 0.03;
            const dataFmt = os.data_agendamento ? new Date(os.data_agendamento).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';
            
            // 👉 SE FOR ORÇAMENTO
            if (os.status_servico === 'Orçamento' && painelOrcamentos) {
                const osString = encodeURIComponent(JSON.stringify(os));
                painelOrcamentos.innerHTML += `
                <div class="card-dark p-4 relative overflow-hidden bg-[#141414] border-l-4 border-l-blue-500 mb-3">
                    <div class="flex justify-between items-start mb-2">
                        <div><h3 class="font-bold text-sm text-white uppercase">${os.modelo_veiculo}</h3><span class="text-[10px] font-mono text-blue-400">PLACA: ${os.placa}</span></div>
                        <div class="flex items-center gap-2">
                            <button onclick="carregarParaEdicao(${os.id})" class="w-7 h-7 bg-blue-900/30 text-blue-500 rounded flex items-center justify-center hover:bg-blue-900/60" title="Editar Orçamento"><i class="fa-solid fa-pencil text-[10px]"></i></button>
                            <span class="text-[8px] px-2 py-0.5 rounded border border-blue-900 text-blue-400 bg-blue-900/20 uppercase font-black">Orçamento</span>
                        </div>
                    </div>
                    <div class="bg-[#0f0f0f] rounded-lg p-3 text-xs text-gray-400 mb-3">
                        <div class="mb-1 text-gray-300"><i class="fa-solid fa-wrench text-gray-600 mr-1"></i> ${os.descricao}</div>
                        <div class="text-[10px] text-gray-500"><i class="fa-solid fa-user-gear mr-1"></i> Mecânico: ${os.mecanico_nome || 'N/A'}</div>
                        <div class="text-[10px] text-accent font-bold mt-2">Valor Estimado: R$ ${parseFloat(os.total_pago || 0).toFixed(2).replace('.',',')}</div>
                    </div>
                    <div class="flex gap-2 justify-end mt-2">
                        <button onclick="enviarWhats('${osString}')" class="px-2 py-1.5 bg-green-600 text-black font-black text-[9px] rounded flex items-center gap-1 uppercase tracking-wider hover:bg-green-500"><i class="fa-brands fa-whatsapp text-xs"></i> Whats</button>
                        <button onclick="aprovarOrcamento(${os.id})" class="px-2 py-1.5 bg-accent text-black font-black text-[9px] rounded flex items-center gap-1 uppercase tracking-wider hover:bg-yellow-300"><i class="fa-solid fa-check-double"></i> Aprovar</button>
                        <button onclick="excluirOS(${os.id})" class="px-2 py-1.5 bg-red-900/50 text-red-500 font-black text-[9px] rounded flex items-center gap-1 uppercase tracking-wider hover:bg-red-900"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>`;
            } 
            // 👉 SE FOR ORDEM DE SERVIÇO ATIVA
            else if (painelOS) {
                if(os.status_servico === 'Pendente') { abertas++; } else { prontas++; fatMao += parseFloat(os.valor_mao_obra || 0); fatPeca += parseFloat(os.valor_pecas || 0); totalFat += parseFloat(os.total_pago || 0); comissao += comissaoOS; }

                const cor = os.status_servico === 'Pronto' ? 'green' : 'yellow';
                painelOS.innerHTML += `
                <div class="card-dark p-4 relative overflow-hidden mb-3">
                    <div class="absolute left-0 top-0 bottom-0 w-1 bg-${cor}-500"></div>
                    <div class="flex justify-between items-start mb-2">
                        <div><h3 class="font-bold text-sm text-white uppercase">${os.modelo_veiculo}</h3><span class="text-[10px] font-mono text-accent">${os.placa}</span></div>
                        <span class="text-[9px] px-2 py-0.5 rounded border border-${cor}-900 text-${cor}-500 bg-${cor}-900/20 uppercase font-bold">${os.status_servico}</span>
                    </div>
                    <div class="bg-[#0f0f0f] rounded-lg p-3 text-xs text-gray-400 mb-3">
                        <div class="flex gap-2 mb-1"><span class="text-gray-300 flex-1">${os.descricao}</span></div>
                        <div class="text-[10px] text-gray-500"><i class="fa-solid fa-user-gear mr-1"></i> Mecânico: <span class="text-gray-300 font-bold">${os.mecanico_nome || 'N/A'}</span></div>
                        <div class="flex justify-between items-center mt-2 pt-2 border-t border-[#1a1a1a] text-[9px] uppercase"><span>Data: ${dataFmt}</span><span>Comissão Peça: R$ ${comissaoOS.toFixed(2).replace('.',',')}</span></div>
                    </div>
                    <div class="flex justify-between items-center">
                        <div class="font-black text-lg text-accent">R$ ${parseFloat(os.total_pago || 0).toFixed(2).replace('.',',')}</div>
                        <div class="flex gap-1">
                            ${os.status_servico === 'Pendente' ? `<button onclick="marcarPronto(${os.id})" class="w-8 h-8 bg-green-900/30 text-green-500 rounded flex items-center justify-center hover:bg-green-900/60" title="Marcar Pronto"><i class="fa-solid fa-check text-xs"></i></button>` : ''}
                            <button onclick="carregarParaEdicao(${os.id})" class="w-8 h-8 bg-blue-900/30 text-blue-500 rounded flex items-center justify-center hover:bg-blue-900/60" title="Editar OS"><i class="fa-solid fa-pencil text-xs"></i></button>
                            <button onclick="excluirOS(${os.id})" class="w-8 h-8 bg-red-900/30 text-red-500 rounded flex items-center justify-center hover:bg-red-900/60" title="Excluir"><i class="fa-solid fa-trash text-xs"></i></button>
                        </div>
                    </div>
                </div>`;
            }
        });

        if(document.getElementById('dash-abertas')) document.getElementById('dash-abertas').innerText = abertas.toString().padStart(2, '0');
        if(document.getElementById('dash-prontas')) document.getElementById('dash-prontas').innerText = prontas.toString().padStart(2, '0');
        if(document.getElementById('dash-mao-obra')) document.getElementById('dash-mao-obra').innerText = 'R$ ' + fatMao.toFixed(2).replace('.',',');
        if(document.getElementById('dash-pecas')) document.getElementById('dash-pecas').innerText = 'R$ ' + fatPeca.toFixed(2).replace('.',',');
        if(document.getElementById('dash-comissao')) document.getElementById('dash-comissao').innerText = '+ R$ ' + comissao.toFixed(2).replace('.',',');
        if(document.getElementById('dash-total')) document.getElementById('dash-total').innerText = 'R$ ' + totalFat.toFixed(2).replace('.',',');

        // AGENDA DA SEMANA
        const painelAgenda = document.getElementById('agenda-semana-lista');
        if(painelAgenda) painelAgenda.innerHTML = '';

        const hoje = new Date();
        const primeiroDia = new Date(hoje.setDate(hoje.getDate() - hoje.getDay()));
        primeiroDia.setHours(0,0,0,0);
        const ultimoDia = new Date(primeiroDia);
        ultimoDia.setDate(primeiroDia.getDate() + 6);
        ultimoDia.setHours(23,59,59,999);

        let qtdAgenda = 0;

        const listaOrdenada = [...lista].filter(os => os.data_agendamento && os.status_servico !== 'Orçamento').sort((a, b) => {
            const dataA = new Date(a.data_agendamento.split('T')[0] + 'T' + a.horario_entrega);
            const dataB = new Date(b.data_agendamento.split('T')[0] + 'T' + b.horario_entrega);
            return dataA - dataB;
        });

        listaOrdenada.forEach(os => {
            const partesData = os.data_agendamento.split('T')[0].split('-');
            const dataOS = new Date(partesData[0], partesData[1]-1, partesData[2]);
            
            if (dataOS >= primeiroDia && dataOS <= ultimoDia && painelAgenda) {
                qtdAgenda++;
                const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                const nomeDia = diasSemana[dataOS.getDay()];
                const dataFormatada = `${partesData[2]}/${partesData[1]}`;
                const corStatus = os.status_servico === 'Pronto' ? 'text-green-500' : 'text-yellow-500';

                painelAgenda.innerHTML += `
                <div class="bg-[#0f0f0f] border border-[#222] rounded-lg p-3 flex justify-between items-center shadow-lg">
                    <div class="flex items-center gap-3">
                        <div class="bg-[#1a1a1a] rounded-lg py-2 px-1 text-center w-[50px] border border-[#333]">
                            <div class="text-[8px] text-gray-500 uppercase font-bold tracking-widest">${nomeDia}</div>
                            <div class="text-[11px] font-black text-accent leading-none mt-1">${dataFormatada}</div>
                        </div>
                        <div>
                            <div class="text-xs font-bold text-gray-200 flex items-center gap-1.5"><i class="fa-regular fa-clock text-accent"></i> ${os.horario_entrega ? os.horario_entrega.substring(0,5) : ''}</div>
                            <div class="text-[10px] text-gray-400 mt-1"><span class="text-white font-bold">${os.modelo_veiculo}</span></div>
                        </div>
                    </div>
                    <div class="text-right flex flex-col justify-between items-end h-full">
                        <div class="text-[9px] uppercase font-bold ${corStatus} bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#333]">${os.status_servico}</div>
                        <div class="text-[9px] text-gray-500 mt-1.5"><i class="fa-solid fa-user-gear"></i> ${os.mecanico_nome ? os.mecanico_nome.split(' ')[0] : 'N/A'}</div>
                    </div>
                </div>`;
            }
        });

        if(painelAgenda && qtdAgenda === 0) {
            painelAgenda.innerHTML = '<div class="text-center p-4 text-gray-600 text-[10px] uppercase font-bold tracking-widest border border-dashed border-[#333] rounded-lg">Agenda livre nesta semana</div>';
        }
        if(document.getElementById('badge-agenda-qtd')) document.getElementById('badge-agenda-qtd').innerText = qtdAgenda;

    } catch(e) {}
}

// ================= SALVAMENTOS DE FORMULÁRIO E EDIÇÃO =================

const formOS = document.getElementById('formOS');
if (formOS) {
    formOS.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const safeVal = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        const dados = {
            status_servico: safeVal('status_servico'),
            modelo_veiculo: safeVal('modelo_veiculo'),
            placa: safeVal('placa_veiculo'),
            descricao: safeVal('descricao_servico'),
            mecanico_id: safeVal('select_mecanico') || null,
            peca_id: safeVal('select_peca') || null,
            valor_mao_obra: safeVal('valor_mao_obra'),
            valor_pecas: safeVal('valor_pecas'),
            data_agendamento: safeVal('data_agendamento'),
            horario_entrega: safeVal('horario_entrega'),
            tempo_estimado: safeVal('tempo_estimado'),
            logistica: safeVal('logistica'),
            forma_pagamento: safeVal('pagamento'),
            total_pago: totalCalculadoFinal
        };

        if (modoEdicaoId) {
            const res = await fetch(`${API_OS_URL}/${modoEdicaoId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)});
            if(!res.ok) { const erroSrv = await res.json(); alert("❌ ERRO MYSQL:\n" + (erroSrv.erro || erroSrv.msg)); return; }
            alert("✅ Registro atualizado com sucesso!");
            modoEdicaoId = null;
        } else {
            const res = await fetch(API_OS_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)});
            if(!res.ok) { const erroSrv = await res.json(); alert("❌ ERRO MYSQL:\n" + (erroSrv.erro || erroSrv.msg)); return; }
            alert("✅ Registro criado com sucesso!");
        }

        formOS.reset(); carregarOS(); carregarEstoque(); 
        if(dados.status_servico === 'Orçamento') { changeTab('orcamentos'); } else { changeTab('painel'); }
    });
}

// 👉 CARREGAR PARA EDIÇÃO (Versão Blindada)
async function carregarParaEdicao(id) {
    try {
        const res = await fetch(`${API_OS_URL}/${id}`); 
        if(!res.ok) throw new Error("Falha na resposta do servidor.");
        const os = await res.json();
        
        if(!os || !os.id) return alert("Erro ao carregar dados do servidor.");

        modoEdicaoId = id; 
        changeTab('agendar'); 
        
        const preencher = (campoId, valor) => {
            const elemento = document.getElementById(campoId);
            if (elemento) {
                elemento.value = valor;
            } else {
                console.warn(`Aviso visual: O campo '${campoId}' não foi encontrado no seu HTML. Ignorando...`);
            }
        };

        preencher('status_servico', os.status_servico === 'Orçamento' ? 'Orçamento' : 'Pendente');
        preencher('modelo_veiculo', os.modelo_veiculo || '');
        preencher('placa_veiculo', os.placa || '');
        preencher('descricao_servico', os.descricao || '');
        preencher('select_mecanico', os.mecanico_id || '');
        preencher('select_peca', os.peca_id || '');
        preencher('valor_mao_obra', os.valor_mao_obra || '');
        preencher('valor_pecas', os.valor_pecas || '');
        preencher('data_agendamento', os.data_agendamento ? os.data_agendamento.split('T')[0] : '');
        preencher('horario_entrega', os.horario_entrega || '');
        preencher('tempo_estimado', os.tempo_estimado || '');
        preencher('logistica', os.logistica || 'Cliente busca');
        preencher('pagamento', os.forma_pagamento || 'PIX');
        
        calcularPreview(); 
    } catch(e) { 
        console.error("ERRO DETECTADO PELO JAVASCRIPT:", e);
        alert("Erro ao preencher a tela. Olhe a aba Console (F12) para ver o motivo real!"); 
    }
}

// 👉 APROVAÇÃO ROBUSTA
async function aprovarOrcamento(id) {
    if(confirm('Confirmar aprovação? Isso transformará o Orçamento em Ordem de Serviço ativa.')) {
        try {
            const res = await fetch(`${API_OS_URL}/${id}/aprovar`, { method: 'PUT' });
            if(!res.ok) {
                const erro = await res.json();
                alert("❌ Erro ao aprovar: " + (erro.erro || "Falha interna no servidor"));
                return;
            }
            carregarOS(); carregarEstoque(); changeTab('painel'); alert("🚀 Orçamento aprovado! Movido para Ordens de Serviço.");
        } catch(e) {
            alert("❌ Erro de rede ou servidor desligado.");
        }
    }
}

function enviarWhats(osString) {
    const os = JSON.parse(decodeURIComponent(osString));
    const totalFmt = parseFloat(os.total_pago || 0).toFixed(2).replace('.',',');
    const maoFmt = parseFloat(os.valor_mao_obra || 0).toFixed(2).replace('.',',');
    const pecasFmt = parseFloat(os.valor_pecas || 0).toFixed(2).replace('.',',');

    const texto = encodeURIComponent(
`*GARAGEOS PRO - ORÇAMENTO* 🚗
---------------------------------------
*Veículo:* ${os.modelo_veiculo}
*Placa:* ${os.placa}
*Mecânico:* ${os.mecanico_nome || 'A definir'}
*Serviço:* ${os.descricao}
*Peça inclusa:* ${os.peca_nome || 'Nenhuma'}
---------------------------------------
*Mão de Obra:* R$ ${maoFmt}
*Peças:* R$ ${pecasFmt}
*CONDIÇÃO:* ${os.forma_pagamento || 'A combinar'}
*TOTAL ESTIMADO:* R$ ${totalFmt}
---------------------------------------
_Ficamos aguardando sua autorização para iniciar o serviço!_`
    );
    window.open(`https://api.whatsapp.com/send?text=${texto}`, '_blank');
}

const formEstoque = document.getElementById('formEstoque');
if (formEstoque) {
    formEstoque.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = { 
            nome_peca: document.getElementById('nome_peca').value, 
            preco_unitario: document.getElementById('preco_peca').value, 
            quantidade: document.getElementById('quantidade_peca').value 
        };
        const res = await fetch(API_ESTOQUE_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)});
        if(!res.ok) return alert("Erro ao salvar peça.");
        formEstoque.reset(); carregarEstoque(); changeTab('estoque');
    });
}

const formEquipe = document.getElementById('formEquipe');
if (formEquipe) {
    formEquipe.addEventListener('submit', async (e) => {
        e.preventDefault();
        const dados = { 
            nome: document.getElementById('nome_mecanico').value, 
            especialidade: document.getElementById('especialidade_mecanico').value, 
            telefone: document.getElementById('telefone_mecanico').value 
        };
        const res = await fetch(API_MECANICOS_URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(dados)});
        if(!res.ok) return alert("Erro ao salvar mecânico.");
        formEquipe.reset(); carregarEquipe(); changeTab('equipe');
    });
}

async function marcarPronto(id) { await fetch(`${API_OS_URL}/${id}/pronto`, { method: 'PUT' }); carregarOS(); }
async function excluirOS(id) { if(confirm('Excluir registro?')) { await fetch(`${API_OS_URL}/${id}`, { method: 'DELETE' }); carregarOS(); } }
async function excluirPeca(id) { if(confirm('Excluir peça do estoque?')) { await fetch(`${API_ESTOQUE_URL}/${id}`, { method: 'DELETE' }); carregarEstoque(); } }
async function excluirMecanico(id) { if(confirm('Excluir mecânico da equipe?')) { await fetch(`${API_MECANICOS_URL}/${id}`, { method: 'DELETE' }); carregarEquipe(); } }

setInterval(() => { const relogio = document.getElementById('relogio'); if(relogio) relogio.innerText = new Date().toLocaleTimeString('pt-BR'); }, 1000);