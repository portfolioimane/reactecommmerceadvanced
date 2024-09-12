// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import cartReducer from './cartSlice';


export const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authReducer,
    },
});