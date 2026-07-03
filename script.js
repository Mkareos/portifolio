// ── Nox background: night sky ───────────────────────────

function buildNoxBg() {
  const bg = document.getElementById('nox-bg');
  if (!bg || bg.dataset.built) return;
  bg.dataset.built = '1';

}

// ── Lumos / Nox dark mode ───────────────────────────────
const lumos = document.getElementById('lumos');
if (lumos) {
  if (localStorage.getItem('nox') === '1') {
    document.body.classList.add('nox');
    buildNoxBg();
  }
  lumos.addEventListener('click', () => {
    document.body.classList.toggle('nox');
    const isNox = document.body.classList.contains('nox');
    localStorage.setItem('nox', isNox ? '1' : '0');
    if (isNox) buildNoxBg();
  });
}

// ── Spell detection ─────────────────────────────────────
(function () {
  const PATRONUS_SVG = `
  <svg viewBox="0 0 220 230" xmlns="http://www.w3.org/2000/svg" style="filter:drop-shadow(0 0 18px rgba(150,210,255,0.95)) drop-shadow(0 0 40px rgba(100,180,255,0.7))">
    <g fill="rgba(210,235,255,0.92)" stroke="rgba(210,235,255,0.92)">
      <!-- body -->
      <ellipse cx="118" cy="148" rx="50" ry="30"/>
      <!-- neck -->
      <path d="M88 128 Q80 105 85 85 Q92 72 100 76 Q94 95 90 122Z"/>
      <!-- head -->
      <ellipse cx="95" cy="74" rx="16" ry="14"/>
      <!-- snout -->
      <path d="M83 76 Q76 80 78 86 Q84 88 90 84Z"/>
      <!-- antlers -->
      <path d="M90 62 L80 38 L68 20" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M80 38 L70 30" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M80 38 L73 42" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M100 60 L105 32 L114 12" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M105 32 L115 26" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M105 32 L112 36" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- legs -->
      <rect x="78"  y="172" width="7" height="36" rx="3"/>
      <rect x="95"  y="175" width="7" height="34" rx="3"/>
      <rect x="128" y="175" width="7" height="34" rx="3"/>
      <rect x="148" y="172" width="7" height="36" rx="3"/>
      <!-- tail -->
      <path d="M166 138 Q188 125 184 138 Q180 150 166 145Z"/>
      <!-- eye -->
      <circle cx="87" cy="70" r="3" fill="rgba(255,255,255,0.5)"/>
    </g>
  </svg>`;

  const SPELLS = ['lumos', 'expecto patronum'];
  let buffer = '';

  const flash = document.createElement('div');
  flash.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:9999;transition:opacity .08s ease';
  document.body.appendChild(flash);

  const patronusEl = document.createElement('div');
  patronusEl.style.cssText = `
    position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
    pointer-events:none;z-index:9998;opacity:0;
    transition:opacity .6s ease, transform .6s ease;transform:scale(.7)`;
  patronusEl.innerHTML = `<div style="width:260px;animation:patronus-drift 4s ease-in-out infinite alternate">${PATRONUS_SVG}</div>`;
  document.body.appendChild(patronusEl);

  const kf = document.createElement('style');
  kf.textContent = `
    @keyframes patronus-drift {
      from { transform: translateY(0px) rotate(-2deg); }
      to   { transform: translateY(-18px) rotate(2deg); }
    }`;
  document.head.appendChild(kf);

  function castLumos() {
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.transition = 'opacity .7s ease'; flash.style.opacity = '0'; }, 80);
    setTimeout(() => { flash.style.transition = 'opacity .08s ease'; }, 800);
  }

  function castPatronus() {
    patronusEl.style.opacity = '1';
    patronusEl.style.transform = 'scale(1)';
    setTimeout(() => {
      patronusEl.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      patronusEl.style.opacity = '0';
      patronusEl.style.transform = 'scale(1.15)';
    }, 3200);
    setTimeout(() => {
      patronusEl.style.transition = 'opacity .6s ease, transform .6s ease';
      patronusEl.style.transform = 'scale(.7)';
    }, 4500);
  }

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    buffer = (buffer + e.key).toLowerCase().slice(-20);
    if (buffer.endsWith('expecto patronum') || buffer.endsWith('patronum') || buffer.endsWith('patronus')) { buffer = ''; castPatronus(); }
    else if (buffer.endsWith('lumos'))        { buffer = ''; castLumos(); }
  });
})();

// Email obfuscation — assembled at click time, never in plain HTML
document.querySelectorAll('.email-obf').forEach(el => {
  const addr = el.dataset.u + '@' + el.dataset.d;
  el.querySelector('.email-display').textContent = addr;
  el.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = 'mailto:' + addr;
  });
});
