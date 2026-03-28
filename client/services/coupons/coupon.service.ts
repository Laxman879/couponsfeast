import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ==========================================
// COUPON API SERVICE
// ==========================================

export const couponService = {
  // Public Coupon APIs
  public: {
    // GET /api/public/coupons/list
    getCoupons: async (filters = {}) => {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/public/coupons/list?${params}`);
      return response.data;
    },

    // GET /api/public/coupons/details/:id
    getCouponById: async (id: string) => {
      const response = await axios.get(`${API_BASE_URL}/public/coupons/details/${id}`);
      return response.data;
    },

    // GET /api/public/coupons/search
    searchCoupons: async (query: string) => {
      const response = await axios.get(`${API_BASE_URL}/public/coupons/search?q=${query}`);
      return response.data;
    },

    // GET /api/public/coupons/trending
    getTrendingCoupons: async () => {
      const response = await axios.get(`${API_BASE_URL}/public/coupons/trending`);
      return response.data;
    },

    // POST /api/public/coupons/reveal/:id
    revealCoupon: async (id: string) => {
      const response = await axios.post(`${API_BASE_URL}/public/coupons/reveal/${id}`);
      return response.data;
    },

    // POST /api/public/coupons/track-click/:id
    trackClick: async (id: string) => {
      const response = await axios.post(`${API_BASE_URL}/public/coupons/track-click/${id}`);
      return response.data;
    }
  },

  // Admin Coupon APIs (requires authentication)
  admin: {
    // GET /api/admin/coupons/list
    getCoupons: async (token: string) => {
      const response = await axios.get(`${API_BASE_URL}/admin/coupons/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },

    // POST /api/admin/coupons/create
    createCoupon: async (couponData: any, token: string) => {
      const response = await axios.post(`${API_BASE_URL}/admin/coupons/create`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },

    // PUT /api/admin/coupons/update/:id
    updateCoupon: async (id: string, couponData: any, token: string) => {
      const response = await axios.put(`${API_BASE_URL}/admin/coupons/update/${id}`, couponData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },

    // DELETE /api/admin/coupons/delete/:id
    deleteCoupon: async (id: string, token: string) => {
      const response = await axios.delete(`${API_BASE_URL}/admin/coupons/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    }
  }
};

export default couponService;