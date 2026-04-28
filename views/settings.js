import { getSetting, putSetting, exportAllData, importAllData, resetAllData } from '../utils/db.js';
import { STATE_DATA } from '../data/state-data.js';
import { checkForUpdates, updateAppliedThisSession, lastReleaseNotes } from '../utils/updater.js';
import { getBundledVersions } from '../utils/storage.js';
import { MANIFEST } from '../data/content-manifest.js';

export async function render(el) {
  const settings = (await getSetting('setup')) ?? {};
  const theme = (await getSetting('theme')) ?? 'system';
  const versions = getBundledVersions();

  el.innerHTML = `
    <div style="padding:16px 0 60px;">
      <h1 style="font-family:var(--font-display);font-size:22px;margin-bottom:4px;">Settings</h1>
      <p style="color:var(--color-text-secondary);font-size:14px;margin-bottom:20px;">Customize your study experience</p>

      <!-- Location -->
      <div class="settings-section">
        <div class="settings-section-title">Location</div>
        <div class="settings-row">
          <div class="settings-row-label">
            <div class="settings-row-name">State or Territory</div>
            <div class="settings-row-desc">Personalizes senator and governor questions</div>
          </div>
          <select id="state-select" class="settings-select" aria-label="Select your state or territory">
            <option value="">Select state…</option>
            ${buildStateOptions(settings.state ?? '')}
          </select>
        </div>
        <div id="officials-note" style="display:none;padding:8px 16px 12px;font-size:12px;color:var(--color-text-secondary);"></div>
      </div>

      <!-- Study preferences -->
      <div class="settings-section">
        <div class="settings-section-title">Study Preferences</div>

        <div class="settings-row">
          <div class="settings-row-label">
            <div class="settings-row-name">65/20 Exemption Mode</div>
            <div class="settings-row-desc">For applicants 65+ who have been a permanent resident ≥ 20 years — focuses on 20 starred questions only</div>
          </div>
          <label class="toggle" aria-label="Toggle 65/20 exemption mode">
            <input type="checkbox" id="exemption-toggle" ${settings.exemption65_20 ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div class="settings-row">
          <div class="settings-row-label">
            <div class="settings-row-name">Daily Goal</div>
            <div class="settings-row-desc">How many minutes per day you want to study</div>
          </div>
          <select id="goal-select" class="settings-select" aria-label="Select daily study goal">
            <option value="10" ${(settings.dailyGoalMinutes ?? 15) === 10 ? 'selected' : ''}>10 min/day</option>
            <option value="15" ${(settings.dailyGoalMinutes ?? 15) === 15 ? 'selected' : ''}>15 min/day</option>
            <option value="20" ${(settings.dailyGoalMinutes ?? 15) === 20 ? 'selected' : ''}>20 min/day</option>
            <option value="30" ${(settings.dailyGoalMinutes ?? 15) === 30 ? 'selected' : ''}>30 min/day</option>
          </select>
        </div>

        <div class="settings-row">
          <div class="settings-row-label">
            <div class="settings-row-name">Interview Date</div>
            <div class="settings-row-desc">Optional — enables pacing alerts on the dashboard</div>
          </div>
          <input type="date" id="interview-date" class="settings-input" value="${settings.interviewDate ?? ''}" aria-label="Interview date">
        </div>
      </div>

      <!-- Appearance -->
      <div class="settings-section">
        <div class="settings-section-title">Appearance</div>
        <div class="settings-row">
          <div class="settings-row-label">
            <div class="settings-row-name">Theme</div>
            <div class="settings-row-desc">Choose light, dark, or follow system setting</div>
          </div>
          <select id="theme-select" class="settings-select" aria-label="Select theme">
            <option value="system" ${theme === 'system' ? 'selected' : ''}>System default</option>
            <option value="light" ${theme === 'light' ? 'selected' : ''}>Light</option>
            <option value="dark" ${theme === 'dark' ? 'selected' : ''}>Dark</option>
          </select>
        </div>
      </div>

      <!-- Content updates -->
      <div class="settings-section">
        <div class="settings-section-title">Content Updates</div>
        <div class="settings-row" style="align-items:flex-start;flex-direction:column;gap:8px;">
          <div style="display:flex;width:100%;align-items:center;justify-content:space-between;">
            <div class="settings-row-label">
              <div class="settings-row-name">Questions version</div>
              <div class="settings-row-desc">${versions.questionsVersion}</div>
            </div>
            <div class="settings-row-label" style="text-align:right;">
              <div class="settings-row-name">Officials version</div>
              <div class="settings-row-desc">${versions.stateDataVersion}</div>
            </div>
          </div>
          <button class="btn btn-secondary" id="check-updates-btn" style="width:100%;">Check for Updates</button>
          <div id="update-status" style="font-size:12px;color:var(--color-text-secondary);text-align:center;width:100%;display:none;"></div>
        </div>
        ${lastReleaseNotes ? `
          <div style="padding:12px 16px;font-size:12px;color:var(--color-text-secondary);background:var(--color-surface-alt,var(--color-surface));border-top:1px solid var(--color-border);">
            <strong>Last update notes:</strong> ${lastReleaseNotes}
          </div>
        ` : ''}
      </div>

      <!-- Data management -->
      <div class="settings-section">
        <div class="settings-section-title">Data</div>

        <div class="settings-row" style="flex-direction:column;align-items:stretch;gap:10px;">
          <button class="btn btn-secondary" id="export-btn">Export My Data</button>
          <button class="btn btn-secondary" id="import-btn">Import Data</button>
          <input type="file" id="import-file" accept=".json" style="display:none;" aria-label="Import data file">
        </div>

        <div style="border-top:1px solid var(--color-border);margin:0 16px;"></div>

        <div class="settings-row" style="flex-direction:column;align-items:stretch;gap:8px;padding-top:8px;">
          <div style="font-size:13px;color:var(--color-text-secondary);padding:0 16px 4px;">
            Erases all progress, scores, and study history. Cannot be undone.
          </div>
          <div style="padding:0 16px;">
            <input type="text" id="reset-confirm" placeholder='Type RESET to confirm' class="settings-input" style="width:100%;margin-bottom:8px;" aria-label="Type RESET to confirm data reset">
            <button class="btn btn-error" id="reset-btn" disabled style="width:100%;">Reset All Data</button>
          </div>
        </div>
      </div>

      <!-- About -->
      <div class="settings-section">
        <div class="settings-section-title">About</div>
        <div style="padding:12px 16px;font-size:13px;line-height:1.6;color:var(--color-text-secondary);">
          <p style="margin:0 0 8px;"><strong style="color:var(--color-text);">CitizenReady</strong> — US Naturalization Test Prep</p>
          <p style="margin:0 0 8px;">Based on the official USCIS 128-question civics test (Form M-1778, 09/25).</p>
          <p style="margin:0 0 8px;">
            <a href="https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates" target="_blank" rel="noopener" style="color:var(--color-primary);">
              Verify current officials at uscis.gov →
            </a>
          </p>
          <p style="margin:0;font-size:11px;">This app is not affiliated with or endorsed by USCIS or the US government.</p>
        </div>
      </div>

    </div>
  `;

  // Show officials note when state is selected
  const stateSelect = el.querySelector('#state-select');
  const officialsNote = el.querySelector('#officials-note');

  function updateOfficialsNote(code) {
    if (!code || !STATE_DATA[code]) { officialsNote.style.display = 'none'; return; }
    const sd = STATE_DATA[code];
    const lines = [];
    if (sd.governor) lines.push(`Governor: ${sd.governor}`);
    if (sd.senators?.length) lines.push(`Senators: ${sd.senators.join(', ')}`);
    if (sd.dcNote) lines.push(sd.dcNote);
    if (sd.representativeNote) lines.push(sd.representativeNote);
    officialsNote.innerHTML = lines.map(l => `<div>${l}</div>`).join('') +
      `<div style="margin-top:4px;"><a href="https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates" target="_blank" rel="noopener" style="color:var(--color-primary);">Verify at uscis.gov</a> · Updated ${sd.officialsUpdated}</div>`;
    officialsNote.style.display = 'block';
  }

  updateOfficialsNote(settings.state ?? '');

  stateSelect.addEventListener('change', async () => {
    const newSettings = { ...(await getSetting('setup') ?? {}), state: stateSelect.value };
    await putSetting('setup', newSettings);
    updateOfficialsNote(stateSelect.value);
  });

  el.querySelector('#exemption-toggle').addEventListener('change', async e => {
    const newSettings = { ...(await getSetting('setup') ?? {}), exemption65_20: e.target.checked };
    await putSetting('setup', newSettings);
  });

  el.querySelector('#goal-select').addEventListener('change', async e => {
    const newSettings = { ...(await getSetting('setup') ?? {}), dailyGoalMinutes: Number(e.target.value) };
    await putSetting('setup', newSettings);
  });

  el.querySelector('#interview-date').addEventListener('change', async e => {
    const newSettings = { ...(await getSetting('setup') ?? {}), interviewDate: e.target.value || null };
    await putSetting('setup', newSettings);
  });

  el.querySelector('#theme-select').addEventListener('change', async e => {
    const val = e.target.value;
    await putSetting('theme', val);
    applyTheme(val);
  });

  // Updates
  el.querySelector('#check-updates-btn').addEventListener('click', async () => {
    const btn = el.querySelector('#check-updates-btn');
    const status = el.querySelector('#update-status');
    btn.disabled = true;
    btn.textContent = 'Checking…';
    status.style.display = 'block';
    status.textContent = 'Connecting to update server…';
    try {
      await checkForUpdates(true); // force = true
      if (updateAppliedThisSession) {
        status.textContent = '✓ Update applied! Reload the app to see new content.';
        status.style.color = 'var(--color-success)';
      } else {
        status.textContent = '✓ You\'re up to date.';
        status.style.color = 'var(--color-success)';
      }
    } catch {
      status.textContent = 'Could not reach update server. Check your connection.';
      status.style.color = 'var(--color-error)';
    }
    btn.disabled = false;
    btn.textContent = 'Check for Updates';
  });

  // Export
  el.querySelector('#export-btn').addEventListener('click', async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `citizenready-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Import
  const importBtn = el.querySelector('#import-btn');
  const importFile = el.querySelector('#import-file');
  importBtn.addEventListener('click', () => importFile.click());
  importFile.addEventListener('change', async () => {
    if (!importFile.files[0]) return;
    try {
      const text = await importFile.files[0].text();
      const data = JSON.parse(text);
      await importAllData(data);
      alert('Data imported successfully. The app will reload.');
      window.location.reload();
    } catch {
      alert('Import failed. Make sure the file is a valid CitizenReady backup.');
    }
  });

  // Reset
  const resetConfirm = el.querySelector('#reset-confirm');
  const resetBtn = el.querySelector('#reset-btn');
  resetConfirm.addEventListener('input', () => {
    resetBtn.disabled = resetConfirm.value !== 'RESET';
  });
  resetBtn.addEventListener('click', async () => {
    if (resetConfirm.value !== 'RESET') return;
    await resetAllData();
    window.location.hash = '#onboarding';
    window.location.reload();
  });
}

function buildStateOptions(selected) {
  const entries = Object.entries(STATE_DATA);
  return entries.map(([code, sd]) =>
    `<option value="${code}" ${code === selected ? 'selected' : ''}>${sd.name}</option>`
  ).join('');
}

function applyTheme(theme) {
  document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-system');
  document.documentElement.classList.add(`theme-${theme}`);
}
