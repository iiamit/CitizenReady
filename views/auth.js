import { isCloudEnabled, signIn, signUp, getCurrentUser, signOut, pushToCloud, pullFromCloud } from '../utils/sync.js';

export async function render(el) {
  if (!isCloudEnabled()) {
    el.innerHTML = `
      <div style="padding:24px;text-align:center;">
        <div style="font-size:36px;margin-bottom:12px;">☁️</div>
        <h2 style="font-family:var(--font-display);margin-bottom:8px;">Cloud Sync Not Configured</h2>
        <p style="color:var(--color-text-secondary);font-size:14px;line-height:1.6;">
          To enable cross-device sync, add your Supabase project URL and anon key to a
          <code>.env</code> file:<br><br>
          <code>VITE_SUPABASE_URL=https://xxx.supabase.co<br>
          VITE_SUPABASE_ANON_KEY=your_anon_key</code>
        </p>
      </div>
    `;
    return;
  }

  const user = await getCurrentUser();

  if (user) {
    renderSignedIn(el, user);
  } else {
    renderSignedOut(el);
  }
}

function renderSignedIn(el, user) {
  el.innerHTML = `
    <div style="padding:24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;">
        <div style="width:48px;height:48px;border-radius:50%;background:var(--color-primary);display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:700;flex-shrink:0;">
          ${user.email[0].toUpperCase()}
        </div>
        <div>
          <div style="font-weight:700;">${user.email}</div>
          <div style="font-size:12px;color:var(--color-text-secondary);">Signed in</div>
        </div>
      </div>
      <div id="sync-status" style="font-size:13px;color:var(--color-text-secondary);margin-bottom:16px;"></div>
      <button class="btn btn-secondary" style="width:100%;margin-bottom:10px;" id="sync-now-btn">
        ↑↓ Sync Now
      </button>
      <button class="btn btn-error" style="width:100%;" id="signout-btn">Sign Out</button>
    </div>
  `;

  const statusEl = el.querySelector('#sync-status');

  el.querySelector('#sync-now-btn').addEventListener('click', async () => {
    const btn = el.querySelector('#sync-now-btn');
    btn.disabled = true;
    btn.textContent = 'Syncing…';
    statusEl.textContent = '';
    try {
      await pushToCloud();
      await pullFromCloud();
      statusEl.textContent = `✓ Synced at ${new Date().toLocaleTimeString()}`;
      statusEl.style.color = 'var(--color-success)';
    } catch (e) {
      statusEl.textContent = 'Sync failed. Check your connection.';
      statusEl.style.color = 'var(--color-error)';
    }
    btn.disabled = false;
    btn.textContent = '↑↓ Sync Now';
  });

  el.querySelector('#signout-btn').addEventListener('click', async () => {
    await signOut();
    renderSignedOut(el);
  });
}

function renderSignedOut(el) {
  el.innerHTML = `
    <div style="padding:24px;">
      <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:16px;">
        Sign in to back up your progress and study on multiple devices.
      </p>

      <div style="display:flex;border-bottom:1px solid var(--color-border);margin-bottom:20px;">
        <button class="auth-tab active" data-tab="signin" style="flex:1;padding:10px;background:none;border:none;border-bottom:2px solid var(--color-primary);font-weight:600;color:var(--color-primary);cursor:pointer;font-size:14px;">Sign In</button>
        <button class="auth-tab" data-tab="signup" style="flex:1;padding:10px;background:none;border:none;border-bottom:2px solid transparent;font-weight:600;color:var(--color-text-secondary);cursor:pointer;font-size:14px;">Create Account</button>
      </div>

      <div id="auth-form">
        <div style="display:flex;flex-direction:column;gap:12px;">
          <input type="email" id="email-input" placeholder="Email address" class="settings-input" style="width:100%;" autocomplete="email">
          <input type="password" id="password-input" placeholder="Password" class="settings-input" style="width:100%;" autocomplete="current-password">
          <div id="auth-error" style="display:none;font-size:13px;color:var(--color-error);padding:8px 0;"></div>
          <button class="btn btn-primary" style="width:100%;" id="submit-btn">Sign In</button>
        </div>
      </div>
    </div>
  `;

  let currentTab = 'signin';

  el.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTab = tab.dataset.tab;
      el.querySelectorAll('.auth-tab').forEach(t => {
        const isActive = t.dataset.tab === currentTab;
        t.style.borderBottomColor = isActive ? 'var(--color-primary)' : 'transparent';
        t.style.color = isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)';
      });
      const submitBtn = el.querySelector('#submit-btn');
      submitBtn.textContent = currentTab === 'signin' ? 'Sign In' : 'Create Account';
      const pwInput = el.querySelector('#password-input');
      pwInput.autocomplete = currentTab === 'signin' ? 'current-password' : 'new-password';
      el.querySelector('#auth-error').style.display = 'none';
    });
  });

  el.querySelector('#submit-btn').addEventListener('click', async () => {
    const email = el.querySelector('#email-input').value.trim();
    const password = el.querySelector('#password-input').value;
    const errorEl = el.querySelector('#auth-error');
    const submitBtn = el.querySelector('#submit-btn');

    if (!email || !password) {
      errorEl.textContent = 'Please enter your email and password.';
      errorEl.style.display = 'block';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = currentTab === 'signin' ? 'Signing in…' : 'Creating account…';
    errorEl.style.display = 'none';

    try {
      if (currentTab === 'signin') {
        const { user } = await signIn(email, password);
        renderSignedIn(el, user);
      } else {
        await signUp(email, password);
        errorEl.style.color = 'var(--color-success)';
        errorEl.textContent = 'Account created! Check your email to confirm, then sign in.';
        errorEl.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    } catch (e) {
      errorEl.style.color = 'var(--color-error)';
      errorEl.textContent = e.message ?? 'An error occurred. Please try again.';
      errorEl.style.display = 'block';
      submitBtn.disabled = false;
      submitBtn.textContent = currentTab === 'signin' ? 'Sign In' : 'Create Account';
    }
  });
}
