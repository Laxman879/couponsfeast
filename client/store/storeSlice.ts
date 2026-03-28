import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStores } from '@/services/api';

interface Store {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
}

interface StoreState {
  stores: Store[];
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  loading: false,
  error: null,
};

export const fetchStores = createAsyncThunk('stores/fetchStores', async () => {
  const response = await getStores();
  return response.data;
});

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stores';
      });
  },
});

export default storeSlice.reducer;
