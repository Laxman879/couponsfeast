import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { storeService } from '../../services/stores/store.service';

interface Store {
  _id: string;
  storeName: string;
  slug: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
}

interface StoreState {
  stores: Store[];
  currentStore: Store | null;
  loading: boolean;
  error: string | null;
}

const initialState: StoreState = {
  stores: [],
  currentStore: null,
  loading: false,
  error: null,
};

export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async () => {
    const response = await storeService.public.getStores();
    return response;
  }
);

export const fetchStoreBySlug = createAsyncThunk(
  'stores/fetchStoreBySlug',
  async (slug: string) => {
    const response = await storeService.public.getStoreBySlug(slug);
    return response;
  }
);

export const createStore = createAsyncThunk(
  'stores/createStore',
  async ({ storeData, token }: { storeData: any; token: string }) => {
    const response = await storeService.admin.createStore(storeData, token);
    return response;
  }
);

const storeSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStore: (state, action) => {
      state.currentStore = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stores';
      })
      .addCase(fetchStoreBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchStoreBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch store';
      });
  },
});

export const { clearError, setCurrentStore } = storeSlice.actions;
export default storeSlice.reducer;
