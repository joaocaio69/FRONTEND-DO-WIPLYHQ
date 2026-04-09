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
  if (id === 'dashboard') loadDashboard();
  if (id === 'recurring') loadRecurring();
  if (id === 'revenue') loadRevenue();
  if (id === 'schedule') loadSchedule();
}
function loadDashboard() {
  loadJobs();
  fetch(API + '/api/revenue', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var weeklyEl = document.getElementById('dash-weekly');
    var jobsEl = document.getElementById('dash-jobs');
    var clientsEl = document.getElementById('dash-clients');
    var completedEl = document.getElementById('dash-completed');
    if (weeklyEl) weeklyEl.textContent = '$' + (data.weeklyRevenue || 0).toLocaleString();
    if (jobsEl) jobsEl.textContent = data.jobsThisWeek || 0;
    if (clientsEl) clientsEl.textContent = data.activeClients || 0;
    if (completedEl) completedEl.textContent = data.completedCleanings || 0;
    if (data.weeklyByDay) updateDashboardChart(data.weeklyByDay);
  })
  .catch(function() { console.log('Erro ao carregar dashboard'); });
}
function updateDashboardChart(weeklyByDay) {
  var max = Math.max.apply(null, weeklyByDay.concat([1]));
  var bars = document.querySelectorAll('#page-dashboard .bar-item');
  bars.forEach(function(bar, i) {
    var body = bar.querySelector('.bar-body');
    if (body) body.style.height = Math.round((weeklyByDay[i] / max) * 90) + '%';
  });
}
function loadClients() {
  fetch(API + '/api/clients', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(clients) {
    var grid = document.getElementById('clientsGrid');
    grid.innerHTML = '';
    if (!clients.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:48px 0;">No clients yet. Add your first client!</div>';
      return;
    }
    clients.forEach(function(client) {
      grid.innerHTML += '<div class="client-card">'
        + '<div class="client-name">' + client.name + '</div>'
        + '<div class="client-detail">' + client.phone + '</div>'
        + '<div class="client-detail">' + client.address + '</div>'
        + (client.notes ? '<div class="client-detail">' + client.notes + '</div>' : '')
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
  if (!name || !phone || !address) return alert('Fill in name, phone and address');
  fetch(API + '/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name: name, phone: phone, address: address, notes: notes })
  })
  .then(function(res) { return res.json(); })
  .then(function() {
    closeModal('modal-client');
    document.getElementById('client-name').value = '';
    document.getElementById('client-phone').value = '';
    document.getElementById('client-address').value = '';
    document.getElementById('client-notes').value = '';
    loadClients();
  })
  .catch(function() { alert('Error saving client'); });
}
function loadCleaners() {
  fetch(API + '/api/cleaners', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(cleaners) {
    var grid = document.querySelector('.cleaners-grid');
    grid.innerHTML = '';
    if (!cleaners.length) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:#94a3b8;padding:48px 0;">No cleaners yet. Add your first cleaner!</div>';
      return;
    }
    cleaners.forEach(function(cleaner) {
      grid.innerHTML += '<div class="cleaner-card">'
        + '<div class="cleaner-name">' + cleaner.name + '</div>'
        + '<div class="cleaner-phone">' + cleaner.phone + '</div>'
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
  if (!name || !phone || !email) return alert('Fill in all fields');
  fetch(API + '/api/cleaners', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ name: name, phone: phone, email: email })
  })
  .then(function(res) { return res.json(); })
  .then(function() {
    closeModal('modal-cleaner');
    document.getElementById('cleaner-name').value = '';
    document.getElementById('cleaner-phone').value = '';
    document.getElementById('cleaner-email').value = '';
    loadCleaners();
  })
  .catch(function() { alert('Error saving cleaner'); });
}
function loadJobs() {
  fetch(API + '/api/jobs', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(jobs) {
    var jobsCard = document.querySelector('.jobs-card');
    if (!jobsCard) return;
    jobsCard.innerHTML = '<div class="card-title">Today\'s Jobs</div>';
    var today = new Date().toDateString();
    var todayJobs = jobs.filter(function(j) {
      return new Date(j.scheduledAt).toDateString() === today;
    });
    if (!todayJobs.length) {
      jobsCard.innerHTML += '<div style="text-align:center;color:#94a3b8;padding:32px 0;font-size:14px;">No jobs scheduled for today</div>';
      return;
    }
    todayJobs.forEach(function(job) {
      var date = new Date(job.scheduledAt);
      var time = date.getHours().toString().padStart(2,'0') + ':' + date.getMinutes().toString().padStart(2,'0');
      var statusClass = job.status === 'in-progress' ? 'badge-inprogress' : job.status === 'completed' ? 'badge-completed' : 'badge-scheduled';
      jobsCard.innerHTML += '<div class="job-item">'
        + '<div class="job-info"><div class="job-name">' + job.client.name + '</div>'
        + '<div class="job-meta">' + time + ' - ' + job.cleaner.name + '</div></div>'
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
    select.innerHTML = '<option value="">Select client...</option>';
    clients.forEach(function(c) { select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>'; });
  });
  fetch(API + '/api/cleaners', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(cleaners) {
    var select = document.getElementById('job-cleaner');
    select.innerHTML = '<option value="">Select cleaner...</option>';
    cleaners.forEach(function(c) { select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>'; });
  });
}
function saveJob() {
  var clientId = document.getElementById('job-client').value;
  var cleanerId = document.getElementById('job-cleaner').value;
  var scheduledAt = document.getElementById('job-date').value;
  var price = document.getElementById('job-price').value;
  if (!clientId || !cleanerId || !scheduledAt || !price) return alert('Fill in all fields');
  fetch(API + '/api/jobs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ clientId: clientId, cleanerId: cleanerId, scheduledAt: scheduledAt, price: parseFloat(price) })
  })
  .then(function(res) { return res.json(); })
  .then(function() {
    closeModal('modal-job');
    document.getElementById('job-price').value = '';
    loadJobs();
    loadSchedule();
  })
  .catch(function() { alert('Error saving job'); });
}
function loadSchedule() {
  fetch(API + '/api/jobs', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(jobs) {
    document.querySelectorAll('.day-body').forEach(function(d) { d.innerHTML = ''; });
    var today = new Date();
    var dayOfWeek = today.getDay();
    var monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    var dayCols = document.querySelectorAll('.day-col');
    dayCols.forEach(function(col, i) {
      var d = new Date(monday);
      d.setDate(monday.getDate() + i);
      var numEl = col.querySelector('.day-num');
      if (numEl) {
        numEl.textContent = d.getDate();
        numEl.classList.toggle('today', d.toDateString() === today.toDateString());
      }
    });
    jobs.forEach(function(job) {
      var jobDate = new Date(job.scheduledAt);
      var diff = Math.floor((jobDate - monday) / (1000*60*60*24));
      if (diff < 0 || diff > 6) return;
      var dayBody = dayCols[diff] && dayCols[diff].querySelector('.day-body');
      if (!dayBody) return;
      var time = jobDate.getHours().toString().padStart(2,'0') + ':' + jobDate.getMinutes().toString().padStart(2,'0');
      var statusClass = job.status === 'completed' ? 'badge-completed' : job.status === 'in-progress' ? 'badge-inprogress' : 'badge-scheduled';
      dayBody.innerHTML += '<div class="schedule-job-item">'
        + '<div class="job-name" style="font-size:12px;font-weight:600;">' + job.client.name + '</div>'
        + '<div style="font-size:11px;color:#64748b;">' + time + ' - ' + job.cleaner.name + '</div>'
        + '<span class="badge ' + statusClass + '" style="font-size:10px;margin-top:4px;">' + job.status + '</span>'
        + '</div>';
    });
  })
  .catch(function() { console.log('Erro ao carregar schedule'); });
}
function loadRecurring() {
  fetch(API + '/api/recurring', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(recurring) {
    var list = document.querySelector('.recurring-list');
    list.innerHTML = '';
    if (!recurring.length) {
      list.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:48px 0;">No recurring services yet. Add your first!</div>';
      return;
    }
    recurring.forEach(function(r) {
      var date = new Date(r.nextDate).toISOString().split('T')[0];
      var freqClass = r.frequency === 'weekly' ? 'badge-weekly' : r.frequency === 'biweekly' ? 'badge-biweekly' : 'badge-monthly';
      list.innerHTML += '<div class="recurring-card">'
        + '<div class="recurring-left"><div class="recurring-name-row"><span class="recurring-name">' + r.client.name + '</span>'
        + '<span class="badge ' + freqClass + '">' + r.frequency + '</span></div>'
        + '<div class="recurring-meta">$' + r.price + ' - ' + r.client.address + '</div></div>'
        + '<div class="recurring-right"><div class="recurring-next-label">Next Cleaning</div>'
        + '<div class="recurring-next-date">' + date + '</div></div></div>';
    });
  })
  .catch(function() { console.log('Erro ao carregar recorrentes'); });
}
function loadRecurringSelects() {
  fetch(API + '/api/clients', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(clients) {
    var select = document.getElementById('recurring-client');
    select.innerHTML = '<option value="">Select client...</option>';
    clients.forEach(function(c) { select.innerHTML += '<option value="' + c.id + '">' + c.name + '</option>'; });
  });
}
function saveRecurring() {
  var clientId = document.getElementById('recurring-client').value;
  var frequency = document.getElementById('recurring-frequency').value;
  var price = document.getElementById('recurring-price').value;
  var nextDate = document.getElementById('recurring-date').value;
  if (!clientId || !frequency || !price || !nextDate) return alert('Fill in all fields');
  fetch(API + '/api/recurring', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
    body: JSON.stringify({ clientId: clientId, frequency: frequency, price: parseFloat(price), nextDate: nextDate })
  })
  .then(function(res) { return res.json(); })
  .then(function() {
    closeModal('modal-recurring');
    document.getElementById('recurring-price').value = '';
    loadRecurring();
  })
  .catch(function() { alert('Error saving recurring service'); });
}
function loadRevenue() {
  fetch(API + '/api/revenue', { headers: { 'Authorization': 'Bearer ' + token } })
  .then(function(res) { return res.json(); })
  .then(function(data) {
    var totalEl = document.getElementById('rev-total');
    var weeklyEl = document.getElementById('rev-weekly');
    var completedEl = document.getElementById('rev-completed');
    var avgEl = document.getElementById('rev-avg');
    if (totalEl) totalEl.textContent = '$' + (data.totalRevenue || 0).toLocaleString();
    if (weeklyEl) weeklyEl.textContent = '$' + (data.weeklyRevenue || 0).toLocaleString();
    if (completedEl) completedEl.textContent = data.completedCleanings || 0;
    if (avgEl) avgEl.textContent = '$' + (data.averageJobValue || 0).toLocaleString();
    if (data.weeklyByDay) updateRevenueChart(data.weeklyByDay);
  })
  .catch(function() { console.log('Erro ao carregar revenue'); });
}
function updateRevenueChart(weeklyByDay) {
  var max = Math.max.apply(null, weeklyByDay.concat([1]));
  var bars = document.querySelectorAll('#page-revenue .bar-item');
  bars.forEach(function(bar, i) {
    var body = bar.querySelector('.bar-body');
    if (body) body.style.height = Math.round((weeklyByDay[i] / max) * 90) + '%';
  });
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
loadDashboard();