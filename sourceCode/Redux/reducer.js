// reducer.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  images: null,
};
const sliceReducer = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setImages(state, action) {
      state.images = action.payload;
    },
  },
});

export const {setLoading, setImages} = sliceReducer.actions;
export default sliceReducer.reducer;
