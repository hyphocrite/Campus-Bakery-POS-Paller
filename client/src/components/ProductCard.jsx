import { useState } from 'react';
import { peso } from '../data/format';

export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    onAdd(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 800);
  };

  return (
    <article className="product-card">
      <div className="product-thumb">{product.emoji}</div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">{peso(product.price)}</p>
      </div>
      <button className={`btn btn-primary btn-block ${added ? 'btn-added' : ''}`} onClick={handleAdd}>
        {added ? '✓ Added' : 'Add to Cart'}
      </button>
    </article>
  );
}
