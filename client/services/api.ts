import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Coupons
export const getCoupons = (params?: any) => api.get('/public/coupons/list', { params });
export const getCouponById = (id: string) => api.get(`/public/coupons/details/${id}`);
export const getAdminCoupons = () => api.get('/admin/coupons/list');
export const createCoupon = (data: any) => api.post('/admin/coupons/create', data);
export const updateCoupon = (id: string, data: any) => api.put(`/admin/coupons/update/${id}`, data);
export const deleteCoupon = (id: string) => api.delete(`/admin/coupons/delete/${id}`);
export const trackClick = (id: string) => api.post(`/public/coupons/track-click/${id}`);
export const searchCoupons = (query: string) => api.get('/public/coupons/search', { params: { query } });

// Stores
export const getStores = (params?: any) => api.get('/public/stores/list', { params });
export const getStoreBySlug = (slug: string) => api.get(`/public/stores/details/${slug}`);
export const createStore = (data: any) => api.post('/admin/stores/create', data);
export const updateStore = (id: string, data: any) => api.put(`/admin/stores/update/${id}`, data);
export const deleteStore = (id: string) => api.delete(`/admin/stores/delete/${id}`);

// CMS / Site Config
export const getSiteConfig = () => api.get('/public/site/config');
export const updateSiteConfig = (data: any) => api.put('/admin/pages/site-config/update', data);
export const getNavigation = () => api.get('/public/navbar/navigation');
export const updateNavigation = (data: any) => api.put('/admin/navbar/navigation/update', data);
export const getBanners = () => api.get('/public/site/banners/list');
export const getPage = (pageName: string) => api.get(`/public/site/${pageName}`);
export const getCategories = () => api.get('/public/categories/list');
export const getPopularStores = () => api.get('/public/popular-stores/list');
export const getFeaturedCoupons = () => api.get('/public/featured-coupons/list');

// Deals
export const getDeals = (params?: any) => api.get('/public/deals/list', { params });
export const getDealById = (id: string) => api.get(`/public/deals/details/${id}`);
export const getAdminDeals = () => api.get('/admin/deals');
export const createDeal = (data: any) => api.post('/admin/deals/create', data);
export const updateDeal = (id: string, data: any) => api.put(`/admin/deals/update/${id}`, data);
export const deleteDeal = (id: string) => api.delete(`/admin/deals/delete/${id}`);

// Blog Articles
export const getBlogArticles = () => api.get('/public/blog/list');
export const getBlogArticleBySlug = (slug: string) => api.get(`/public/blog/details/${slug}`);
export const getAdminBlogArticles = () => api.get('/admin/blog');
export const createBlogArticle = (data: any) => api.post('/admin/blog/create', data);
export const updateBlogArticle = (id: string, data: any) => api.put(`/admin/blog/update/${id}`, data);
export const deleteBlogArticle = (id: string) => api.delete(`/admin/blog/delete/${id}`);

// Promo Banners
export const getPromoBanners = (params?: any) => api.get('/public/promo-banners/list', { params });
export const getAdminPromoBanners = () => api.get('/admin/promo-banners');
export const createPromoBanner = (data: any) => api.post('/admin/promo-banners/create', data);
export const updatePromoBanner = (id: string, data: any) => api.put(`/admin/promo-banners/update/${id}`, data);
export const deletePromoBanner = (id: string) => api.delete(`/admin/promo-banners/delete/${id}`);

// Popular Links
export const getPopularLinks = () => api.get('/public/popular-links/list');
export const getAdminPopularLinks = () => api.get('/admin/popular-links');
export const createPopularLink = (data: any) => api.post('/admin/popular-links/create', data);
export const updatePopularLink = (id: string, data: any) => api.put(`/admin/popular-links/update/${id}`, data);
export const deletePopularLink = (id: string) => api.delete(`/admin/popular-links/delete/${id}`);

// Banners (Hero Carousel)
export const createBanner = (data: any) => api.post('/admin/banner/create', data);
export const updateBanner = (id: string, data: any) => api.put(`/admin/banner/update/${id}`, data);
export const deleteBanner = (id: string) => api.delete(`/admin/banner/delete/${id}`);

// Pages
export const getAllPages = () => api.get('/admin/pages');
export const createPage = (data: any) => api.post('/admin/pages/create', data);
export const updatePage = (pageName: string, data: any) => api.put(`/admin/pages/${pageName}/update`, data);
export const deletePage = (id: string) => api.delete(`/admin/pages/${id}`);

// Categories
export const createCategory = (data: any) => api.post('/admin/categories/create', data);
export const updateCategory = (id: string, data: any) => api.put(`/admin/categories/update/${id}`, data);
export const deleteCategory = (id: string) => api.delete(`/admin/categories/delete/${id}`);

// Popular Stores
export const createPopularStore = (data: any) => api.post('/admin/popular-stores/create', data);
export const updatePopularStore = (id: string, data: any) => api.put(`/admin/popular-stores/update/${id}`, data);
export const deletePopularStore = (id: string) => api.delete(`/admin/popular-stores/delete/${id}`);

// Featured Coupons
export const createFeaturedCoupon = (data: any) => api.post('/admin/featured-coupons/create', data);
export const updateFeaturedCoupon = (id: string, data: any) => api.put(`/admin/featured-coupons/update/${id}`, data);
export const deleteFeaturedCoupon = (id: string) => api.delete(`/admin/featured-coupons/delete/${id}`);

// Footer
export const getFooter = () => api.get('/admin/footer');
export const getAllFooterLinksAdmin = () => api.get('/admin/footer');
export const createFooterLink = (data: any) => api.post('/admin/footer/create', data);
export const updateFooterLink = (id: string, data: any) => api.put(`/admin/footer/${id}`, data);
export const deleteFooterLink = (id: string) => api.delete(`/admin/footer/${id}`);

// Tags
export const getTags = () => api.get('/public/tags/list');
export const createTag = (data: any) => api.post('/admin/tags/create', data);
export const updateTag = (id: string, data: any) => api.put(`/admin/tags/update/${id}`, data);
export const deleteTag = (id: string) => api.delete(`/admin/tags/delete/${id}`);

// Upload
export const uploadLogo = (file: File, logoType?: string) => {
  const formData = new FormData();
  formData.append('logo', file);
  if (logoType) formData.append('logoType', logoType);
  return api.post('/admin/upload/logo', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};
export const uploadBannerImage = (file: File) => uploadLogo(file, 'banner');

// Bulk Delete
export const bulkDeleteStores = (ids: string[]) => api.post('/admin/stores/bulk-delete', { ids });
export const bulkDeleteCoupons = (ids: string[]) => api.post('/admin/coupons/bulk-delete', { ids });
export const bulkDeleteDeals = (ids: string[]) => api.post('/admin/deals/bulk-delete', { ids });
export const bulkDeleteBanners = (ids: string[]) => api.post('/admin/banner/bulk-delete', { ids });
export const bulkDeleteTags = (ids: string[]) => api.post('/admin/tags/bulk-delete', { ids });
export const bulkDeleteBlogArticles = (ids: string[]) => api.post('/admin/blog/bulk-delete', { ids });
export const bulkDeleteCategories = (ids: string[]) => api.post('/admin/categories/bulk-delete', { ids });

// Auth
export const adminLogin = (data: { email: string; password: string }) => api.post('/auth/login', data);
export const adminVerify = () => api.get('/auth/verify');

export default api;
