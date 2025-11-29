import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

// Dynamic base URL
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

export const useProductStore = create((set, get) => ({
  // product state
  products: [],
  loading: false,
  error: null,
  currentProduct: {},

  // form state
  formData: {
    name: "",
    price: "",
    image: "",
  },

  setFormData: (formData) => set({ formData }),
  resetForm: () => set({ formData: { name: "", price: "", image: "" } }),

  addProduct: async (e) => {
    e.preventDefault();
    set({ loading: true });

    try {
      const { formData } = get();
      await axios.post(`${BASE_URL}/api/products`, formData);
      await get().fetchProducts();
      await get().resetForm();
      toast.success("Product Added Successfully");
      // TODO: Close the Modal
      document.getElementById("add_product_modal").close();
    } catch (error) {
      console.log("Error in Add Product", error);
      toast.error("Something went wrong");
    } finally {
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${BASE_URL}/api/products`);
      set({ products: response.data.data, error: null });
    } catch (err) {
      if (err.status === 429)
        set({ error: "Rate Limit Exceeded", products: [] });
      else set({ error: "Something Went Wrong", products: [] });
    } finally {
      set({ loading: false });
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}/api/products/${id}`);
      set((prev) => ({
        products: prev.products.filter((product) => product.id !== id),
      }));
      toast.success("Product Deleted Successfully");
    } catch (error) {
      console.log("Error in deleteProduct");
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },

  fetchProduct: async (id) => {
    set({ loading: true });

    try {
      const response = await axios.get(`${BASE_URL}/api/products/${id}`);
      set({
        currentProduct: response.data.data,
        formData: response.data.data,
        error: null,
      });
    } catch (error) {
      console.log("Error in Fetch Product", error);
      set({ error: "Something went wrong", currentProduct: null });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (id) => {
    set({ loading: true });
    try {
      const { formData } = get();
      const response = await axios.put(
        `${BASE_URL}/api/products/${id}`,
        formData
      );

      console.log("We are setting new data", response.data.data);

      set({ currentProduct: response.data.data });
      toast.success("Product Updated Successfully");
    } catch (error) {
      console.log("Error in updateProduct", error);
      toast.error("Something went wrong");
    } finally {
      set({ loading: false });
    }
  },
}));
