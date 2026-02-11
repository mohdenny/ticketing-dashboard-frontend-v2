import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// 1. Blueprint data user dari Database/API
export interface UserData {
  id: number;
  name: string;
  email?: string; // Tambahan: Opsional email
}

// 2. State: Representasi memori aplikasi saat berjalan
interface UserState {
  data: UserData | null; // Hilir Utama: Data user yang sedang aktif
  loading: boolean; // Status: Apakah sedang menunggu respon server?
  error: string | null; // Pesan: Apa yang salah jika request gagal?
}

// 3. Kondisi Awal: Saat aplikasi baru pertama kali dibuka
const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

// 4. Slice: Mesin pengubah state (Mutasi yang aman dengan Immer.js bawaan RTK)
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action A: Menyalakan indikator loading (Pintu Masuk Proses)
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action B: Simpan data ke memori setelah sukses dari API
    saveUser: (state, action: PayloadAction<UserData>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Action C: Tangkap pesan error jika server bermasalah
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Action D: Reset total (Clear Session)
    clearUser: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
});

// 5. Selectors: Jalur pipa untuk mengambil data (Hilir)
// Best Practice: Gunakan selector agar komponen tidak perlu tahu struktur state yang dalam
export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export const { startLoading, saveUser, setError, clearUser } =
  userSlice.actions;
export default userSlice.reducer;
