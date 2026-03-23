var API = 'https://wiplyhq-backend-production.up.railway.app';
var token = localStorage.getItem('token');

function showPage(id) {
  document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
  document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
  document.getElementById('page-' + id).classList.add('active');
  var nav = document.getElementById('nav-' + id);
  if (nav) nav.classList.add('active');
  if (id === 'clients') loadClients();
  if (id === 'cleaners') loadCleaners();
  if (id === 'dashboard') loadJobs();
  if (id === 'recurring') loadRecurring();
}

function loadClients() {
  fetch(API + '/api/clients', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(clients) {
    var grid = document.getElementById('clientsGrid');
    grid.innerHTML = '';
    clients.forEach(function(client) {
      grid.innerHTML += '<div class="client-card" data-name="' + client.name.toLowerCase() + '">'
        + '<div class="client-name">' + client.name + '</div>'
        + '<div class="client-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' + client.phone + '</div>'
        + '<div class="client-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + client.address + '</div>'
        + (client.notes ? '<div class="client-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>' + client.notes + '</div>' : '')
        + '</div>';
    });
  })
  .catch(function() { console.log('Erro ao carregar clientes'); });
}

function filterClients(val) {
  var q = val.toLowerCase();
  document.querySelectorAll('.client-card').forEach(function(c) {
    c.classList.toggle('hidden', q !== '' && !c.textContent.toLowerCase().includes(q));
  });
}

function saveClient() {
  var name = document.getElementById('client-name').value;
  var phone = document.getElementById('client-phone').value;
  var address = document.getElementById('client-address').value;
  var notes = document.getElementById('client-notes').value;
  if (!name || !phone || !address) return alert('Preencha nome, telefone e endereço');
  fetch(API + '/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name: name, phone: phone, address: address, notes: notes })
  })
  .then(function(res) { return res.json(); })
  .then(function() { closeModal('modal-client'); loadClients(); })
  .catch(function() { alert('Erro ao salvar cliente'); });
}

function loadCleaners() {
  fetch(API + '/api/cleaners', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(cleaners) {
    var grid = document.querySelector('.cleaners-grid');
    grid.innerHTML = '';
    cleaners.forEach(function(cleaner) {
      grid.innerHTML += '<div class="cleaner-card">'
        + '<div class="cleaner-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>'
        + '<div class="cleaner-name">' + cleaner.name + '</div>'
        + '<div class="cleaner-phone"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' + cleaner.phone + '</div>'
        + '<div class="cleaner-footer"><span class="badge ' + (cleaner.active ? 'badge-active' : 'badge-inactive') + '">' + (cleaner.active ? 'Active' : 'Inactive') + '</span></div>'
        + '</div>';
    });
  })
  .catch(function() { console.log('Erro ao carregar faxineiros'); });
}

function saveCleaner() {
  var name = document.getElementById('cleaner-name').value;
  var phone = document.getElementById('cleaner-phone').value;
  var email = document.getElementById('cleaner-email').value;
  if (!name || !phone || !email) return alert('Preencha todos os campos');
  fetch(API + '/api/cleaners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name: name, phone: phone, email: email })
  })
  .then(function(res) { return res.json(); })
  .then(function() { closeModal('modal-cleaner'); loadCleaners(); })
  .catch(function() { alert('Erro ao salvar faxineiro'); });
}

function loadJobs() {
  fetch(API + '/api/jobs', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(jobs) {
    var jobsCard = document.querySelector('.jobs-card');
    if (!jobsCard) return;
    var title = jobsCard.querySelector('.card-title');
    jobsCard.innerHTML = '';
    if (title) jobsCard.appendChild(title);
    jobs.forEach(function(job) {
      var date = new Date(job.scheduledAt);
      var time = date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');
      var statusClass = job.status === 'in-progress' ? 'badge-inprogress' : job.status === 'completed' ? 'badge-completed' : 'badge-scheduled';
      jobsCard.innerHTML += '<div class="job-item">'
        + '<div class="job-clock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>'
        + '<div class="job-info"><div class="job-name">' + job.client.name + '</div>'
        + '<div class="job-meta">' + time + ' · ' + job.cleaner.name + '</div></div>'
        + '<span class="badge ' + statusClass + '">' + job.status + '</span></div>';
    });
  })
  .catch(function() { console.log('Erro ao carregar jobs'); });
}

