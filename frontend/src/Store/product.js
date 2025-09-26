import { create } from "zustand";

export const useProductStore = create((set) => ({
  product: [],
  setProduct: (product) => set({ product }),
  createProduct: async (newProduct) => {
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      return { success: false, message: "Please enter all fields." };
    }
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    const data = await res.json();
    set((state) => ({ product: [...state.product, data.data] }));
    return { success: true, message: "Product created sucessfully." };
  },
  fetchProducts: async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    set({ product: data.data });
  },
  deleteProduct: async (pid) => {
    try {
      const res = await fetch(`/api/products/${pid}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        return { success: false, message: data.message };
      }

      set((state) => ({
        product: state.product.filter((product) => product._id !== pid),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      console.error("DeleteProduct error:", error); // ✅ logs ECONNREFUSED, network errors, etc.
      return { success: false, message: error.message || "Network error" };
    }
  },
  updateProduct: async (pid, updatedProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    set((state) => ({
      product: state.product.map((product) =>
        product._id === pid ? data.data : product
      ),
    }));
    
    return {success: true, message: data.message}
  },
}));
