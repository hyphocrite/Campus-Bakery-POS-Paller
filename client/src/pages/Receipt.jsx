import { Link } from 'react-router-dom';
import Steps from '../components/Steps';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { peso } from '../data/format';

export default function Receipt() {
  const { lastOrder: order } = useCart();
  const { user } = useAuth();

  if (!order) {
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

  return (
    <div className="page">
      <Steps current={4} />
      <div className="receipt-wrap">
        <div className="receipt">
          <div className="receipt-head">
            <span className="receipt-logo">🥐</span>
            <h2>Campus Bakery</h2>
            <p>Main Campus Canteen, Ground Floor</p>
            <p className="success-pill">✓ Payment Successful</p>
          </div>

          <div className="receipt-meta">
            <div><span>Receipt #</span><span>{order.number}</span></div>
            <div><span>Date</span><span>{order.date.toLocaleString('en-PH')}</span></div>
            <div><span>Cashier</span><span>{user}</span></div>
          </div>

          <table className="receipt-items">
            <tbody>
              {order.items.map((i) => (
                <tr key={i.id}>
                  <td>
                    {i.name}
                    <small>{i.quantity} × {peso(i.price)}</small>
                  </td>
                  <td className="right">{peso(i.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="receipt-totals">
            <div className="grand"><span>TOTAL</span><span>{peso(order.total)}</span></div>
            <div><span>{order.method}</span><span>{peso(order.paid)}</span></div>
            <div><span>Change</span><span>{peso(order.change)}</span></div>
          </div>

          <p className="receipt-thanks">Thank you, and enjoy your bread! 🍞</p>
        </div>

        <div className="receipt-actions">
          <button className="btn btn-ghost" onClick={() => window.print()}>🖨 Print</button>
          <Link to="/products" className="btn btn-primary">New Order</Link>
          <Link to="/" className="btn btn-ghost">Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
