import { createSlice } from '@reduxjs/toolkit';

const state = {
  userId: null,
  login: null,
  email: null,
  avatar: null,
  stateChange: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: state,

  reducers: {
    updateUserProfile: (state, { payload }) => ({
      ...state,
      userId: payload.userId,
      login: payload.login,
      email: payload.email,
      avatar: payload.avatar
    }),

    authStateChange: (state, { payload }) => ({
      ...state,
      stateChange: payload.stateChange,
    }),
    
    authSignOut: () => state,
  },
});

export const authReducer = authSlice.reducer;
export const authActions = authSlice.actions;