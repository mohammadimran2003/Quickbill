import { create } from "zustand";

const usePurchaseStore = create((set, get) => ({
  // State
  items: [],
  subTotal: 0,
  total: 0,
  paidAmount: 0,
  dueAmount: 0,

  // Actions
  addItem: (product) => {
    const items = get().items;
    const existingItemIndex = items.findIndex(
      (item) => item.productId === product.id,
    );

    const productCost = product.costPrice || 0;
    const productName = product.name;

    if (existingItemIndex >= 0) {
      const currentItem = items[existingItemIndex];
      const newQuantity = currentItem.quantity + 1;
      const newTotal = newQuantity * productCost;

      set({
        items: items.map((item, index) =>
          index === existingItemIndex
            ? {
                ...item,
                productName,
                quantity: newQuantity,
                unitCost: productCost,
                total: newTotal,
              }
            : item,
        ),
      });
    } else {
      set({
        items: [
          ...items,
          {
            productId: product.id,
            productName,
            quantity: 1,
            unitCost: productCost,
            total: productCost,
          },
        ],
      });
    }
    get().calculateTotals();
  },

  removeItem: (index) => {
    set({ items: get().items.filter((_, i) => i !== index) });
    get().calculateTotals();
  },

  updateQuantity: (index, quantity) => {
    const items = get().items;
    const item = items[index];
    const newTotal = quantity * item.unitCost;

    set({
      items: items.map((item, i) =>
        i === index ? { ...item, quantity, total: newTotal } : item,
      ),
    });
    get().calculateTotals();
  },

  updateUnitCost: (index, unitCost) => {
    const items = get().items;
    const item = items[index];
    const newTotal = item.quantity * unitCost;

    set({
      items: items.map((item, i) =>
        i === index ? { ...item, unitCost, total: newTotal } : item,
      ),
    });
    get().calculateTotals();
  },

  setPaidAmount: (paidAmount) => {
    set({ paidAmount });
    get().calculateDueAmount();
  },

  calculateTotals: () => {
    const items = get().items;
    const newSubTotal = items.reduce((acc, item) => acc + (item.total || 0), 0);
    set({ subTotal: newSubTotal, total: newSubTotal });
    get().calculateDueAmount();
  },

  calculateDueAmount: () => {
    const { total, paidAmount } = get();
    set({ dueAmount: Math.max(0, total - (paidAmount || 0)) });
  },

  setItems: (items) => {
    set({ items });
    get().calculateTotals();
  },

  setPurchaseData: (data) => {
    set({
      items: data.items || [],
      subTotal: data.subTotal || 0,
      total: data.total || 0,
      paidAmount: data.paidAmount || 0,
      dueAmount: data.dueAmount || 0,
    });
  },

  clearPurchase: () => {
    set({
      items: [],
      subTotal: 0,
      total: 0,
      paidAmount: 0,
      dueAmount: 0,
    });
  },
}));

export default usePurchaseStore;
