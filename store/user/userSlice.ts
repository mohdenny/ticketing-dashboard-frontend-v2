// store/user/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definisi struktur data user
interface UserData {
  email: string;
  role: 'admin' | 'user' | null;
}

// Initial state awal: data user kosong
interface UserState {
  data: UserData | null;
}

const initialState: UserState = {
  data: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Reducer untuk menyimpan data user setelah login
    setUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
    },
    // Reducer untuk mengosongkan data saat logout
    logout: (state) => {
      state.data = null;
    },
  },
});

// Export action dan reducer
export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
