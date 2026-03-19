const API = 'http://localhost:5000/api';

// ==================
// AUTH FUNCTIONS
// ==================

function showTab(tab) {
  document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1));
  });
}

async function register() {
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const msg = document.getElementById('auth-message');

  if (!name || !email || !password) {
    msg.textContent = 'Please fill in all fields!';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = data.message;
    }
  } catch (err) {
    msg.textContent = 'Something went wrong!';
  }
}

async function login() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const msg = document.getElementById('auth-message');

  if (!email || !password) {
    msg.textContent = 'Please fill in all fields!';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = 'dashboard.html';
    } else {
      msg.textContent = data.message;
    }
  } catch (err) {
    msg.textContent = 'Something went wrong!';
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ==================
// DASHBOARD FUNCTIONS
// ==================

async function loadDashboard() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('welcome-text').textContent = `👋 Hey, ${user.name}!`;
  await loadJobs();
}

async function loadJobs() {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${API}/jobs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const jobs = await res.json();

    updateStats(jobs);
    renderJobs(jobs);
  } catch (err) {
    console.error(err);
  }
}

function updateStats(jobs) {
  document.getElementById('total-count').textContent = jobs.length;
  document.getElementById('interview-count').textContent = jobs.filter(j => j.status === 'Interview').length;
  document.getElementById('offer-count').textContent = jobs.filter(j => j.status === 'Offer').length;
  document.getElementById('rejected-count').textContent = jobs.filter(j => j.status === 'Rejected').length;
}

function renderJobs(jobs) {
  const grid = document.getElementById('jobs-grid');

  if (jobs.length === 0) {
    grid.innerHTML = '<p style="color:#636e72;">No applications yet. Add your first one! 🚀</p>';
    return;
  }

  grid.innerHTML = jobs.map(job => `
    <div class="job-card">
      <h3>${job.company}</h3>
      <p>${job.role}</p>
      <span class="status-badge status-${job.status}">${job.status}</span>
      ${job.notes ? `<p style="font-size:0.85rem;">📝 ${job.notes}</p>` : ''}
      <p style="font-size:0.8rem; color:#b2bec3;">
        ${new Date(job.appliedDate).toLocaleDateString()}
      </p>
      <div class="card-actions">
        <button class="btn-status" onclick="updateStatus('${job._id}', '${job.status}')">
          Update Status
        </button>
        <button class="btn-delete" onclick="deleteJob('${job._id}')">
          Delete
        </button>
      </div>
    </div>
  `).join('');
}

async function addJob() {
  const token = localStorage.getItem('token');
  const company = document.getElementById('company').value;
  const role = document.getElementById('role').value;
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value;
  const jobDescription = document.getElementById('jobDescription').value;

  if (!company || !role) {
    alert('Company and Role are required!');
    return;
  }

  try {
    const res = await fetch(`${API}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ company, role, status, notes, jobDescription })
    });

    if (res.ok) {
      // Clear form
      document.getElementById('company').value = '';
      document.getElementById('role').value = '';
      document.getElementById('notes').value = '';
      document.getElementById('jobDescription').value = '';
      await loadJobs();
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteJob(id) {
  const token = localStorage.getItem('token');
  if (!confirm('Are you sure you want to delete this application?')) return;

  try {
    await fetch(`${API}/jobs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await loadJobs();
  } catch (err) {
    console.error(err);
  }
}

async function updateStatus(id, currentStatus) {
  const token = localStorage.getItem('token');
  const statuses = ['Applied', 'Interview', 'Offer', 'Rejected'];
  const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];

  try {
    await fetch(`${API}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status: nextStatus })
    });
    await loadJobs();
  } catch (err) {
    console.error(err);
  }
}

async function getAIAdvice() {
  const token = localStorage.getItem('token');
  const role = document.getElementById('role').value;
  const jobDescription = document.getElementById('jobDescription').value;

  if (!jobDescription || !role) {
    alert('Please enter Role and Job Description first!');
    return;
  }

  const adviceBox = document.getElementById('ai-advice-box');
  const adviceText = document.getElementById('ai-advice-text');

  adviceBox.style.display = 'block';
  adviceText.textContent = '🤖 Analyzing job description...';

  try {
    const res = await fetch(`${API}/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ role, jobDescription })
    });
    const data = await res.json();
    adviceText.textContent = data.advice;
  } catch (err) {
    adviceText.textContent = 'Something went wrong. Try again!';
  }
}

// ==================
// INIT
// ==================

// Run loadDashboard only on dashboard page
if (window.location.pathname.includes('dashboard')) {
  loadDashboard();
}