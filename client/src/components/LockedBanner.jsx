import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import NewTransactionButton from './NewTransactionButton';

// Shown on cart pages after payment so it's clear why the cart can't be edited.
export default function LockedBanner() {
  const { transaction } = useCart();
  if (!transaction) return null;

  return (
    <div className="locked-banner">
      <span>
        🔒 <strong>{transaction.txnNumber}</strong> is paid. The cart is locked.
      </span>
      <div className="locked-actions">
        <Link to="/receipt" className="btn btn-ghost btn-sm">View Receipt</Link>
        <NewTransactionButton className="btn btn-primary btn-sm" />
      </div>
    </div>
  );
}
