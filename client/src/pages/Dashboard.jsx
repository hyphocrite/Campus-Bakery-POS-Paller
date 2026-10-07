import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import products from '../data/products';
import { peso } from '../data/format';

export default function Dashboard() {
  const { user } = useAuth();
  const { itemCount, total, lastOrder } = useCart();
  const today = new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const stats = [
    { label: 'Products on Menu', value: products.length, icon: '🧺' },
    { label: 'Items in Cart', value: itemCount, icon: '🛒' },
    { label: 'Current Cart Total', value: peso(total), icon: '💰' },
    { label: 'Last Receipt', value: lastOrder ? `#${lastOrder.number}` : '—', icon: '🧾' },
  ];

  return (
    <div className="page">
      <section className="hero-banner">
        <div>
          <p className="eyebrow">{today}</p>
          <h1>Good day, {user}!</h1>
          <p>Ready to serve fresh bread to the campus? Start a new order below.</p>
        </div>
        <Link to="/products" className="btn btn-light btn-lg">+ New Order</Link>
      </section>

      <section className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <span className="stat-icon">{s.icon}</span>
            <div>
              <p className="stat-label">{s.label}</p>
              <p className="stat-value">{s.value}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="dash-grid">
        <section className="card">
          <div className="card-header">
            <h2>Today&apos;s Menu</h2>
            <Link to="/products" className="link">View all →</Link>
          </div>
          <ul className="menu-list">
            {products.map((p) => (
              <li key={p.id}>
                <img className="item-thumb" src={p.image} alt="" />
                <span className="menu-name">{p.name}</span>
                <span className="menu-price">{peso(p.price)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/products" className="quick-action">
              <span>🥖</span>Browse Products
            </Link>
            <Link to="/order-summary" className="quick-action">
              <span>📋</span>Order Summary
            </Link>
            <Link to="/payment" className="quick-action">
              <span>💳</span>Payment
            </Link>
            <Link to="/receipt" className="quick-action">
              <span>🧾</span>Last Receipt
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
