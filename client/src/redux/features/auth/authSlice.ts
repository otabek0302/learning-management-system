import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types/user";

interface AuthState {
    token: string | null;
    user: User | null;
}

const initialState: AuthState = {
    token: null,
    user: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action: PayloadAction<{ token: string }>) => {
            state.token = action.payload.token;
        },
        userLoggedIn: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        userLoggedOut: (state) => {
            state.token = null;
            state.user = null;
        }
    }
})

export const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice;