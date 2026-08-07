import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface InquiryItem {
  id: string; // Unique ID for the line item (can just use productId if single instance per product)
  product: any;
  quantity: number;
  unit: string;
  notes: string;
}

interface InquiryContextType {
  items: InquiryItem[];
  addItem: (product: any, quantity?: number, unit?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateUnit: (productId: string, unit: string) => void;
  updateNotes: (productId: string, notes: string) => void;
  clearInquiry: () => void;
  itemCount: number;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const InquiryProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<InquiryItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('azm_inquiry_list');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse inquiry list');
      }
    }
  }, []);

  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem('azm_inquiry_list', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, quantity = 1, unit = 'PCS') => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: product.id, product, quantity, unit, notes: '' }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return;
    setItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const updateUnit = (productId: string, unit: string) => {
    setItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, unit } : item
    ));
  };

  const updateNotes = (productId: string, notes: string) => {
    setItems(prev => prev.map(item => 
      item.product.id === productId ? { ...item, notes } : item
    ));
  };

  const clearInquiry = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <InquiryContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateUnit,
      updateNotes,
      clearInquiry,
      itemCount
    }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
};
