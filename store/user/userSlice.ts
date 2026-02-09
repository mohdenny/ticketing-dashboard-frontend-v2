import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

export interface UserData {
  id: number | string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

interface UserState {
  data: UserData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  data: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Bersihkan error setiap kali loading dimulai (Implicit Reset)
    setLoading: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    // Simpan data user dan set status ke succeeded
    setUser: (state, action: PayloadAction<UserData | null>) => {
      state.data = action.payload;
      state.status = action.payload ? 'succeeded' : 'idle';
      state.error = null;
    },
    // Simpan pesan error untuk ditampilkan di UI Material Design 3 (Error State)
    setError: (state, action: PayloadAction<string>) => {
      state.status = 'failed';
      state.error = action.payload;
    },
    // Reset total saat logout
    logout: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const selectUser = (state: RootState) => state.user.data;
export const selectIsAdmin = (state: RootState) =>
  state.user.data?.role === 'admin';
export const selectAuthStatus = (state: RootState) => state.user.status;
export const selectAuthError = (state: RootState) => state.user.error;

export const { setUser, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
