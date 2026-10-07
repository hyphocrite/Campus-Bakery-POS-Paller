import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Steps from '../components/Steps';
import { useCart } from '../context/CartContext';
import products from '../data/products';
import { peso } from '../data/format';

export default function Products() {
  const { items, addToCart, itemCount, total } = useCart();
  const qtyInCart = (id) => items.find((i) => i.id === id)?.quantity ?? 0;

  return (
    <div className="page">
      <Steps current={0} />
      <div className="page-header">
        <div>
          <h1>Products</h1>
          <p className="muted">Tap a product to add it to the current order.</p>
        </div>
      </div>

      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} quantity={qtyInCart(p.id)} onAdd={addToCart} />
        ))}
      </div>

      {itemCount > 0 && (
        <div className="cart-bar">
          <span>
            🛒 <strong>{itemCount}</strong> item{itemCount > 1 ? 's' : ''} · <strong>{peso(total)}</strong>
          </span>
          <Link to="/order-summary" className="btn btn-light">Review Order →</Link>
        </div>
      )}
    </div>
  );
}
