// Pure cart logic. Every function takes the current items and returns a new array;
// CartContext passes the result through recalculateCart() so totals are never stale.

// The single place where subtotals and the total are computed.
// Called after every cart change (add, +, −, remove, clear).
export function recalculateCart(items) {
  const withSubtotals = items.map((item) => ({ ...item, subtotal: item.price * item.quantity }));
  return {
    items: withSubtotals,
    itemCount: withSubtotals.reduce((sum, item) => sum + item.quantity, 0),
    total: withSubtotals.reduce((sum, item) => sum + item.subtotal, 0),
  };
}

// Add to cart: if the product is already in the cart, bump its qty instead of adding a duplicate row.
export function addItem(items, product) {
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    return items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
  }
  return [...items, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 }];
}

export function increaseQty(items, id) {
  return items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
}

// Design decision: − stops at 1. Taking an item off the order is a deliberate action
// done with the Remove button, so extra taps on − can never delete a line by accident.
export function decreaseQty(items, id) {
  return items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item));
}

export function removeItem(items, id) {
  return items.filter((item) => item.id !== id);
}

// Change = Amount Paid − Total
export function computeChange(amountPaid, total) {
  return amountPaid - total;
}
