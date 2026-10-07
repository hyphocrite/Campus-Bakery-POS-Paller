import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Steps from '../components/Steps';
import { useCart } from '../context/CartContext';
import { peso } from '../data/format';
import { computeChange } from '../data/cart';

const METHODS = [
  { id: 'cash', label: 'Cash', icon: '💵' },
  { id: 'gcash', label: 'GCash', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
];

export default function Payment() {
  const { items, total, clearCart, setLastOrder } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState('cash');
  const [tendered, setTendered] = useState('');

  if (items.length === 0) {
    return (
      <div className="page">
        <Steps current={2} />
        <div className="card empty-state">
          <span className="empty-icon">💳</span>
          <h2>Nothing to pay for</h2>
          <p className="muted">Your order is empty. Add products first.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      </div>
    );
  }

  const paid = method === 'cash' ? Number(tendered) || 0 : total;
  const change = computeChange(paid, total);
  const canPay = paid >= total;
  const quickCash = [...new Set([total, Math.ceil(total / 50) * 50, Math.ceil(total / 100) * 100, 500, 1000])]
    .filter((v) => v >= total)
    .slice(0, 4);

  const handleConfirm = () => {
    setLastOrder({
      number: String(Date.now()).slice(-6),
      date: new Date(),
      items,
      total,
      method: METHODS.find((m) => m.id === method).label,
      paid,
      change,
    });
    clearCart();
    navigate('/receipt');
  };

  return (
    <div className="page">
      <Steps current={2} />
      <div className="page-header">
        <div>
          <h1>Payment</h1>
          <p className="muted">Select a payment method and confirm.</p>
        </div>
      </div>

      <div className="two-col">
        <section className="card">
          <h2>Payment Method</h2>
          <div className="method-grid">
            {METHODS.map((m) => (
              <button
                key={m.id}
                className={`method ${method === m.id ? 'selected' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <span>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>

          {method === 'cash' ? (
            <>
              <label className="field">
                Amount Tendered
                <div className="input-prefix">
                  <span>₱</span>
                  <input
                    type="number"
                    min="0"
                    value={tendered}
                    onChange={(e) => setTendered(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </label>
              <div className="quick-cash">
                {quickCash.map((v) => (
                  <button key={v} className="chip" onClick={() => setTendered(String(v))}>
                    {peso(v)}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="note">
              {method === 'gcash' ? 'Ask the customer to scan the store QR code.' : 'Insert or tap the card on the terminal.'}{' '}
              The exact amount of <strong>{peso(total)}</strong> will be charged.
            </p>
          )}
        </section>

        <aside className="card summary-card">
          <h2>Amount Due</h2>
          <p className="amount-due">{peso(total)}</p>
          <div className="summary-row"><span>Paid</span><span>{peso(paid)}</span></div>
          <div className={`summary-row total ${change < 0 ? 'negative' : ''}`}>
            <span>{change < 0 ? 'Remaining' : 'Change'}</span>
            <span>{peso(Math.abs(change))}</span>
          </div>
          <button className="btn btn-primary btn-block btn-lg" disabled={!canPay} onClick={handleConfirm}>
            Confirm Payment
          </button>
          <Link to="/order-summary" className="btn btn-ghost btn-block">← Back to Order</Link>
        </aside>
      </div>
    </div>
  );
}
