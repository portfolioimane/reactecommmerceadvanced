// src/store/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../axiosInstance';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    itemCount: 0,
  },
  reducers: {
    setCartItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
    incrementCartItemCount: (state, action) => {
      state.itemCount += action.payload;
    },
    decrementCartItemCount: (state, action) => {
      state.itemCount -= action.payload;
    },
  },
});

export const { setCartItemCount, incrementCartItemCount, decrementCartItemCount } = cartSlice.actions;

export const fetchCartItemCount = () => async (dispatch) => {
  try {
    const response = await axiosInstance.get('api/cart/count');
    dispatch(setCartItemCount(response.data.count));
  } catch (error) {
    console.error('Error fetching cart item count:', error);
  }
};

export default cartSlice.reducer;
