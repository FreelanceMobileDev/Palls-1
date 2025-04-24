import axios from 'axios';
import store from '../Redux/store';
import {setLoading} from '../Redux/reducer';
import {ShowToast} from './ToastService';

// Common axios instance
export const apiClient = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Axios instance for uploads
export const apiClientUpload = axios.create({
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  config => {
    const state = store.getState();

    store.dispatch(setLoading(true));
    const token = state?.cookies?.headertoken?.token;
    // console.log(token)
    const isNetworkConnected = state.sliceReducer.isNetworkConnected;

    // if (!isNetworkConnected) {
    //     Alert.alert("Please check your Internet Connection");
    //     store.dispatch(setLoading(false));
    //     return Promise.reject(new Error("No network connection"));
    // }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  },
);

// Response interceptor
apiClient.interceptors.response.use(
  response => {
    store.dispatch(setLoading(false));
    return response;
  },
  async error => {
    store.dispatch(setLoading(false));
    const {response} = error;
    if (response) {
      console.log('Error Response:', response); // Log the error response for debugging
      const errorMessage = response.data.message || 'An error occurred';
      console.log(errorMessage, 'errorMessage======>');
      ShowToast(errorMessage);
      store.dispatch(setError(errorMessage));
    } else {
      ShowToast('Network error. Please try again.');
    }
    return Promise.reject(error);
  },
);

// Upload request interceptor
apiClientUpload.interceptors.request.use(
  config => {
    const state = store.getState();
    const token = state?.cookies?.headertoken?.data?.token;
    console.log('Upload Token:', token); // Log the token for debugging
    store.dispatch(setLoading(true));

    if (token) {
      config.headers['Authorization'] = `${token}`;
    }

    return config;
  },
  error => {
    store.dispatch(setLoading(false));
    return Promise.reject(error);
  },
);
