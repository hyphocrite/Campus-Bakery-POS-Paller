import { Link, useNavigate } from 'react-router-dom';
import Steps from '../components/Steps';
import { useCart } from '../context/CartContext';
import { peso } from '../data/format';

export default function OrderSummary() {
  const { items, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page">
      <Steps current={1} />
      <div className="page-header">
        <div>
          <h1>Order Summary</h1>
          <p className="muted">Review the items before proceeding to payment.</p>
        </div>
        {items.length > 0 && (
          <button className="btn btn-ghost" onClick={clearCart}>Clear Order</button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card empty-state">
          <span className="empty-icon">🛒</span>
          <h2>No items yet</h2>
          <p className="muted">Add some baked goods from the Products page.</p>
          <Link to="/products" className="btn btn-primary">Browse Products</Link>
        </div>
      ) : (
        <div className="two-col">
          <section className="card table-card">
            <table className="order-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th className="right">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((i) => (
                  <tr key={i.id}>
                    <td>
                      <span className="menu-emoji">{i.emoji}</span> {i.name}
                    </td>
                    <td>{peso(i.price)}</td>
                    <td>
                      <div className="qty">
                        <button onClick={() => updateQuantity(i.id, i.quantity - 1)} aria-label="Decrease">−</button>
                        <span>{i.quantity}</span>
                        <button onClick={() => updateQuantity(i.id, i.quantity + 1)} aria-label="Increase">+</button>
                      </div>
                    </td>
                    <td className="right strong">{peso(i.price * i.quantity)}</td>
                    <td className="right">
                      <button className="icon-btn" onClick={() => removeFromCart(i.id)} aria-label="Remove">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="card summary-card">
            <h2>Total</h2>
            <div className="summary-row"><span>Items</span><span>{itemCount}</span></div>
            <div className="summary-row"><span>Subtotal</span><span>{peso(total)}</span></div>
            <div className="summary-row total"><span>Amount Due</span><span>{peso(total)}</span></div>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('/payment')}>
              Proceed to Payment
            </button>
            <Link to="/products" className="btn btn-ghost btn-block">+ Add More Items</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
