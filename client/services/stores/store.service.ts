import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==========================================
// STORE API SERVICE
// ==========================================

export const storeService = {
  // Public Store APIs
  public: {
    // GET /api/public/stores/list
    getStores: async () => {
      const response = await axios.get(`${API_BASE_URL}/public/stores/list`);
      return response.data;
    },

    // GET /api/public/stores/details/:slug
    getStoreBySlug: async (slug: string) => {
      const response = await axios.get(`${API_BASE_URL}/public/stores/details/${slug}`);
      return response.data;
    }
  },

  // Admin Store APIs (requires authentication)
  admin: {
    // GET /api/admin/stores/list
    getStores: async (token: string) => {
      const response = await axios.get(`${API_BASE_URL}/admin/stores/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },

    // POST /api/admin/stores/create
    createStore: async (storeData: any, token: string) => {
      const response = await axios.post(`${API_BASE_URL}/admin/stores/create`, storeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },

    // PUT /api/admin/stores/update/:id
    updateStore: async (id: string, storeData: any, token: string) => {
      const response = await axios.put(`${API_BASE_URL}/admin/stores/update/${id}`, storeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },

    // DELETE /api/admin/stores/delete/:id
    deleteStore: async (id: string, token: string) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/stores/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  }
};

export default storeService;