function loadJobSelects() {
  fetch(API + '/api/clients', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(clients) {
    var select = document.getElementById('job-client');
    select.innerHTML = '';
    clients.forEach(function(c) { select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>'; });
  });
  fetch(API + '/api/cleaners', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(cleaners) {
    var select = document.getElementById('job-cleaner');
    select.innerHTML = '';
    cleaners.forEach(function(c) { select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>'; });
  });
}

function saveJob() {
  var clientId = document.getElementById('job-client').value;
  var cleanerId = document.getElementById('job-cleaner').value;
  var scheduledAt = document.getElementById('job-date').value;
  var price = document.getElementById('job-price').value;
  if (!clientId || !cleanerId || !scheduledAt || !price) return alert('Preencha todos os campos');
  fetch(API + '/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ clientId: clientId, cleanerId: cleanerId, scheduledAt: scheduledAt, price: price })
  })
  .then(function(res) { return res.json(); })
  .then(function() { closeModal('modal-job'); loadJobs(); })
  .catch(function() { alert('Erro ao salvar job'); });
}

function loadRecurring() {
  fetch(API + '/api/recurring', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(recurring) {
    var list = document.querySelector('.recurring-list');
    list.innerHTML = '';
    recurring.forEach(function(r) {
      var date = new Date(r.nextDate).toISOString().split('T')[0];
      var freqClass = r.frequency === 'weekly' ? 'badge-weekly' : r.frequency === 'biweekly' ? 'badge-biweekly' : 'badge-monthly';
      list.innerHTML += '<div class="recurring-card">'
        + '<div class="recurring-left"><div class="recurring-name-row"><span class="recurring-name">' + r.client.name + '</span>'
        + '<span class="badge ' + freqClass + '">' + r.frequency + '</span></div>'
        + '<div class="recurring-meta"><div class="recurring-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' + r.client.address + '</div>'
        + '<div class="recurring-meta-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>$' + r.price + '</div></div></div>'
        + '<div class="recurring-right"><div class="recurring-next-label">Next Cleaning</div>'
        + '<div class="recurring-next-date"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>' + date + '</div></div></div>';
    });
  })
  .catch(function() { console.log('Erro ao carregar recorrentes'); });
}

function loadRecurringSelects() {
  fetch(API + '/api/clients', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(clients) {
    var select = document.getElementById('recurring-client');
    select.innerHTML = '';
    clients.forEach(function(c) { select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>'; });
  });
}

function saveRecurring() {
  var clientId = document.getElementById('recurring-client').value;
  var frequency = document.getElementById('recurring-frequency').value;
  var price = document.getElementById('recurring-price').value;
  var nextDate = document.getElementById('recurring-date').value;
  if (!clientId || !frequency || !price || !nextDate) return alert('Preencha todos os campos');
  fetch(API + '/api/recurring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ clientId: clientId, frequency: frequency, price: price, nextDate: nextDate })
  })
  .then(function(res) { return res.json(); })
  .then(function() { closeModal('modal-recurring'); loadRecurring(); })
  .catch(function() { alert('Erro ao salvar recorrente'); });
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
  if (id === 'modal-job') loadJobSelects();
  if (id === 'modal-recurring') loadRecurringSelects();
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function closeModalOutside(e, id) {
  if (e.target === document.getElementById(id)) { closeModal(id); }
}

function markAllRead() {
  document.querySelectorAll('.notif-item.unread').forEach(function(n) {
    n.classList.remove('unread');
    var dot = n.querySelector('.notif-dot-inline');
    if (dot) dot.remove();
  });
  var badge = document.getElementById('notif-badge');
  if (badge) badge.style.display = 'none';
  var topDot = document.querySelector('.notif-dot');
  if (topDot) topDot.style.display = 'none';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function(m) { m.classList.remove('open'); });
  }
});