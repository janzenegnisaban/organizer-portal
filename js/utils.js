// ============================================================
// KaliArena Portal — Shared Utilities
// ============================================================

/* ── Toast Notifications ── */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

/* ── Date Helpers ── */
function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' });
}
function formatDateTime(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-PH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

/* ── String Helpers ── */
function getInitials(name) {
  if (!name) return '?';
  return name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function capitalize(s) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function slugify(s) {
  return (s || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

/* ── Number Helpers ── */
function pct(wins, total) {
  if (!total) return 0;
  return Math.round((wins / total) * 100);
}

/* ── Loading State ── */
function showLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.classList.remove('hidden');
}
function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.classList.add('hidden');
}
function showApp() {
  const shell = document.getElementById('app-shell');
  if (shell) shell.classList.remove('hidden');
  hideLoading();
}

/* ── Header population ── */
function setHeaderUser(profile) {
  const name = profile.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : profile.email?.split('@')[0] || 'User';
  const nameEl = document.getElementById('header-user-name');
  const avatarEl = document.getElementById('header-avatar');
  if (nameEl) nameEl.textContent = name;
  if (avatarEl) avatarEl.textContent = getInitials(name);
}

/* ── Active nav link ── */
function setActiveNav(page) {
  document.querySelectorAll('.sidebar-nav-link[data-page], .mobile-nav-item[data-page]').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}

/* ── Lucide icon replacement (call after DOM renders) ── */
function refreshIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ── Simple debounce ── */
function debounce(fn, ms = 300) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ── Render helpers ── */
function escHtml(s) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(s || ''));
  return d.innerHTML;
}

function setInnerHTML(id, html) {
  const el = document.getElementById(id);
  if (el) { el.innerHTML = html; refreshIcons(); }
}

/* ── Dialog helpers ── */
function openDialog(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('hidden');
}
function closeDialog(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('hidden');
}

/* ── Confirm ── */
function confirmAction(message) {
  return window.confirm(message);
}

/* ── Sign-out confirmation modal ── */
function showSignOutModal() {
  if (!document.getElementById('signout-modal')) {
    const el = document.createElement('div');
    el.id = 'signout-modal';
    el.className = 'dialog-overlay hidden';
    el.innerHTML = `
      <div class="dialog" style="max-width:22rem;text-align:center;">
        <div style="display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;border-radius:9999px;background:#fef2f2;margin:0 auto 1rem;">
          <i data-lucide="log-out" style="width:1.25rem;height:1.25rem;color:#dc2626;"></i>
        </div>
        <div class="dialog-title" style="text-align:center;">Sign out?</div>
        <div class="dialog-description" style="text-align:center;">You will be returned to the login page.</div>
        <div class="dialog-footer" style="justify-content:center;">
          <button class="btn btn-secondary" onclick="closeDialog('signout-modal')">Cancel</button>
          <button class="btn btn-destructive" onclick="signOut()">Sign out</button>
        </div>
      </div>`;
    document.body.appendChild(el);
    refreshIcons();
  }
  openDialog('signout-modal');
}

/* ── Status badge HTML ── */
function statusBadge(status) {
  const map = {
    upcoming:  { cls: 'badge-blue',    label: 'Upcoming' },
    ongoing:   { cls: 'badge-emerald', label: 'Ongoing' },
    completed: { cls: 'badge-gray',    label: 'Completed' },
    pending:   { cls: 'badge-amber',   label: 'Pending' },
    approved:  { cls: 'badge-emerald', label: 'Approved' },
    rejected:  { cls: 'badge-red',     label: 'Rejected' },
    registered:{ cls: 'badge-primary', label: 'Registered' },
    coach:     { cls: 'badge-primary', label: 'Coach' },
    admin:     { cls: 'badge-red',     label: 'Admin' },
    'super-admin':{ cls: 'badge-amber', label: 'Super Admin' },
    organizer: { cls: 'badge-emerald', label: 'Organizer' },
  };
  const b = map[status] || { cls: 'badge-gray', label: capitalize(status || 'Unknown') };
  return `<span class="badge ${b.cls}">${b.label}</span>`;
}
