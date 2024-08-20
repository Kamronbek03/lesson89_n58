import axios from "axios";
import { create } from "zustand";

interface Product {
  id: string;
  title: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  comments: string;
  images: string[];
}

interface ProductState {
  loading: boolean;
  products: Product[];
  error: string;
  fetchProducts: () => void;
  addProduct: (newProduct: Omit<Product, "id">) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  loading: false,
  products: [],
  error: "",
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("http://localhost:3000/products");
      set({ loading: false, products: res.data, error: "" });
    } catch (err) {
      set({ loading: false, products: [], error: (err as Error).message });
    }
  },
  addProduct: async (newProduct) => {
    try {
      const { data: products } = await axios.get(
        "http://localhost:3000/products"
      );
      const highestId = Math.max(
        ...products.map((p: Product) => parseInt(p.id, 10))
      );
      const newId = (highestId + 1).toString();

      const completeProduct: Product = {
        ...newProduct,
        id: newId,
        discountPercentage: newProduct.discountPercentage || 0,
        rating: newProduct.rating || 0,
        comments: newProduct.comments || "",
        images: newProduct.images.length
          ? newProduct.images
          : ["https://example.com/default.jpg"],
      };

      const res = await axios.post(
        "http://localhost:3000/products",
        completeProduct
      );
      set((state) => ({
        products: [...state.products, res.data],
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
  updateProduct: async (id, updatedProduct) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/products/${id}`,
        updatedProduct
      );
      set((state) => ({
        products: state.products.map((product) =>
          product.id === id ? res.data : product
        ),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
  deleteProduct: async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      set((state) => ({
        products: state.products.filter((product) => product.id !== id),
      }));
    } catch (err) {
      set({ error: (err as Error).message });
    }
  },
}));
