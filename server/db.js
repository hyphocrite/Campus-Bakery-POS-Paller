import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, 'data', 'bakery.db'));

// All money is stored as INTEGER centavos (₱25.00 = 2500) so there are no floating-point errors.
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY,
    name        TEXT    NOT NULL UNIQUE,
    price_cents INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    total_cents       INTEGER NOT NULL,
    amount_paid_cents INTEGER NOT NULL,
    change_cents      INTEGER NOT NULL,
    payment_method    TEXT    NOT NULL DEFAULT 'Cash',
    created_at        TEXT    NOT NULL DEFAULT (datetime('now', 'localtime'))
  );

  CREATE TABLE IF NOT EXISTS transaction_items (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id   INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id       INTEGER NOT NULL REFERENCES products(id),
    product_name     TEXT    NOT NULL,
    quantity         INTEGER NOT NULL,
    unit_price_cents INTEGER NOT NULL,
    subtotal_cents   INTEGER NOT NULL
  );
`);

// Same hardcoded menu as the client; the server uses these prices so totals can't be tampered with.
const seed = db.prepare('INSERT OR IGNORE INTO products (id, name, price_cents) VALUES (?, ?, ?)');
[
  [1, 'Pandesal', 2500],
  [2, 'Ensaymada', 2000],
  [3, 'Spanish Bread', 1500],
  [4, 'Chocolate Cupcake', 3000],
  [5, 'Loaf Bread', 5500],
  [6, 'Brewed Coffee', 2500],
].forEach((row) => seed.run(...row));

export default db;
