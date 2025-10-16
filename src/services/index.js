import api from "./api";
import Cookies from "js-cookie";

export const authService = {
  // Sign up
  signup: async (userData) => {
    const response = await api.post("/users/signup", userData);
    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(response.data.data.user), {
        expires: 7,
      });
    }
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post("/users/login", credentials);
    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 7 });
      Cookies.set("user", JSON.stringify(response.data.data.user), {
        expires: 7,
      });
    }
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/users/logout");
    } finally {
      Cookies.remove("token");
      Cookies.remove("user");
    }
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = Cookies.get("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if authenticated
  isAuthenticated: () => {
    return !!Cookies.get("token");
  },

  // Get profile
  getProfile: async () => {
    const response = await api.get("/users/me");
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await api.patch("/users/updateMe", data);
    if (response.data.data.user) {
      Cookies.set("user", JSON.stringify(response.data.data.user), {
        expires: 7,
      });
    }
    return response.data;
  },

  // Update password
  updatePassword: async (data) => {
    const response = await api.patch("/users/updateMyPassword", data);
    if (response.data.token) {
      Cookies.set("token", response.data.token, { expires: 7 });
    }
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/users/forgotPassword", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, data) => {
    const response = await api.patch(`/users/resetPassword/${token}`, data);
    return response.data;
  },
};

export const scrapeService = {
  // Guest scrape
  scrapeGuest: async (params) => {
    const response = await api.get("/scrape/guest", { params });
    return response.data;
  },

  // User scrape (authenticated)
  scrapeUser: async (params) => {
    const response = await api.get("/scrape/user", { params });
    return response.data;
  },
};

export const searchService = {
  // Get user's search history
  getMySearches: async () => {
    const response = await api.get("/search/mySearches");
    return response.data;
  },

  // Get specific search
  getSearch: async (id) => {
    const response = await api.get(`/search/getSearch/${id}`);
    return response.data;
  },

  // Delete search
  deleteSearch: async (id) => {
    const response = await api.delete(`/search/deleteSearch/${id}`);
    return response.data;
  },
};

export const cartService = {
  // Get cart
  getCart: async () => {
    const response = await api.get("/cart/getCart");
    return response.data;
  },

  // Add item to cart
  addItem: async (item) => {
    const response = await api.post("/cart/addItem", item);
    return response.data;
  },

  // Remove item from cart
  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/removeItem/${itemId}`);
    return response.data;
  },

  // Update item quantity
  updateItem: async (itemId, quantity) => {
    const response = await api.patch(`/cart/updateItem/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete("/cart/clearCart");
    return response.data;
  },
};

export const healthService = {
  // Basic health check
  checkHealth: async () => {
    const response = await api.get("/health");
    return response.data;
  },

  // Readiness check
  checkReadiness: async () => {
    const response = await api.get("/health/ready");
    return response.data;
  },
};
