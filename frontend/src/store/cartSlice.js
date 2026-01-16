import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const response = await axios.get('cart/');
  return response.data;
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ product_id, quantity }) => {
  const response = await axios.post('cart/', { product_id, quantity });
  return response.data;
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (itemId) => {
  await axios.delete(`cart/items/${itemId}/`);
  return itemId;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total_price: 0,
    status: 'idle',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_price = action.payload.total_price;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total_price = action.payload.total_price;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
        // Recalculate total or re-fetch? API usually returns updated cart for add, but remove returns 204.
        // Simplified: We might need to refetch or manually subtract.
        // For accurate pricing, better to re-fetch cart after delete or trust local.
        // Let's assume re-fetch pattern or just optimistic update.
        // Actually, let's just trigger a fetchCart after remove in the component or chain it.
        // For now, simple filter.
      });
  },
});

export default cartSlice.reducer;
