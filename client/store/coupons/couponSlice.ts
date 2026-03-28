import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { couponService } from '../../services/coupons/coupon.service';

// ==========================================
// COUPON REDUX SLICE
// ==========================================

interface Coupon {
  _id: string;
  title: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  store: string;
  category: string;
  expiryDate: string;
  isActive: boolean;
  clickCount: number;
}

interface CouponState {
  coupons: Coupon[];
  trendingCoupons: Coupon[];
  currentCoupon: Coupon | null;
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  trendingCoupons: [],
  currentCoupon: null,
  loading: false,
  error: null,
};

// Async thunks for API calls
export const fetchCoupons = createAsyncThunk(
  'coupons/fetchCoupons',
  async (filters = {}) => {
    const response = await couponService.public.getCoupons(filters);
    return response;
  }
);

export const fetchTrendingCoupons = createAsyncThunk(
  'coupons/fetchTrendingCoupons',
  async () => {
    const response = await couponService.public.getTrendingCoupons();
    return response;
  }
);

export const searchCoupons = createAsyncThunk(
  'coupons/searchCoupons',
  async (query: string) => {
    const response = await couponService.public.searchCoupons(query);
    return response;
  }
);

export const revealCoupon = createAsyncThunk(
  'coupons/revealCoupon',
  async (id: string) => {
    const response = await couponService.public.revealCoupon(id);
    return response;
  }
);

export const trackCouponClick = createAsyncThunk(
  'coupons/trackClick',
  async (id: string) => {
    const response = await couponService.public.trackClick(id);
    return response;
  }
);

export const createCoupon = createAsyncThunk(
  'coupons/createCoupon',
  async ({ couponData, token }: { couponData: any; token: string }) => {
    const response = await couponService.admin.createCoupon(couponData, token);
    return response;
  }
);

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCoupon: (state, action) => {
      state.currentCoupon = action.payload;
    },
    clearCurrentCoupon: (state) => {
      state.currentCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch coupons
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      })
      // Fetch trending coupons
      .addCase(fetchTrendingCoupons.fulfilled, (state, action) => {
        state.trendingCoupons = action.payload;
      })
      // Search coupons
      .addCase(searchCoupons.fulfilled, (state, action) => {
        state.coupons = action.payload;
      });
  },
});

export const { clearError, setCurrentCoupon, clearCurrentCoupon } = couponSlice.actions;
export default couponSlice.reducer;