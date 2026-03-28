import { configureStore } from '@reduxjs/toolkit';
import couponReducer from './couponSlice';
import storeReducer from './storeSlice';

export const store = configureStore({
  reducer: {
    coupons: couponReducer,
    stores: storeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
