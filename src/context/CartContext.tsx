import React, { createContext, useContext, useState } from 'react';
import type { CartItem, OrderType, SelectedModifierOption } from '../types/order';
import type { Dish } from '../types/menu';
import { RESTAURANT_BRAND } from '../config/constants';

interface CartContextType {
  items: CartItem[];
  orderType: OrderType;
  tableNumber: string;
  specialInstructions: string;
  tipPercent: number;
  promoCode: string;
  addItem: (dish: Dish, quantity?: number, selectedModifiers?: SelectedModifierOption[]) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setTableNumber: (table: string) => void;
  setSpecialInstructions: (notes: string) => void;
  setTipPercent: (percent: number) => void;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('DINE_IN');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [promoCode] = useState<string>('');

  const addItem = (dish: Dish, quantity = 1, selectedModifiers: SelectedModifierOption[] = []) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.dish.id === dish.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        const modTotal = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
        updated[existingIndex].quantity = newQty;
        updated[existingIndex].itemSubtotal = (dish.price + modTotal) * newQty;
        return updated;
      }
      const modTotal = selectedModifiers.reduce((acc, m) => acc + m.price, 0);
      return [
        ...prev,
        {
          dish,
          quantity,
          selectedModifiers,
          itemSubtotal: (dish.price + modTotal) * quantity,
        },
      ];
    });
  };

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.dish.id === dishId) {
          const modTotal = item.selectedModifiers.reduce((acc, m) => acc + m.price, 0);
          return {
            ...item,
            quantity,
            itemSubtotal: (item.dish.price + modTotal) * quantity,
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((acc, i) => acc + i.itemSubtotal, 0);
  const taxAmount = subtotal * RESTAURANT_BRAND.defaultTaxRate;
  const deliveryFee = orderType === 'DELIVERY' ? RESTAURANT_BRAND.defaultDeliveryFee : 0;
  const tipAmount = (subtotal * tipPercent) / 100;
  const totalAmount = subtotal + taxAmount + deliveryFee + tipAmount;

  return (
    <CartContext.Provider
      value={{
        items,
        orderType,
        tableNumber,
        specialInstructions,
        tipPercent,
        promoCode,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setOrderType,
        setTableNumber,
        setSpecialInstructions,
        setTipPercent,
        subtotal,
        taxAmount,
        deliveryFee,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};
