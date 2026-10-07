import { centsToPeso } from './format';

export const MESSAGES = {
  emptyCart: 'Your cart is empty. Add at least one product first.',
  invalidAmount: 'Please enter a valid payment amount.',
  insufficient: (totalCents) => `Insufficient payment. Please enter at least ${centsToPeso(totalCents)}.`,
};

// A valid amount is digits with an optional decimal point and at most 2 decimal places
// (e.g. "100", "75.5", "75.50"). Anything else, like "abc", "12x" or "1e3", fails this test.
// The optional leading "-" lets negative numbers pass this check so the negative check below catches them.
const AMOUNT_PATTERN = /^-?\d+(\.\d{1,2})?$/;

// Validates the payment in the required order and stops at the first problem.
// Returns { ok: true, amountCents } or { ok: false, error }.
export function validatePayment({ itemCount, input, totalCents }) {
  // 1. Empty cart: nothing to pay for, so block payment.
  if (itemCount === 0) {
    return { ok: false, error: MESSAGES.emptyCart };
  }

  const value = input.trim();

  // 2. Blank: the cashier did not type anything (spaces only also count as blank).
  if (value === '') {
    return { ok: false, error: MESSAGES.invalidAmount };
  }

  // 3. Non-numeric: the text is not a number ("abc", "12x").
  if (!AMOUNT_PATTERN.test(value)) {
    return { ok: false, error: MESSAGES.invalidAmount };
  }

  // Convert pesos to whole centavos ("75.50" → 7550) so all later math uses integers.
  const amountCents = Math.round(Number(value) * 100);

  // 4. Negative: money received can't be below zero ("-50").
  if (amountCents < 0) {
    return { ok: false, error: MESSAGES.invalidAmount };
  }

  // 5. Less than total: the customer has not paid enough.
  if (amountCents < totalCents) {
    return { ok: false, error: MESSAGES.insufficient(totalCents) };
  }

  return { ok: true, amountCents };
}
