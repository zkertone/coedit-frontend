import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Token {
    accessToken: string;
}

interface AuthState {
    token: Token | null;
}

const initialState: AuthState = {
    token: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<{ token: Token }>) => {
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.token = null;
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer; 