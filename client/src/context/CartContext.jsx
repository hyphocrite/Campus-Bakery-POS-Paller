import { createContext, useContext, useState } from 'react';
import { addItem, decreaseQty, increaseQty, recalculateCart, removeItem } from '../data/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => recalculateCart([]));
  const [paymentInput, setPaymentInput] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [transaction, setTransaction] = useState(null);

  // Once a transaction is saved the cart is locked, so the receipt can't change.
  const locked = transaction !== null;

  // Every cart change goes through here: apply the change, then recalculate
  // subtotals + total. Setting state re-renders every component showing the cart.
  const updateCart = (change) => {
    if (locked) return;
    setCart((prev) => recalculateCart(change(prev.items)));
  };

  const addToCart = (product) => updateCart((items) => addItem(items, product));
  const increase = (id) => updateCart((items) => increaseQty(items, id));
  const decrease = (id) => updateCart((items) => decreaseQty(items, id));
  const removeFromCart = (id) => updateCart((items) => removeItem(items, id));
  const clearCart = () => updateCart(() => []);

  const completePayment = (savedTransaction) => {
    setPaymentError('');
    setTransaction(savedTransaction);
  };

  // Clears the cart, payment input, messages and receipt for the next customer.
  const startNewTransaction = () => {
    setCart(recalculateCart([]));
    setPaymentInput('');
    setPaymentError('');
    setTransaction(null);
  };

  return (
    <CartContext.Provider
      value={{
        ...cart,
        locked,
        addToCart,
        increase,
        decrease,
        removeFromCart,
        clearCart,
        paymentInput,
        setPaymentInput,
        paymentError,
        setPaymentError,
        transaction,
        completePayment,
        startNewTransaction,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
