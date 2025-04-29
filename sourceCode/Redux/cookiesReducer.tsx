import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  logindata: {},
  images: null,
  categeroies: null,
  work: null
};

const cookies = createSlice({
  name: 'cookies',
  initialState,
  reducers: {
    setLoginData(state, action) {
      state.logindata = action.payload;
    },
    setImages(state, action) {
      state.images = action.payload;
    },
    setCategeroies(state, action) {
      state.categeroies = action.payload;
    },
    setWork(state, action) {
      state.work = action.payload;
    }
  }
});

export const { setLoginData, setImages, setCategeroies, setWork } = cookies.actions;
export default cookies.reducer;
