// Adds a soft ripple to any clicked button/link with a ripple-enabled class.
// One document-level listener, so no component needs extra code.
const RIPPLE_TARGETS = '.btn, .chip, .quick-action, .nav a, .qty button, .btn-remove';

export function enableRipples() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest(RIPPLE_TARGETS);
    if (!target || target.disabled) return;

    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}
