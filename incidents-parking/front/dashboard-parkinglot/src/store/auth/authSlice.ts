import { Company, UserState } from "@/interfaces/auth";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: UserState | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    refreshCompany: (state, action: PayloadAction<Company>) => {
      if (state.user) {
        state.user.info = action.payload;
      }
      state.isLoading = false;
      state.error = null;
    },
    refreshUser: (state, action: PayloadAction<UserState>) => {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    },
    logoutUser: () => {
      return initialState;
    },
  },
});

export const {
  startAuth,
  loginSuccess,
  refreshUser,
  refreshCompany,
  loginFailure,
  logoutUser,
} = authSlice.actions;
export default authSlice.reducer;
