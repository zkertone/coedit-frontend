import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Token {
    accessToken: string;
}

interface AuthState {
    // userId: string | null;
    token: Token | null;
}

const initialState: AuthState = {
    // userId: null,
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: Token }>) => {
            // state.userId = action.payload.userId;
            state.token = action.payload.token;
        },
        logout: (state) => {
            // state.userId = null;
            state.token = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer; 