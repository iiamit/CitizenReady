import { putSetting, getSetting } from '../utils/db.js';
import { getStateData } from '../utils/storage.js';
import { navigate } from '../app.js';

const STATES_TERRITORIES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ['DC','Washington, D.C.'],
  ['PR','Puerto Rico'],['GU','Guam'],['VI','U.S. Virgin Islands'],['AS','American Samoa'],['MP','Northern Mariana Islands'],
];

const DC_TERRITORIES = ['DC','PR','GU','VI','AS','MP'];

export async function render(root) {
  const existing = await getSetting('setup');

  root.innerHTML = '';
  const el = document.createElement('div');
  el.style.cssText = 'min-height:100vh;display:flex;flex-direction:column;';
  root.appendChild(el);

  // Show welcome screen first
  showWelcome(el);
}

function showWelcome(container) {
  container.innerHTML = `
    <div class="welcome-screen">
      <div class="welcome-flag" aria-hidden="true">🇺🇸</div>
      <div class="welcome-logo">CitizenReady</div>
      <div class="welcome-tagline">Learn. Drill. Pass.</div>
      <p style="max-width:320px;text-align:center;color:var(--color-text-secondary);font-size:15px;line-height:1.6;">
        Prepare for the US naturalization civics test with personalized lessons and spaced-repetition flashcards.
      </p>
      <button class="btn btn-primary btn-lg" id="get-started-btn" style="margin-top:16px;min-width:200px;">
        Get Started
      </button>
      <a href="#" id="sign-in-stub" style="font-size:14px;color:var(--color-text-secondary);margin-top:12px;" aria-label="Sign in (coming in a future version)">
        Already have an account? Sign in
      </a>
      <p style="font-size:11px;color:var(--color-text-secondary);margin-top:24px;max-width:280px;text-align:center;">
        No account needed. Your progress is saved on this device.
      </p>
    </div>
  `;
  container.querySelector('#get-started-btn').addEventListener('click', () => showStep1(container));
  container.querySelector('#sign-in-stub').addEventListener('click', e => {
    e.preventDefault();
    alert('Cloud sync is coming in a future version. Your progress is saved locally for now.');
  });
}

function showStep1(container) {
  container.innerHTML = `
    <div style="max-width:480px;margin:0 auto;padding:32px 16px;flex:1;">
      <div class="wizard-dots">
        <div class="wizard-dot active" aria-label="Step 1 of 2"></div>
        <div class="wizard-dot" aria-label="Step 2 of 2"></div>
      </div>
      <h1 style="font-family:var(--font-display);font-size:26px;margin-bottom:8px;">Where do you live?</h1>
      <p style="color:var(--color-text-secondary);margin-bottom:24px;font-size:15px;">
        We use this to personalize questions about your governor and US senators.
      </p>

      <label for="state-select" class="label" style="display:block;margin-bottom:6px;">State or Territory</label>
      <select id="state-select" aria-required="true">
        <option value="">— Select your state or territory —</option>
        ${STATES_TERRITORIES.map(([code,name]) => `<option value="${code}">${name}</option>`).join('')}
      </select>
      <p style="font-size:13px;color:var(--color-text-secondary);margin-top:8px;">
        Some test questions have answers that depend on where you live, such as your governor's name and your US senators.
      </p>

      <div id="territory-note" style="display:none;margin-top:16px;padding:12px;background:#EEF3F8;border-radius:8px;font-size:14px;color:var(--color-text);">
      </div>

      <div style="margin-top:24px;">
        <label style="display:flex;align-items:center;gap:12px;cursor:pointer;">
          <label class="toggle" aria-label="65/20 exemption toggle">
            <input type="checkbox" id="exemption-toggle">
            <span class="toggle-slider"></span>
          </label>
          <span style="font-size:15px;font-weight:600;">Are you 65 or older and have been a permanent resident for 20+ years?</span>
        </label>
        <p id="exemption-note" style="display:none;font-size:13px;color:var(--color-text-secondary);margin-top:8px;margin-left:60px;">
          65/20 mode enabled. The officer will ask 10 questions from a shorter starred list. You must answer 6 correctly.
        </p>
      </div>

      <button class="btn btn-primary btn-full" id="next-btn" style="margin-top:32px;" disabled>
        Next →
      </button>
    </div>
  `;

  const sel = container.querySelector('#state-select');
  const nextBtn = container.querySelector('#next-btn');
  const territoryNote = container.querySelector('#territory-note');
  const exemptionToggle = container.querySelector('#exemption-toggle');
  const exemptionNote = container.querySelector('#exemption-note');

  sel.addEventListener('change', () => {
    const code = sel.value;
    nextBtn.disabled = !code;
    if (DC_TERRITORIES.includes(code)) {
      const info = getDCTerritoryNote(code);
      territoryNote.innerHTML = info;
      territoryNote.style.display = 'block';
    } else {
      territoryNote.style.display = 'none';
    }
  });

  exemptionToggle.addEventListener('change', () => {
    exemptionNote.style.display = exemptionToggle.checked ? 'block' : 'none';
  });

  nextBtn.addEventListener('click', () => {
    showStep2(container, sel.value, exemptionToggle.checked);
  });
}

function getDCTerritoryNote(code) {
  const notes = {
    DC: 'D.C. is not a state. It does not have a Governor. D.C. residents do not have voting US Senators in Congress. For this question on the civics test, the correct answer reflects D.C.\'s unique status.',
    PR: 'Puerto Rico is a US territory. It has a Governor but no voting US Senators. Puerto Rico residents may have different civics test answers.',
    GU: 'Guam is a US territory. It has a Governor but no voting US Senators.',
    VI: 'The US Virgin Islands is a US territory with a Governor but no voting US Senators.',
    AS: 'American Samoa is a US territory with a Governor but no voting US Senators.',
    MP: 'The Northern Mariana Islands is a US territory with a Governor but no voting US Senators.',
  };
  return `<strong>Note:</strong> ${notes[code] || ''}`;
}

function showStep2(container, stateCode, exemption) {
  container.innerHTML = `
    <div style="max-width:480px;margin:0 auto;padding:32px 16px;flex:1;">
      <div class="wizard-dots">
        <div class="wizard-dot" aria-label="Step 1 of 2"></div>
        <div class="wizard-dot active" aria-label="Step 2 of 2"></div>
      </div>
      <h1 style="font-family:var(--font-display);font-size:26px;margin-bottom:8px;">Set your daily study goal</h1>
      <p style="color:var(--color-text-secondary);margin-bottom:24px;font-size:15px;">
        How much time can you study each day?
      </p>

      <div id="goal-options" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
        ${[10,15,20,30].map(m => `
          <button class="goal-opt btn btn-ghost" data-min="${m}" style="flex:1;min-width:60px;">
            ${m} min
          </button>
        `).join('')}
      </div>
      <p id="goal-breakdown" style="font-size:14px;color:var(--color-text-secondary);text-align:center;margin-bottom:24px;">
        ~8 min learning + ~7 min flashcards
      </p>

      <label for="interview-date" class="label" style="display:block;margin-bottom:6px;">
        Interview date <span style="font-weight:400;text-transform:none;letter-spacing:0;">(optional)</span>
      </label>
      <input type="date" id="interview-date" style="margin-bottom:8px;">
      <p style="font-size:13px;color:var(--color-text-secondary);margin-bottom:24px;">
        If set, we'll show a countdown and adjust your pacing to cover everything in time.
      </p>

      <button class="btn btn-primary btn-full" id="finish-btn">
        Let's go →
      </button>
    </div>
  `;

  let selectedMin = 15;
  const breakdown = {10:'~5 min learning + ~5 min flashcards', 15:'~8 min learning + ~7 min flashcards', 20:'~11 min learning + ~9 min flashcards', 30:'~17 min learning + ~13 min flashcards'};

  function updateGoalUI() {
    container.querySelectorAll('.goal-opt').forEach(btn => {
      const active = parseInt(btn.dataset.min) === selectedMin;
      btn.className = 'goal-opt btn ' + (active ? 'btn-secondary' : 'btn-ghost');
    });
    container.querySelector('#goal-breakdown').textContent = breakdown[selectedMin] || '';
  }
  updateGoalUI();

  container.querySelectorAll('.goal-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMin = parseInt(btn.dataset.min);
      updateGoalUI();
    });
  });

  container.querySelector('#finish-btn').addEventListener('click', async () => {
    const interviewDate = container.querySelector('#interview-date').value || null;
    await finishOnboarding(container, stateCode, exemption, selectedMin, interviewDate);
  });
}

