// store/cartStore.js
import { toast } from "sonner";
import { create } from "zustand";

const useCartStore = create((set, get) => ({
  // State
  items: [],
  customer: null,
  discountType: "NONE",
  discountValue: 0,
  paymentMethod: "CASH",

  // Actions
  addItem: (product) => {
    const items = get().items;
    const existing = items.find((item) => item.id === product.id);

    if (existing) {
      if (existing.quantity < product.stock) {
        set({
          items: items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        });
      } else {
        toast.warning("Stock a r Product nai");
      }
    } else {
      set({ items: [...items, { ...product, quantity: 1 }] });
    }
  },

  removeItem: (productId) => {
    set({ items: get().items.filter((item) => item.id !== productId) });
  },

  updateQuantity: (productId, quantity) => {
    set({
      items: get().items.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      ),
    });
  },

  setCustomer: (customer) => set({ customer }),

  setDiscount: (type, value) =>
    set({ discountType: type, discountValue: value }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  clearCart: () =>
    set({
      items: [],
      customer: null,
      discountType: "FLAT",
      discountValue: 0,
      paymentMethod: "CASH",
    }),
}));

export default useCartStore;
