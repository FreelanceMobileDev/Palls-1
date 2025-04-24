import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  logindata:{},
  images :null,
  categeroies:null

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

  },
});

export const {setLoginData,  setImages,setCategeroies} = cookies.actions;
export default cookies.reducer;
