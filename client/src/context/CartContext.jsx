import { createContext, useContext, useState } from 'react';
import { addItem, decreaseQty, increaseQty, recalculateCart, removeItem } from '../data/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => recalculateCart([]));
  const [lastOrder, setLastOrder] = useState(null);

  // Every cart change goes through here: apply the change, then recalculate
  // subtotals + total. Setting state re-renders every component showing the cart.
  const updateCart = (change) => setCart((prev) => recalculateCart(change(prev.items)));

  const addToCart = (product) => updateCart((items) => addItem(items, product));
  const increase = (id) => updateCart((items) => increaseQty(items, id));
  const decrease = (id) => updateCart((items) => decreaseQty(items, id));
  const removeFromCart = (id) => updateCart((items) => removeItem(items, id));
  const clearCart = () => updateCart(() => []);

  return (
    <CartContext.Provider
      value={{ ...cart, addToCart, increase, decrease, removeFromCart, clearCart, lastOrder, setLastOrder }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
