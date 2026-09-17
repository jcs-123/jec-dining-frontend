import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('jec_cart_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cartCafe, setCartCafe] = useState(() => {
    try {
      const saved = localStorage.getItem('jec_cart_cafe');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [pendingCafeSwitch, setPendingCafeSwitch] = useState(null); // { cafe, action }
  const toast = useToast();

  useEffect(() => {
    localStorage.setItem('jec_cart_items', JSON.stringify(items));
    if (items.length === 0) {
      setCartCafe(null);
      localStorage.removeItem('jec_cart_cafe');
    } else if (cartCafe) {
      localStorage.setItem('jec_cart_cafe', JSON.stringify(cartCafe));
    }
  }, [items, cartCafe]);

  // Generate unique item key based on combo ID, option selections, and scheduled pickup date
  const generateCustomKey = (comboId, selectedOptions = [], scheduledDate = 'Today') => {
    const sortedOptions = [...selectedOptions].sort((a, b) => a.optionName.localeCompare(b.optionName));
    const optStr = sortedOptions.map(o => `${o.groupName}:${o.optionName}`).join('|');
    const dateStr = (scheduledDate || 'Today').trim();
    return `${comboId}__${dateStr}__${optStr}`;
  };

  const addItem = (cafe, combo, quantity = 1, selectedOptions = [], scheduledDate = 'Today') => {
    // Check if switching cafes with items already in cart
    if (cartCafe && cartCafe.slug !== cafe.slug && items.length > 0) {
      return new Promise((resolve) => {
        setPendingCafeSwitch({
          targetCafe: cafe,
          onConfirm: () => {
            setItems([]);
            setCartCafe(cafe);
            performAdd(cafe, combo, quantity, selectedOptions, scheduledDate);
            setPendingCafeSwitch(null);
            resolve(true);
          },
          onCancel: () => {
            setPendingCafeSwitch(null);
            resolve(false);
          }
        });
      });
    }

    if (!cartCafe) {
      setCartCafe(cafe);
    }

    performAdd(cafe, combo, quantity, selectedOptions, scheduledDate);
    return Promise.resolve(true);
  };

  const performAdd = (cafe, combo, quantity, selectedOptions, scheduledDate = 'Today') => {
    const dateLabel = scheduledDate || 'Today';
    const customKey = generateCustomKey(combo._id || combo.id, selectedOptions, dateLabel);
    const effectiveBase = combo.offerPricePaise != null ? combo.offerPricePaise : combo.basePricePaise;
    const extrasPaise = selectedOptions.reduce((sum, opt) => sum + (opt.extraPricePaise || 0), 0);
    const unitPricePaise = effectiveBase + extrasPaise;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.customKey === customKey);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          customKey,
          comboId: combo._id || combo.id,
          name: combo.name,
          image: combo.image,
          unitPricePaise,
          quantity,
          isVeg: combo.isVeg,
          scheduledDate: dateLabel,
          selectedOptions,
          fixedItemsSnapshot: combo.fixedItems || []
        }
      ];
    });

    toast.success(`Added "${combo.name}" (${dateLabel}) to your cart!`);
  };

  const updateQuantity = (customKey, newQty) => {
    if (newQty <= 0) {
      removeItem(customKey);
      return;
    }
    setItems((prev) => prev.map((item) => (item.customKey === customKey ? { ...item, quantity: newQty } : item)));
  };

  const removeItem = (customKey) => {
    setItems((prev) => prev.filter((item) => item.customKey !== customKey));
    toast.info('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    setCartCafe(null);
  };

  // Pricing calculations (0% GST - GST removed upon user request)
  const subtotalPaise = items.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
  const taxRate = 0;
  const taxPaise = 0;
  const totalPaise = subtotalPaise;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      cartCafe,
      isCartOpen,
      setIsCartOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      subtotalPaise,
      taxPaise,
      totalPaise,
      itemCount,
      pendingCafeSwitch
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
