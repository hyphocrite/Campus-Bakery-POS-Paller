const pesoFormat = { minimumFractionDigits: 2, maximumFractionDigits: 2 };

// Format a peso amount as ₱0.00
export const peso = (amount) => `₱${Number(amount).toLocaleString('en-PH', pesoFormat)}`;

// Format an amount stored in centavos as ₱0.00 (2550 → ₱25.50). Division only happens for display.
export const centsToPeso = (cents) => peso(cents / 100);

// SQLite returns "YYYY-MM-DD HH:MM:SS" in local time.
export const formatDateTime = (sqliteDate) =>
  new Date(sqliteDate.replace(' ', 'T')).toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
