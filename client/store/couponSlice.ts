import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCoupons, getCouponById } from '@/services/api';

interface Coupon {
  _id: string;
  title: string;
  code?: string;
  description?: string;
  discount?: string;
  store: any;
  category?: any;
  expiryDate?: string;
  clickCount: number;
  isFeatured: boolean;
}

interface CouponState {
  coupons: Coupon[];
  loading: boolean;
  error: string | null;
}

const initialState: CouponState = {
  coupons: [],
  loading: false,
  error: null,
};

export const fetchCoupons = createAsyncThunk('coupons/fetchCoupons', async (params?: any) => {
  const response = await getCoupons(params);
  return response.data;
});

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoupons.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false;
        state.coupons = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch coupons';
      });
  },
});

export default couponSlice.reducer;
