import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface UserState {
  jwtToken: string | null;
  refreshToken: string | null;
  email: string | null;
  photo: string | null;
  userName: string | null;
}

export type PayloadSetToken = {
  jwtToken: string;
  refreshToken: string;
  email: string;
  userName: string
};

export type PayloadPhoto = {
  LogoPerfil: string;
  NombreCompleto?: string;
};

const initialState: UserState = {
  jwtToken: null,
  refreshToken: null,
  email: null,
  photo: null,
  userName: null,
};

const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<PayloadSetToken>) {
      state.jwtToken = action.payload.jwtToken;
      state.refreshToken = action.payload.refreshToken;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
    },
    setPhoto(state, action: PayloadAction<PayloadPhoto>) {
      state.photo = action.payload.LogoPerfil;
    },
    setInfo(state, action: PayloadAction<PayloadPhoto>) {
      state.photo = action.payload.LogoPerfil;
      state.userName = action.payload.NombreCompleto ?? '';
    },
    logout(state, action: PayloadAction) {
      state.email = null;
      state.jwtToken = null;
      state.refreshToken = null;
    },
  },
});

export const {setToken, setPhoto, setInfo, logout} = userSlide.actions;
export default userSlide.reducer;
