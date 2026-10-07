import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const formatCents = (cents) =>
  `₱${(cents / 100).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Transaction numbers are derived from the SQLite row id: id 1 → TXN-1001, id 2 → TXN-1002...
const txnNumber = (id) => `TXN-${1000 + id}`;

const findProduct = db.prepare('SELECT id, name, price_cents FROM products WHERE id = ?');
const insertTransaction = db.prepare(
  'INSERT INTO transactions (total_cents, amount_paid_cents, change_cents) VALUES (?, ?, ?)'
);
const insertItem = db.prepare(
  `INSERT INTO transaction_items
     (transaction_id, product_id, product_name, quantity, unit_price_cents, subtotal_cents)
   VALUES (?, ?, ?, ?, ?, ?)`
);
const selectTransaction = db.prepare('SELECT * FROM transactions WHERE id = ?');
const selectItems = db.prepare('SELECT * FROM transaction_items WHERE transaction_id = ? ORDER BY id');

function getTransaction(id) {
  const t = selectTransaction.get(id);
  return {
    id: t.id,
    txnNumber: txnNumber(t.id),
    createdAt: t.created_at,
    paymentMethod: t.payment_method,
    totalCents: t.total_cents,
    amountPaidCents: t.amount_paid_cents,
    changeCents: t.change_cents,
    items: selectItems.all(id).map((i) => ({
      productId: i.product_id,
      name: i.product_name,
      quantity: i.quantity,
      unitPriceCents: i.unit_price_cents,
      subtotalCents: i.subtotal_cents,
    })),
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Save a paid transaction. The client already validated, but the server checks again
// because it is the source of truth for prices and totals.
app.post('/api/transactions', (req, res) => {
  const { items, amountPaidCents } = req.body ?? {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty. Add at least one product first.' });
  }
  if (!Number.isInteger(amountPaidCents) || amountPaidCents < 0) {
    return res.status(400).json({ error: 'Please enter a valid payment amount.' });
  }

  const lines = [];
  for (const { productId, quantity } of items) {
    const product = findProduct.get(productId);
    if (!product || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'The cart contains an invalid item.' });
    }
    lines.push({ product, quantity, subtotalCents: product.price_cents * quantity });
  }

  const totalCents = lines.reduce((sum, line) => sum + line.subtotalCents, 0);
  if (amountPaidCents < totalCents) {
    return res.status(400).json({ error: `Insufficient payment. Please enter at least ${formatCents(totalCents)}.` });
  }
  const changeCents = amountPaidCents - totalCents;

  // Insert the transaction and its items together: all rows are saved, or none are.
  db.exec('BEGIN');
  try {
    const id = Number(insertTransaction.run(totalCents, amountPaidCents, changeCents).lastInsertRowid);
    for (const { product, quantity, subtotalCents } of lines) {
      insertItem.run(id, product.id, product.name, quantity, product.price_cents, subtotalCents);
    }
    db.exec('COMMIT');
    res.status(201).json(getTransaction(id));
  } catch (err) {
    db.exec('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Could not save the transaction. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Campus Bakery POS server running on http://localhost:${PORT}`);
});
