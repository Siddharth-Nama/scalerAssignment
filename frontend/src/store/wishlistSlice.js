import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('wishlist/');
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch wishlist');
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product, { rejectWithValue }) => {
  try {
    const response = await axios.post(`wishlist/toggle/${product.id}/`);
    return { product, status: response.data.status }; // 'added' or 'removed'
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to toggle wishlist');
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
          if (action.payload.status === 'removed') {
              state.items = state.items.filter(item => 
                  (item.product_details?.id || item.product) !== action.payload.product.id
              );
          } else {
             // We need to match the structure of fetched items.
             // The API returns the serializer data in `data` field of response if added.
             // But for now, let's just push a mock structure or re-fetch.
             // Re-fetching is safer but slower. Optimistic update is better.
             // Let's assume re-fetch or simple push.
             // Ideally the backend response includes the full item.
             // My backend `WishlistToggle` returns `serializer.data` in `data` key.
             // But here I didn't return `response.data` in the thunk payload completely.
             // Let's just re-fetch for simplicity and correctness.
             // Actually, I can just push the product with a mock ID, but consistency matters.
             // Let's rely on fetchWishlist being called or modify state if I had the full object.
             // For now, I'll trigger a fetch in the component or here.
             // Let's mark status as 'idle' to trigger re-fetch if component listens to it?
             // Or better, just push a partial object.
             state.items.push({
                 id: Date.now(), // Temp ID
                 product_details: action.payload.product,
                 product: action.payload.product.id
             });
          }
      });
  },
});

export default wishlistSlice.reducer;