async function finishOnboarding(container, stateCode, exemption, dailyGoal, interviewDate) {
  const sd = getStateData(stateCode);

  await putSetting('setup', {
    state: stateCode,
    exemption65_20: exemption,
    dailyGoalMinutes: dailyGoal,
    interviewDate,
    onboardingComplete: true,
    theme: 'system',
  });

  // Show confirmation card
  const isTerritory = DC_TERRITORIES.includes(stateCode);
  let officialsHtml = '';

  if (stateCode === 'DC') {
    officialsHtml = `<p>D.C. is not a state and does not have a Governor or voting US Senators.</p>`;
  } else if (['PR','GU','VI','AS','MP'].includes(stateCode)) {
    officialsHtml = sd?.governor
      ? `<p>Your governor is <strong>${sd.governor}</strong>. ${stateCode} does not have voting US Senators.</p>`
      : `<p>${sd?.name ?? stateCode} does not have voting US Senators.</p>`;
  } else if (sd) {
    const govLine = sd.governor ? `Your governor is <strong>${sd.governor}</strong>.` : '';
    const senLine = sd.senators?.length
      ? `Your senators are <strong>${sd.senators[0]}</strong> and <strong>${sd.senators[1]}</strong>.`
      : '';
    officialsHtml = `<p>${govLine} ${senLine}</p>`;
  }

  container.innerHTML = `
    <div style="max-width:480px;margin:0 auto;padding:32px 16px;">
      <div class="completion-card fade-in">
        <div class="completion-badge" aria-hidden="true">✅</div>
        <h2 class="completion-title">You're all set!</h2>
        <p style="color:var(--color-text-secondary);margin-bottom:16px;">Here's your study profile:</p>
        <div style="background:var(--color-neutral-100);border-radius:8px;padding:16px;text-align:left;font-size:15px;line-height:1.7;">
          <p>You are studying for the <strong>2025 USCIS civics test</strong>.</p>
          <p>You live in <strong>${sd?.name ?? stateCode}</strong>.</p>
          ${officialsHtml}
          ${exemption ? '<p>✨ <strong>65/20 exemption mode</strong> is on. You\'ll focus on the starred question set.</p>' : ''}
          <p>Daily goal: <strong>${dailyGoal} minutes</strong>.</p>
          ${interviewDate ? `<p>Interview date: <strong>${new Date(interviewDate + 'T12:00:00').toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})}</strong>.</p>` : ''}
        </div>
        <div class="verify-link" style="margin-top:12px;">
          Officials accurate as of ${sd?.officialsUpdated ?? '2025-04-27'}.
          <a href="https://www.uscis.gov/citizenship/find-study-materials-and-resources/check-for-test-updates" target="_blank" rel="noopener">Verify at uscis.gov</a>
        </div>
        <button class="btn btn-primary btn-full btn-lg" id="go-dashboard" style="margin-top:24px;">
          Start Studying →
        </button>
      </div>
    </div>
  `;

  container.querySelector('#go-dashboard').addEventListener('click', () => {
    window.location.hash = '#dashboard';
  });
}
