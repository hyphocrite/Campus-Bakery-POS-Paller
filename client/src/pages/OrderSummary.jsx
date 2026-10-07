import { Link, useNavigate } from 'react-router-dom';
import Steps from '../components/Steps';
import LockedBanner from '../components/LockedBanner';
import { useCart } from '../context/CartContext';
import { centsToPeso, peso } from '../data/format';

export default function OrderSummary() {
  const { items, itemCount, totalCents, locked, increase, decrease, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="page">
      <Steps current={1} />
      <LockedBanner />
      <div className="page-header">
        <div>
          <h1>Order Summary</h1>
          <p className="muted">Review the items before proceeding to payment.</p>
        </div>
        {items.length > 0 && !locked && (
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
                      <div className="item-cell">
                        <img className="item-thumb" src={i.image} alt="" />
                        <span className="strong">{i.name}</span>
                      </div>
                    </td>
                    <td>{peso(i.price)}</td>
                    <td>
                      <div className="qty">
                        <button
                          onClick={() => decrease(i.id)}
                          disabled={locked || i.quantity === 1}
                          aria-label={`Decrease ${i.name}`}
                          title={i.quantity === 1 ? 'Minimum is 1. Use Remove to take it off the order.' : undefined}
                        >
                          −
                        </button>
                        <span>{i.quantity}</span>
                        <button onClick={() => increase(i.id)} disabled={locked} aria-label={`Increase ${i.name}`}>+</button>
                      </div>
                    </td>
                    <td className="right strong">{centsToPeso(i.subtotalCents)}</td>
                    <td className="right">
                      <button className="btn-remove" onClick={() => removeFromCart(i.id)} disabled={locked}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <aside className="card summary-card">
            <h2>Total</h2>
            <div className="summary-row"><span>Items</span><span>{itemCount}</span></div>
            <div className="summary-row"><span>Subtotal</span><span>{centsToPeso(totalCents)}</span></div>
            <div className="summary-row total"><span>Amount Due</span><span>{centsToPeso(totalCents)}</span></div>
            {locked ? (
              <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('/receipt')}>
                View Receipt
              </button>
            ) : (
              <>
                <button className="btn btn-primary btn-block btn-lg" onClick={() => navigate('/payment')}>
                  Proceed to Payment
                </button>
                <Link to="/products" className="btn btn-ghost btn-block">+ Add More Items</Link>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
