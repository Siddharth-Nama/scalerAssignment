import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await axios.post('users/login/', credentials);
    localStorage.setItem('token', response.data.access);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.detail || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await axios.post('users/register/', userData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      // axios.defaults.headers.common['Authorization'] = null; // Handled by interceptor
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    checkAuth: (state) => {
        const token = localStorage.getItem('token');
        if (token) {
            state.isAuthenticated = true;
            state.token = token;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.token = action.payload.access;
        // Ideally fetch user profile here
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state) => {
          // Auto login? or just redirect. Let's assume redirect.
          state.status = 'succeeded';
      });
  },
});

export const { logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
