// Initialize Supabase client — requires config.js + Supabase CDN loaded first
(function () {
  if (typeof supabase === 'undefined') {
    console.error('[KaliArena] Supabase SDK not loaded. Check your CDN script tag.');
    return;
  }
  if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_PROJECT')) {
    document.body.innerHTML =
      '<div style="font-family:sans-serif;padding:2rem;color:#b91c1c">' +
      '<h2>⚠️ Supabase not configured</h2>' +
      '<p>Edit <strong>js/config.js</strong> and fill in your SUPABASE_URL and SUPABASE_ANON_KEY.</p>' +
      '</div>';
    return;
  }
  window.db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
})();
