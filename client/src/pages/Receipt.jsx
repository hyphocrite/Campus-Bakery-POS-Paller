import { Link } from 'react-router-dom';
import Steps from '../components/Steps';
import NewTransactionButton from '../components/NewTransactionButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { centsToPeso, formatDateTime } from '../data/format';

export default function Receipt() {
  const { transaction: txn } = useCart();
  const { user } = useAuth();

  if (!txn) {
    return (
      <div className="page">
        <Steps current={3} />
        <div className="card empty-state">
          <span className="empty-icon">🧾</span>
          <h2>No receipt yet</h2>
          <p className="muted">Complete a payment to generate a receipt.</p>
          <Link to="/products" className="btn btn-primary">Start an Order</Link>
        </div>
      </div>
    );
  }

  // Everything below comes from the saved SQLite transaction, not the live cart.
  return (
    <div className="page">
      <Steps current={4} />
      <div className="receipt-wrap">
        <div className="receipt">
          <div className="receipt-head">
            <span className="receipt-logo">🥐</span>
            <h2>Campus Bakery</h2>
            <p>Main Campus Canteen, Ground Floor</p>
          </div>

          <div className="receipt-meta">
            <div><span>Transaction No.</span><strong>{txn.txnNumber}</strong></div>
            <div><span>Date &amp; Time</span><span>{formatDateTime(txn.createdAt)}</span></div>
            <div><span>Cashier</span><span>{user}</span></div>
          </div>

          <table className="receipt-items">
            <thead>
              <tr>
                <th>Item</th>
                <th className="center">Qty</th>
                <th className="right">Unit Price</th>
                <th className="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {txn.items.map((i) => (
                <tr key={i.productId}>
                  <td>{i.name}</td>
                  <td className="center">{i.quantity}</td>
                  <td className="right">{centsToPeso(i.unitPriceCents)}</td>
                  <td className="right">{centsToPeso(i.subtotalCents)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-totals">
            <div className="grand"><span>TOTAL</span><span>{centsToPeso(txn.totalCents)}</span></div>
            <div><span>Cash Paid</span><span>{centsToPeso(txn.amountPaidCents)}</span></div>
            <div><span>Change</span><span>{centsToPeso(txn.changeCents)}</span></div>
          </div>

          <p className="receipt-thanks">Thank you, and enjoy your bread! 🍞</p>
        </div>

        <div className="receipt-actions">
          <button className="btn btn-ghost" onClick={() => window.print()}>🖨 Print</button>
          <NewTransactionButton />
        </div>
      </div>
    </div>
  );
}
