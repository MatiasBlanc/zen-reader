// Theme Management
type Theme = 'paper' | 'sepia' | 'dark';

function getInitialTheme(): Theme {
  const saved = localStorage.getItem('zen_landing_theme') as Theme | null;
  if (saved && (saved === 'paper' || saved === 'sepia' || saved === 'dark')) {
    return saved;
  }
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'paper';
}

function setTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.remove('sepia', 'dark');
  if (theme === 'dark') html.classList.add('dark');
  if (theme === 'sepia') html.classList.add('sepia');
  localStorage.setItem('zen_landing_theme', theme);

  // Update theme buttons
  document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(btn => {
    const isCurrent = btn.dataset.themeBtn === theme;
    btn.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    if (isCurrent) {
      btn.classList.add('ring-2', 'ring-offset-1');
    } else {
      btn.classList.remove('ring-2', 'ring-offset-1');
    }
  });
}

// Global Reading Progress Indicator
function setupReadingProgress() {
  const progressBar = document.getElementById('global-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${Math.min(100, Math.max(0, scrolled))}%`;
  }, { passive: true });
}

// Interactive Zen Simulator
function setupZenSimulator() {
  const simContainer = document.getElementById('zen-simulator');
  const btnToggleChaos = document.getElementById('sim-btn-chaos');
  const btnToggleZen = document.getElementById('sim-btn-zen');
  const viewChaos = document.getElementById('sim-view-chaos');
  const viewZen = document.getElementById('sim-view-zen');
  const actionCleanWeb = document.getElementById('sim-action-clean');
  const fontSizeDisplay = document.getElementById('sim-font-size');
  const btnFontIncrease = document.getElementById('sim-font-plus');
  const btnFontDecrease = document.getElementById('sim-font-minus');
  const zenContent = document.getElementById('sim-zen-content');

  if (!simContainer || !viewChaos || !viewZen) return;

  let currentView: 'chaos' | 'zen' = 'chaos';
  let fontMultiplier = 1.0;

  function renderView(view: 'chaos' | 'zen') {
    currentView = view;
    if (view === 'zen') {
      viewChaos?.classList.add('hidden');
      viewZen?.classList.remove('hidden');
      btnToggleZen?.setAttribute('aria-selected', 'true');
      btnToggleChaos?.setAttribute('aria-selected', 'false');
      btnToggleZen?.classList.add('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleZen?.classList.remove('text-zen-muted');
      btnToggleChaos?.classList.remove('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleChaos?.classList.add('text-zen-muted');
    } else {
      viewChaos?.classList.remove('hidden');
      viewZen?.classList.add('hidden');
      btnToggleChaos?.setAttribute('aria-selected', 'true');
      btnToggleZen?.setAttribute('aria-selected', 'false');
      btnToggleChaos?.classList.add('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleChaos?.classList.remove('text-zen-muted');
      btnToggleZen?.classList.remove('bg-zen-surface', 'font-semibold', 'zen-shadow');
      btnToggleZen?.classList.add('text-zen-muted');
    }
  }

  btnToggleChaos?.addEventListener('click', () => renderView('chaos'));
  btnToggleZen?.addEventListener('click', () => renderView('zen'));
  actionCleanWeb?.addEventListener('click', () => renderView('zen'));

  btnFontIncrease?.addEventListener('click', () => {
    if (fontMultiplier < 1.4) {
      fontMultiplier += 0.1;
      if (zenContent) zenContent.style.fontSize = `${fontMultiplier * 1.05}rem`;
      if (fontSizeDisplay) fontSizeDisplay.textContent = `${Math.round(fontMultiplier * 100)}%`;
    }
  });

  btnFontDecrease?.addEventListener('click', () => {
    if (fontMultiplier > 0.8) {
      fontMultiplier -= 0.1;
      if (zenContent) zenContent.style.fontSize = `${fontMultiplier * 1.05}rem`;
      if (fontSizeDisplay) fontSizeDisplay.textContent = `${Math.round(fontMultiplier * 100)}%`;
    }
  });
}

// Copy to Clipboard Utility
function setupCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<svg class="w-4 h-4 text-emerald-600 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> ¡Copiado!`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });
}

// FAQ Accordion
function setupFaq() {
  const items = document.querySelectorAll<HTMLDetailsElement>('.faq-item');
  items.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        // Optional: close other items for single-open accordion
        items.forEach(other => {
          if (other !== item && other.open) {
            other.open = false;
          }
        });
      }
    });
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = getInitialTheme();
  setTheme(currentTheme);

  document.querySelectorAll<HTMLButtonElement>('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.themeBtn as Theme;
      if (theme) setTheme(theme);
    });
  });

  setupReadingProgress();
  setupZenSimulator();
  setupCopyButtons();
  setupFaq();
});
