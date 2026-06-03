// store/cartStore.js
import { toast } from "sonner";
import { create } from "zustand";
import getCustomerById from "../api/customers_api/getCustomerById";

const useCartStore = create((set, get) => ({
  // State
  items: [],
  customer: null,
  discountType: "NONE",
  discountValue: 0,
  paymentMethod: "CASH",
  isDraftLoading: false,
  draftData: null,

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
    console.log(get().items, "items");
    console.log(productId, quantity, "productId, quantity");
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
      draftData: null,
    }),

  loadDraft: async (draft) => {
    if (!draft) return;
    set({ isDraftLoading: true });

    try {
      let customerData = null;

      if (draft?.customerId) {
        customerData = await getCustomerById(draft?.customerId);
      }
      set({
        items: draft.items || [],
        customer: customerData?.data,
        draftData: draft,
      });
    } catch (error) {
      console.error("Draft loading error:", error);
      toast.error("Draft load error");
    } finally {
      set({ isDraftLoading: false });
    }
  },
}));

export default useCartStore;
