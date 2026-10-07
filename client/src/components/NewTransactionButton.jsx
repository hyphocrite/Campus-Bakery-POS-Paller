import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function NewTransactionButton({ className = 'btn btn-primary' }) {
  const { startNewTransaction } = useCart();
  const navigate = useNavigate();

  const handleClick = () => {
    startNewTransaction();
    navigate('/products');
  };

  return (
    <button className={className} onClick={handleClick}>
      Start New Transaction
    </button>
  );
}
