// ============================================================
// KaliArena — Auth helpers  |  ORGANIZER PORTAL
// ============================================================
const PORTAL_ROLE = 'organizer';
const DASHBOARD   = 'dashboard.html';
const LOGIN_PAGE  = 'index.html';

async function requireRole() {
  if (!window.db) return null;
  const { data: { session } } = await window.db.auth.getSession();
  if (!session) { window.location.href = LOGIN_PAGE; return null; }

  const { data: profile, error } = await window.db
    .from('profiles')
    .select('id, first_name, last_name, email, roles, role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) { await window.db.auth.signOut(); window.location.href = LOGIN_PAGE; return null; }

  const roles = profile.roles?.length ? profile.roles : [profile.role].filter(Boolean);
  if (!roles.includes('organizer')) {
    await window.db.auth.signOut();
    window.location.href = LOGIN_PAGE;
    return null;
  }
  return { session, profile, roles };
}

async function signIn(email, password) {
  const { data, error } = await window.db.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const { data: profile } = await window.db
    .from('profiles').select('roles, role').eq('id', data.user.id).single();
  const roles = profile?.roles?.length ? profile.roles : [profile?.role].filter(Boolean);
  if (!roles.includes('organizer')) {
    await window.db.auth.signOut();
    return { error: `You don't have organizer access. Contact an Admin to grant you access.` };
  }
  return { data, error: null };
}

async function signOut() {
  await window.db.auth.signOut();
  window.location.href = LOGIN_PAGE;
}

async function redirectIfLoggedIn() {
  if (!window.db) return;
  const { data: { session } } = await window.db.auth.getSession();
  if (!session) return;
  const { data: profile } = await window.db
    .from('profiles').select('roles, role').eq('id', session.user.id).single();
  const roles = profile?.roles?.length ? profile.roles : [profile?.role].filter(Boolean);
  if (roles.includes('organizer')) window.location.href = DASHBOARD;
}

// No token required — account created as a plain user.
// An Admin must then assign the organizer role via superadmin-portal/super-admin.html
async function signUp(email, password, firstName, lastName) {
  const { data, error } = await window.db.auth.signUp({
    email, password,
    options: {
      emailRedirectTo: window.location.origin + '/dashboard.html',
      data: { first_name: firstName, last_name: lastName },
    },
  });
  if (error) return { error: error.message };
  return { data, error: null };
}
