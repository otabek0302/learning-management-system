import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../types/auth';

interface AuthState {
  token: string | null;
  user: IUser | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (state, action: PayloadAction<{ token: string; user: IUser | null }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;
    },
    tokenRefreshed: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut, tokenRefreshed } = authSlice.actions;

export default authSlice;
