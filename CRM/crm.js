/* ═══════════════════════════════════════════
   WiplyHQ CRM — crm.js
   Adicione ao final do script.js ou importe
   separado antes do </body>.

   Expõe: CRM.init() — chame após o DOM estar
   pronto, ou no DOMContentLoaded.
   ════════════════════════════════════════════ */

const CRM = (() => {

  /* ══════════════════════════════
     DATA — substitua por chamadas
     à sua API real
     ══════════════════════════════ */
  const CLIENTS = [
    { id:'sarah',   ii:'SJ', name:'Sarah Johnson',   phone:'(555) 123-4567', score:88, status:'active',   src:'crm',  freq:'Semanal',   lastDays:5,  value:'$150/sem',  totalSpent:'$2.400', since:'Jan 2025', visits:16, next:'Sex 27 Mar 09:00' },
    { id:'lisa',    ii:'LT', name:'Lisa Thompson',    phone:'(555) 567-8901', score:82, status:'active',   src:'crm',  freq:'Semanal',   lastDays:7,  value:'$160/sem',  totalSpent:'$1.920', since:'Fev 2025', visits:12, next:'Sáb 21 Mar 09:00' },
    { id:'michael', ii:'MC', name:'Michael Chen',     phone:'(555) 234-5678', score:74, status:'active',   src:'wa',   freq:'Quinzenal', lastDays:10, value:'$120/quin', totalSpent:'$1.440', since:'Mar 2025', visits:12, next:'Seg 30 Mar 10:30' },
    { id:'james',   ii:'JW', name:'James Wilson',     phone:'(555) 456-7890', score:52, status:'risk',     src:'call', freq:'Mensal',    lastDays:22, value:'$200/mês',  totalSpent:'$800',   since:'Set 2025', visits:4,  next:'—' },
    { id:'emily',   ii:'ED', name:'Emily Davis',      phone:'(555) 345-6789', score:48, status:'risk',     src:'sms',  freq:'Mensal',    lastDays:28, value:'$180/mês',  totalSpent:'$540',   since:'Jun 2025', visits:3,  next:'—' },
    { id:'robert',  ii:'RM', name:'Robert Martinez',  phone:'(555) 678-9012', score:18, status:'inactive', src:'crm',  freq:'—',         lastDays:54, value:'perdido?',  totalSpent:'$360',   since:'Out 2025', visits:2,  next:'—' },
  ];

  const LEADS = [
    { id:'l1', ii:'JM', name:'Jennifer Moore',  phone:'(555) 891-2345', src:'wa',   time:'10 min', unread:true,  preview:'Oi vi o anúncio, quero saber o preço' },
    { id:'l2', ii:'DK', name:'David Kim',        phone:'(555) 234-7890', src:'wa',   time:'45 min', unread:true,  preview:'Hello, do you have availability Saturday?' },
    { id:'l3', ii:'PT', name:'Patricia Torres',  phone:'(555) 567-1234', src:'call', time:'2h',     unread:true,  preview:'Ligação recebida — 4 min — Austin TX' },
  ];

  const MESSAGES = {
    sarah:  [
      { from:'them', text:'Posso confirmar minha limpeza de sexta?', time:'09:11' },
      { from:'us',   text:'Tudo confirmado! Sex 27 Mar às 09:00 com Ana Silva.', time:'09:13', ch:'wa' },
      { from:'them', text:'Ótimo, obrigada!', time:'09:14' },
    ],
    lisa:   [
      { from:'them', text:'Preciso adiantar o horário de sábado.', time:'08:40' },
      { from:'us',   text:'Oi Lisa! Tem 08:00 disponível com Ana!', time:'08:45', ch:'wa' },
      { from:'them', text:'Perfeito, pode colocar 08:00.', time:'08:46' },
    ],
    michael:[
      { from:'them', text:'Hi, when is my next cleaning?', time:'10:07' },
      { from:'us',   text:'Hi Michael! Mon Mar 30 at 10:30 with Maria Santos.', time:'10:10', ch:'wa' },
    ],
    james:  [
      { from:'them', text:'Preciso reagendar, viagem de trabalho.', time:'11:22' },
      { from:'us',   text:'Sem problema James! Quais datas você tem?', time:'11:30', ch:'sms' },
    ],
    emily:  [
      { from:'them', text:'Vocês usam produtos sem cheiro forte?', time:'14:05' },
      { from:'us',   text:'Sim Emily! Usamos produtos hipoalergênicos.', time:'14:10', ch:'wa' },
    ],
    robert: [
      { from:'them', text:'Vocês ainda atendem minha região?', time:'09:50' },
      { from:'us',   text:'Oi Robert! Claro! Quer agendar uma limpeza?', time:'10:00', ch:'sms' },
    ],
    l1: [{ from:'them', text:'Oi vi o anúncio de vocês, quero saber o preço de uma limpeza pra minha casa', time:'10:42' }],
    l2: [{ from:'them', text:'Hello, do you have availability this Saturday? 3 bedrooms house', time:'10:07' }],
    l3: [{ from:'them', text:'[Ligação recebida — 4 min — Austin TX]', time:'08:55' }],
  };

  const AUTOMATIONS = {
    sarah:  [
      { title:'Lembrete 24h',             sub:'Sex 27 Mar 09:00',        status:'sched',   msg:'Oi Sarah! Lembrando da limpeza amanhã às 09:00. Ana Silva estará aí!', on:true },
      { title:'Review pós-limpeza',       sub:'Após Sex 27',             status:'pending', msg:'Sarah! Como foi a limpeza? Nos deixe uma avaliação!', on:true },
      { title:'Confirmação de agendamento', sub:'Enviada em 18 Mar',     status:'sent',    msg:'Sarah! Limpeza confirmada para Sex 27 às 09:00.', on:true },
    ],
    michael:[
      { title:'Follow-up automático',     sub:'Score 74 — monitorando',  status:'pending', msg:'Oi Michael! Temos horários disponíveis esta semana!', on:true },
      { title:'Confirmação',              sub:'Enviada em 17 Mar',        status:'sent',    msg:'Michael! Limpeza confirmada para Seg 30 às 10:30.', on:true },
    ],
    emily:  [{ title:'Follow-up automático', sub:'Score 48 — em risco',  status:'sched',   msg:'Oi Emily! Usamos produtos sem químicos fortes. Quer agendar?', on:true }],
    james:  [{ title:'Follow-up automático', sub:'Score 52 — em risco',  status:'sched',   msg:'Oi James! Hora da limpeza mensal. Tem horários esta semana!', on:true }],
    lisa:   [{ title:'Lembrete 24h',         sub:'Sáb 21 Mar 09:00',     status:'sched',   msg:'Oi Lisa! Lembrando da limpeza amanhã às 09:00 com Ana!', on:true }],
    robert: [{ title:'Follow-up automático', sub:'Score 18 — inativo 54 dias', status:'sched', msg:'Oi Robert! Saudades! 15% de desconto esta semana.', on:true }],
  };

  const HISTORY = {
    sarah:  [
      { date:'Mar 15', title:'Limpeza realizada',            meta:'Ana Silva · 3h',                amount:'$150', color:'#22C55E' },
      { date:'Mar 08', title:'Limpeza realizada',            meta:'Ana Silva · 3h',                amount:'$150', color:'#22C55E' },
      { date:'Mar 01', title:'Limpeza realizada',            meta:'Ana Silva · 3h',                amount:'$150', color:'#22C55E' },
      { date:'Fev 22', title:'Lembrete automático enviado',  meta:'24h antes',                     amount:'',     color:'#3B82F6' },
    ],
    michael:[
      { date:'Mar 10', title:'Limpeza realizada',            meta:'Maria Santos · 2.5h',           amount:'$120', color:'#22C55E' },
      { date:'Fev 10', title:'Follow-up automático enviado', meta:'Score caiu para 71',            amount:'',     color:'#F59E0B' },
    ],
    emily:  [
      { date:'Fev 20', title:'Limpeza realizada',            meta:'Carlos Oliveira · 4h',          amount:'$180', color:'#22C55E' },
      { date:'Fev 18', title:'Follow-up automático enviado', meta:'Score caiu para 61',            amount:'',     color:'#F59E0B' },
      { date:'Dez 20', title:'Primeira limpeza',             meta:'Carlos Oliveira · 4h',          amount:'$180', color:'#3B82F6' },
    ],
    james:  [
      { date:'Fev 26', title:'Limpeza realizada',            meta:'Carlos Oliveira · 3h',          amount:'$200', color:'#22C55E' },
      { date:'Fev 24', title:'Follow-up automático enviado', meta:'Score caiu para 58',            amount:'',     color:'#F59E0B' },
    ],
    lisa:   [
      { date:'Mar 13', title:'Limpeza realizada',            meta:'Ana Silva · 3h',                amount:'$160', color:'#22C55E' },
      { date:'Fev 27', title:'Confirmação automática',       meta:'Agendamento criado',            amount:'',     color:'#3B82F6' },
    ],
    robert: [
      { date:'Jan 25', title:'Última limpeza',               meta:'Carlos Oliveira · 3h',          amount:'$180', color:'#22C55E' },
      { date:'Jan 10', title:'Alerta: sem reagendamento',    meta:'Gerado automaticamente',        amount:'',     color:'#EF4444' },
      { date:'Dez 25', title:'Primeira limpeza',             meta:'Carlos Oliveira · 3h',          amount:'$180', color:'#3B82F6' },
    ],
  };

  const PIPELINE_COLS = [
    { label:'Ativos',    color:'#22C55E', statuses:['active'] },
    { label:'Em risco',  color:'#F59E0B', statuses:['risk'] },
    { label:'Inativos',  color:'#EF4444', statuses:['inactive'] },
    { label:'Reativados',color:'#3B82F6', statuses:['reactivated'] },
  ];

  /* ══════════════════════════════
     STATE
     ══════════════════════════════ */
  let activeChannel = 'wa'; // 'wa' | 'sms'

  /* ══════════════════════════════
     HELPERS
     ══════════════════════════════ */
  function scoreColor(s) {
    return s >= 70 ? '#22C55E' : s >= 50 ? '#F59E0B' : '#EF4444';
  }

  function lastLabel(days) {
    return days === 1 ? '1 dia' : `${days} dias`;
  }

  function srcTagHTML(src) {
    const labels = { wa:'WhatsApp', sms:'SMS', call:'Ligação', crm:'CRM' };
    return `<span class="src-tag src-tag-${src}">${labels[src] || src}</span>`;
  }

  /* SVG icons — dimensões fixas, sem herança */
  const ICON = {
    wa: `<svg width="10" height="10" viewBox="0 0 32 32" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <path fill="#25D366" d="M16 3C9.37 3 4 8.37 4 15c0 2.38.67 4.61 1.83 6.5L4 29l7.75-1.81A11.94 11.94 0 0016 28c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 2c5.52 0 10 4.48 10 10s-4.48 10-10 10a9.94 9.94 0 01-5.02-1.36l-.36-.21-4.6 1.07 1.11-4.47-.23-.37A9.96 9.96 0 016 15c0-5.52 4.48-10 10-10zm-3.3 5.5c-.2 0-.52.08-.8.38-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.1 4.5.71.31 1.27.49 1.7.63.71.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.41-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.68-.51L12.7 10.5z"/>
    </svg>`,
    sms: `<svg width="10" height="10" viewBox="0 0 24 24" style="display:block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`,
    call: `<svg width="10" height="10" viewBox="0 0 24 24" style="display:block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>`,
    calendar: `<svg width="10" height="10" viewBox="0 0 24 24" style="display:block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>`,
    wa14: `<svg width="14" height="14" viewBox="0 0 32 32" style="display:block" xmlns="http://www.w3.org/2000/svg">
      <path fill="currentColor" d="M16 3C9.37 3 4 8.37 4 15c0 2.38.67 4.61 1.83 6.5L4 29l7.75-1.81A11.94 11.94 0 0016 28c6.63 0 12-5.37 12-12S22.63 3 16 3zm0 2c5.52 0 10 4.48 10 10s-4.48 10-10 10a9.94 9.94 0 01-5.02-1.36l-.36-.21-4.6 1.07 1.11-4.47-.23-.37A9.96 9.96 0 016 15c0-5.52 4.48-10 10-10zm-3.3 5.5c-.2 0-.52.08-.8.38-.27.3-1.05 1.02-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.1 3.2 5.1 4.5.71.31 1.27.49 1.7.63.71.23 1.37.2 1.88.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.23-.65.08-.3-.15-1.27-.47-2.41-1.49-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.68-.51L12.7 10.5z"/>
    </svg>`,
    sms14: `<svg width="14" height="14" viewBox="0 0 24 24" style="display:block" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`,
    send: `<svg viewBox="0 0 24 24">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>`,
  };

  /* ══════════════════════════════
     TABS
     ══════════════════════════════ */
  function initTabs() {
    document.querySelectorAll('#crm-tabs .crm-tab').forEach(btn => {
      btn.addEventListener('click', () => showTab(btn.dataset.tab));
    });
  }

  function showTab(name) {
    document.querySelectorAll('#crm-tabs .crm-tab').forEach(t =>
      t.classList.toggle('on', t.dataset.tab === name)
    );
    const secs = {
      pipeline:   'crm-pipeline',
      inbox:      'crm-inbox',
      reativacao: 'crm-reativacao',
      historico:  'crm-historico',
    };
    Object.entries(secs).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('on', key === name);
    });
  }

  /* ══════════════════════════════
     PIPELINE
     ══════════════════════════════ */
  function renderPipeline() {
    const board = document.getElementById('pipeline-board');
    if (!board) return;

    board.innerHTML = PIPELINE_COLS.map(col => {
      const items = CLIENTS.filter(c => col.statuses.includes(c.status));
      return `
        <div class="p-col">
          <div class="p-col-head">
            <div class="p-col-dot" style="background:${col.color}"></div>
            <span class="p-col-title">${col.label}</span>
            <span class="p-col-count">${items.length}</span>
          </div>
          ${items.length === 0
            ? '<div class="p-col-empty">Nenhum ainda</div>'
            : items.map(c => renderPipelineCard(c)).join('')
          }
        </div>
      `;
    }).join('');
  }

  function renderPipelineCard(c) {
    const last = lastLabel(c.lastDays);
    return `
      <div class="p-card" data-client-id="${c.id}" onclick="CRM.goToInbox('${c.id}')">
        <div class="p-card-top">
          <div class="p-card-avatar">${c.ii}</div>
          <span class="p-card-name">${c.name}</span>
          ${srcTagHTML(c.src)}
        </div>
        <div class="p-card-meta">Último: ${last} · ${c.freq}</div>
        <div class="p-card-health-wrap">
          <div class="p-card-health-bar" style="width:${c.score}%;background:${scoreColor(c.score)}"></div>
        </div>
        <div class="p-card-score">Score ${c.score} · ${c.value}</div>
        <div class="p-card-actions" onclick="event.stopPropagation()">
          <button class="p-btn btn-wa"   title="WhatsApp"
            onclick="CRM.goToInbox('${c.id}')">${ICON.wa}</button>
          <button class="p-btn btn-sms"  title="SMS"
            onclick="CRM.onSMS('${c.id}')">${ICON.sms}</button>
          <button class="p-btn btn-call" title="Ligar"
            onclick="CRM.onCall('${c.id}')">${ICON.call}</button>
          <button class="p-btn btn-cal"  title="Reagendar"
            onclick="CRM.onReschedule('${c.id}')">${ICON.calendar}</button>
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════
     INBOX
     ══════════════════════════════ */
  function renderInboxList() {
    const list = document.getElementById('inbox-conv-list');
    if (!list) return;

    const all = [
      ...LEADS.map(l => ({ ...l, isLead: true })),
      ...CLIENTS.map(c => ({
        id: c.id, ii: c.ii, name: c.name, ph: c.phone,
        src: c.src, time: lastLabel(c.lastDays),
        unread: false,
        preview: `${lastLabel(c.lastDays)} atrás · ${c.freq}`,
        isLead: false,
      })),
    ];

    list.innerHTML = all.map(item => `
      <div class="conv-item ${item.unread ? 'unread' : ''}"
           id="ci-${item.id}"
           data-src="${item.src}"
           data-id="${item.id}"
           data-type="${item.isLead ? 'lead' : 'client'}"
           onclick="CRM.openChat('${item.id}','${item.isLead ? 'lead' : 'client'}')">
        <div class="conv-avatar">${item.ii}</div>
        <div class="conv-body">
          <div class="conv-row1">
            <span class="conv-name">${item.name}</span>
            ${srcTagHTML(item.src)}
            <span class="conv-time">${item.time}</span>
          </div>
          <div class="conv-row2">
            <span class="conv-preview">${item.preview}</span>
            ${item.unread ? '<div class="unread-dot"></div>' : ''}
          </div>
        </div>
      </div>
    `).join('');

    updateUnreadBadge();
  }

  function updateUnreadBadge() {
    const count = LEADS.filter(l => l.unread).length;
    const badge = document.getElementById('inbox-unread-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? '' : 'none';
    }
  }

  function openChat(id, type) {
    activeChannel = 'wa';

    // mark item active
    document.querySelectorAll('.conv-item').forEach(el => el.classList.remove('active'));
    const ci = document.getElementById('ci-' + id);
    if (ci) {
      ci.classList.add('active');
      ci.classList.remove('unread');
      const ud = ci.querySelector('.unread-dot');
      if (ud) ud.remove();
      // mark lead as read
      const lead = LEADS.find(l => l.id === id);
      if (lead) lead.unread = false;
      updateUnreadBadge();
    }

    const item = type === 'lead'
      ? LEADS.find(l => l.id === id)
      : CLIENTS.find(c => c.id === id);
    if (!item) return;

    const msgs  = MESSAGES[id] || [];
    const autos = type === 'client' ? (AUTOMATIONS[id] || []) : [];
    const isClient = type === 'client';
    const freq = isClient ? item.freq : '';

    const main = document.getElementById('inbox-main');
    main.innerHTML = `
      <div class="chat-header">
        <div class="chat-h-avatar">${item.ii}</div>
        <div style="flex:1;min-width:0">
          <div class="chat-h-name">${item.name} ${srcTagHTML(item.src)}</div>
          <div class="chat-h-sub">${item.phone || item.ph}${freq ? ' · ' + freq : ''}</div>
        </div>
        <div class="chat-h-actions">
          ${isClient ? `
            <button class="chat-h-btn" id="auto-tab-btn" onclick="CRM.toggleAutoPanel()">
              Automações
              ${autos.length ? `<span class="crm-badge badge-info">${autos.length}</span>` : ''}
            </button>
            <button class="chat-h-btn" onclick="CRM.onReschedule('${id}')">Reagendar ↗</button>
          ` : `
            <button class="chat-h-btn" onclick="CRM.onAddToCRM('${id}')">+ Adicionar ao CRM ↗</button>
          `}
        </div>
      </div>

      <div class="chat-messages" id="chat-msg-area">
        ${msgs.map(m => renderBubble(m)).join('')}
      </div>

      ${isClient ? `
        <div class="auto-panel" id="auto-panel" style="display:none">
          ${autos.map(a => renderAutoCard(a)).join('')}
        </div>
      ` : ''}

      <div class="chat-compose">
        <div class="channel-toggle" id="channel-toggle">
          <button class="ch-opt active-wa" id="ch-wa"  onclick="CRM.switchChannel('wa')">${ICON.wa14} WhatsApp</button>
          <button class="ch-opt"           id="ch-sms" onclick="CRM.switchChannel('sms')">${ICON.sms14} SMS</button>
        </div>
        <div class="compose-row">
          <textarea
            class="compose-textarea"
            id="compose-input"
            placeholder="Digite uma mensagem..."
            rows="1"
            onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();CRM.sendMessage();}"
          ></textarea>
          <button class="compose-ai-btn" onclick="CRM.onAISuggest('${item.name}')">IA ↗</button>
          <button class="compose-send-btn" id="send-btn" onclick="CRM.sendMessage()">
            ${ICON.send}
          </button>
        </div>
      </div>
    `;

    const msgArea = document.getElementById('chat-msg-area');
    if (msgArea) msgArea.scrollTop = msgArea.scrollHeight;
  }

  function renderBubble(m) {
    const cls = m.from === 'us'
      ? (m.ch === 'sms' ? 'us-sms' : 'us-wa')
      : 'them';
    const label = m.from === 'us' ? ` · ${m.ch === 'sms' ? 'SMS' : 'WA'}` : '';
    return `
      <div class="bubble ${cls}">
        <div>${m.text}</div>
        <div class="bubble-time">${m.time}${label}</div>
      </div>
    `;
  }

  function renderAutoCard(a) {
    const statusClass = { sent:'sent', sched:'sched', pending:'pending' }[a.status] || '';
    const statusLabel = { sent:'enviado', sched:'agendado', pending:'pendente' }[a.status] || a.status;
    return `
      <div class="auto-card">
        <div class="auto-card-top">
          <span class="auto-card-title">${a.title}</span>
          <span class="auto-status ${statusClass}">${statusLabel}</span>
          <div class="crm-toggle ${a.on ? 'on' : 'off'}"
               onclick="this.classList.toggle('on');this.classList.toggle('off')">
            <span></span>
          </div>
        </div>
        <div class="auto-card-sub">${a.sub}</div>
        <div class="auto-card-msg">${a.msg}</div>
      </div>
    `;
  }

  function toggleAutoPanel() {
    const ap   = document.getElementById('auto-panel');
    const msgs = document.getElementById('chat-msg-area');
    const btn  = document.getElementById('auto-tab-btn');
    if (!ap) return;
    const showing = ap.style.display !== 'none';
    ap.style.display   = showing ? 'none'  : 'flex';
    msgs.style.display = showing ? 'flex'  : 'none';
    if (btn) btn.classList.toggle('active', !showing);
  }

  function switchChannel(ch) {
    activeChannel = ch;
    const btnWA  = document.getElementById('ch-wa');
    const btnSMS = document.getElementById('ch-sms');
    const send   = document.getElementById('send-btn');
    const ta     = document.getElementById('compose-input');
    if (!btnWA || !btnSMS) return;
    btnWA.className  = 'ch-opt' + (ch === 'wa'  ? ' active-wa'  : '');
    btnSMS.className = 'ch-opt' + (ch === 'sms' ? ' active-sms' : '');
    if (send) send.className = 'compose-send-btn' + (ch === 'sms' ? ' sms' : '');
    if (ta)   ta.className   = 'compose-textarea'  + (ch === 'sms' ? ' sms' : '');
  }

  function sendMessage() {
    const ta = document.getElementById('compose-input');
    if (!ta || !ta.value.trim()) return;
    const area = document.getElementById('chat-msg-area');
    const now  = new Date();
    const t    = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    const msg  = { from:'us', text: ta.value.trim(), time: t, ch: activeChannel };
    const el   = document.createElement('div');
    el.innerHTML = renderBubble(msg);
    area.appendChild(el.firstElementChild);
    area.scrollTop = area.scrollHeight;
    ta.value = '';
  }

  /* ── inbox filters ── */
  function initInboxFilters() {
    document.getElementById('inbox-filters')?.addEventListener('click', e => {
      const btn = e.target.closest('.inf');
      if (!btn) return;
      document.querySelectorAll('#inbox-filters .inf').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.conv-item').forEach(el => {
        el.style.display = (filter === 'all' || el.dataset.src === filter) ? '' : 'none';
      });
    });
    document.getElementById('inbox-search-input')?.addEventListener('input', e => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.conv-item').forEach(el => {
        const name = el.querySelector('.conv-name')?.textContent.toLowerCase() || '';
        el.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  /* ══════════════════════════════
     FILA DE REATIVAÇÃO
     ══════════════════════════════ */
  function renderReativacao() {
    const riskItems = CLIENTS.filter(c => c.status === 'risk' || c.status === 'inactive')
      .sort((a, b) => a.score - b.score);

    // stats
    const nRisk     = CLIENTS.filter(c => c.status === 'risk').length;
    const nInactive = CLIENTS.filter(c => c.status === 'inactive').length;
    const revenue   = riskItems.reduce((sum, c) => {
      const n = parseInt(c.totalSpent.replace(/\D/g,''));
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('react-stat-risk',     nRisk);
    setEl('react-stat-inactive', nInactive);
    setEl('react-stat-revenue',  `$${revenue.toLocaleString()}`);
    setEl('react-stat-auto',     riskItems.length);

    const badge = document.getElementById('react-badge');
    if (badge) badge.textContent = riskItems.length;

    const list = document.getElementById('react-list');
    if (!list) return;
    list.innerHTML = riskItems.map(c => {
      const last   = lastLabel(c.lastDays);
      const hiDays = c.lastDays >= 30;
      return `
        <div class="react-item">
          <div class="react-avatar">${c.ii}</div>
          <div class="react-info">
            <div class="react-name">${c.name} ${srcTagHTML(c.src)}</div>
            <div class="react-detail">Última limpeza: ${last} atrás · ${c.totalSpent} total</div>
            <div class="react-auto">Follow-up automático ${c.status === 'inactive' ? 'enviado' : 'agendado'}</div>
          </div>
          <span class="days-pill ${hiDays ? 'high' : 'medium'}">${last}</span>
          <div class="react-btns">
            <button class="react-btn wa"
              onclick="CRM.onReactivationMessage('${c.id}')">Mensagem</button>
            <button class="react-btn"
              onclick="CRM.onReactivationStrategy('${c.id}')">Estratégia ↗</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ══════════════════════════════
     HISTÓRICO
     ══════════════════════════════ */
  function renderHistSelect() {
    const sel = document.getElementById('hist-select');
    if (!sel) return;
    sel.innerHTML = CLIENTS.map(c =>
      `<option value="${c.id}">${c.name}</option>`
    ).join('');
    sel.addEventListener('change', () => renderHist(sel.value));
    renderHist(CLIENTS[0].id);
  }

  function renderHist(id) {
    const c   = CLIENTS.find(x => x.id === id);
    const evs = HISTORY[id] || [];
    if (!c) return;

    document.getElementById('hist-content').innerHTML = `
      <div class="hist-wrap">
        <div class="hist-meta">
          <div class="hist-meta-name">${c.name}</div>
          <div class="hist-meta-phone">${c.phone}</div>
          <div class="hist-meta-row">
            <div class="hist-meta-label">Cliente desde</div>
            <div class="hist-meta-value">${c.since}</div>
          </div>
          <div class="hist-meta-row">
            <div class="hist-meta-label">Total gasto</div>
            <div class="hist-meta-value">${c.totalSpent}</div>
          </div>
          <div class="hist-meta-row">
            <div class="hist-meta-label">Visitas</div>
            <div class="hist-meta-value">${c.visits}</div>
          </div>
          <div class="hist-meta-row">
            <div class="hist-meta-label">Frequência</div>
            <div class="hist-meta-value">${c.freq}</div>
          </div>
          <div class="hist-meta-row">
            <div class="hist-meta-label">Score</div>
            <div class="hist-meta-value" style="color:${scoreColor(c.score)}">${c.score}</div>
          </div>
        </div>
        <div class="hist-events">
          ${evs.map((e, i) => `
            <div class="timeline-event">
              <div class="tl-dot-col">
                <div class="tl-dot" style="background:${e.color}"></div>
                ${i < evs.length - 1 ? '<div class="tl-line"></div>' : ''}
              </div>
              <div class="tl-content">
                <div class="tl-title">
                  ${e.title}
                  ${e.amount ? `<span class="tl-amount">${e.amount}</span>` : ''}
                </div>
                <div class="tl-meta">${e.date} · ${e.meta}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  /* ══════════════════════════════
     PUBLIC ACTION HOOKS
     Conecte à sua lógica de negócio
     ou à integração com API/WhatsApp
     ══════════════════════════════ */

  /**
   * Navega para o Inbox abrindo a conversa do cliente.
   * @param {string} clientId
   */
  function goToInbox(clientId) {
    showTab('inbox');
    setTimeout(() => openChat(clientId, 'client'), 60);
  }

  /**
   * Disparado ao clicar no botão SMS de um card da pipeline.
   * @param {string} clientId
   */
  function onSMS(clientId) {
    const c = CLIENTS.find(x => x.id === clientId);
    console.log('[CRM] SMS →', c?.name, c?.phone);
    // Exemplo de integração com Twilio / Z-API:
    // twilioClient.messages.create({ to: c.phone, from: YOUR_NUMBER, body: '...' })
  }

  /**
   * Disparado ao clicar no botão de ligar.
   * @param {string} clientId
   */
  function onCall(clientId) {
    const c = CLIENTS.find(x => x.id === clientId);
    console.log('[CRM] Ligar →', c?.name, c?.phone);
    // window.open(`tel:${c.phone}`);
  }

  /**
   * Disparado ao clicar em Reagendar.
   * @param {string} clientId
   */
  function onReschedule(clientId) {
    const c = CLIENTS.find(x => x.id === clientId);
    console.log('[CRM] Reagendar →', c?.name);
    // Redirecione para a página de Schedule com o cliente pré-selecionado:
    // showPage('schedule'); schedulePreselect(clientId);
  }

  /**
   * Disparado ao clicar em "+ Adicionar ao CRM" para um lead.
   * @param {string} leadId
   */
  function onAddToCRM(leadId) {
    const l = LEADS.find(x => x.id === leadId);
    console.log('[CRM] Adicionar lead →', l?.name, l?.phone);
    // Crie o perfil de cliente na sua base de dados
  }

  /**
   * Sugestão de mensagem via IA (conecte ao seu endpoint).
   * @param {string} contactName
   */
  function onAISuggest(contactName) {
    console.log('[CRM] IA → sugerir resposta para', contactName);
    // fetch('/api/ai/suggest', { method:'POST', body: JSON.stringify({ contact: contactName }) })
  }

  /**
   * Mensagem de reativação para cliente inativo.
   * @param {string} clientId
   */
  function onReactivationMessage(clientId) {
    const c = CLIENTS.find(x => x.id === clientId);
    console.log('[CRM] Reativação mensagem →', c?.name);
    goToInbox(clientId);
  }

  /**
   * Estratégia de reativação (pode abrir modal ou seção).
   * @param {string} clientId
   */
  function onReactivationStrategy(clientId) {
    const c = CLIENTS.find(x => x.id === clientId);
    console.log('[CRM] Reativação estratégia →', c?.name, 'score', c?.score);
  }

  /* ══════════════════════════════
     INIT
     ══════════════════════════════ */
  function init() {
    initTabs();
    renderPipeline();
    renderInboxList();
    initInboxFilters();
    renderReativacao();
    renderHistSelect();
    // Garantir que a primeira aba esteja visível
    showTab('pipeline');
  }

  /* API pública */
  return {
    init,
    showTab,
    goToInbox,
    openChat,
    sendMessage,
    switchChannel,
    toggleAutoPanel,
    onSMS,
    onCall,
    onReschedule,
    onAddToCRM,
    onAISuggest,
    onReactivationMessage,
    onReactivationStrategy,
  };

})();

/* Auto-init quando o DOM estiver pronto */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CRM.init);
} else {
  CRM.init();
}