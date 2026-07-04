import api from "./api";

export const authService = {
  async login(email, password) {
    try {
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      return { token, user };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  },

  async register(name, email, password) {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });

    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};