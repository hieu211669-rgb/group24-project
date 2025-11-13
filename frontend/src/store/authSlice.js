import { createSlice } from '@reduxjs/toolkit';

// Lấy token từ localStorage nếu có
const token = localStorage.getItem('token');

const initialState = {
  user: token ? { token } : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // action.payload = { token, ... }
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('token');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
