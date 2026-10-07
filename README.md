# Campus-Bakery-POS-Paller
Midterm Practical Exam

A point-of-sale UI for a campus bakery built with React (Vite) + Express, using **SQLite** for storage (via Node's built-in `node:sqlite`, Node 22.13+).

## Structure

```
client/   React + Vite + React Router (UI)
server/   Express API + SQLite schema (server/data/bakery.db)
```

## Running

```bash
# Terminal 1 – API + database
cd server
npm install
npm run dev        # http://localhost:5000

# Terminal 2 – UI
cd client
npm install
npm run dev        # http://localhost:5173
```

## Pages

| Route            | Page                                         |
| ---------------- | -------------------------------------------- |
| `/login`         | Fake login (any username/password works)     |
| `/`              | Dashboard (home)                             |
| `/products`      | Product cards with Add to Cart               |
| `/order-summary` | Cart review, quantities, totals              |
| `/payment`       | Cash / GCash / Card, amount tendered, change |
| `/receipt`       | Printable receipt                            |

Products are hardcoded in `client/src/data/products.js`.
