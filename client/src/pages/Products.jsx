import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Steps from '../components/Steps';
import LockedBanner from '../components/LockedBanner';
import { useCart } from '../context/CartContext';
import products from '../data/products';
import { centsToPeso } from '../data/format';

export default function Products() {
  const { items, addToCart, itemCount, totalCents, locked } = useCart();
  const qtyInCart = (id) => items.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <div className="page">
      <Steps current={0} />
      <LockedBanner />
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="muted">Tap a product to add it to the current order.</p>
        </div>
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} quantity={qtyInCart(p.id)} onAdd={addToCart} disabled={locked} />
        ))}
      </div>

      {itemCount > 0 && !locked && (
        <div className="cart-bar">
          <span>
            🛒 <strong>{itemCount}</strong> item{itemCount > 1 ? 's' : ''} · <strong>{centsToPeso(totalCents)}</strong>
          </span>
          <Link to="/order-summary" className="btn btn-light">Review Order →</Link>
        </div>
      )}
    </div>
  );
}
