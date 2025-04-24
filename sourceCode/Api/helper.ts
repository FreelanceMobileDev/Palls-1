// login.js

import {apiClient, apiClientUpload} from './api';
import {
  BASE_URL,
  SEND_OTP,
  POST_METHOD,
  VERIFY_OTP,
  REGISTER_USER,
  GET_METHOD,
  CATEGORY,
  SUB_CATEGORY,
  UPLOAD_IMAGE,
  CREATE_WORK,
  GET_WORK,
} from './url';

export const sendOtp = payload => {
  return apiClient({
    baseURL: BASE_URL,
    method: POST_METHOD,
    url: SEND_OTP,
    data: payload,
  });
};

export const VerifyOtp = payload => {
  return apiClient({
    baseURL: BASE_URL,
    method: POST_METHOD,
    url: `${VERIFY_OTP}`,
    data: payload,
  });
};

export const Category = () => {
  return apiClient({
    baseURL: BASE_URL,
    method: GET_METHOD,
    url: `${CATEGORY}`,
  });
};

export const SubCategory = categoryId => {
  return apiClient({
    baseURL: BASE_URL,
    method: GET_METHOD,
    url: `${SUB_CATEGORY}?category_Id=${categoryId}`,
  });
};

export const userRegister = payload => {
  return apiClient({
    baseURL: BASE_URL,
    method: POST_METHOD,
    url: `${REGISTER_USER}`,
    data: payload,
  });
};

export const imageUpload = payload => {
  return apiClientUpload({
    baseURL: BASE_URL,
    method: POST_METHOD,
    url: UPLOAD_IMAGE,
    data: payload,
  });
};

export const createWork = payload => {
  return apiClient({
    baseURL: BASE_URL,
    method: POST_METHOD,
    url: `${CREATE_WORK}`,
    data: payload,
  });
};

export const getWork = userId => {
  console.log(userId,'========userId=====>>>>>>=======>>>>>>');
  
  return apiClient({
    baseURL: BASE_URL,
    method: GET_METHOD,
    url: `${GET_WORK}?id=${userId}`,
  });
};
