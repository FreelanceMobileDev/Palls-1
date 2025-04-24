import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from 'redux'; 
import { configureStore } from '@reduxjs/toolkit'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import cookiesReducer from './cookiesReducer';
import sliceReducer from './reducer'; 

const rootReducer = combineReducers({
  
  sliceReducer:sliceReducer, 
  cookies: cookiesReducer,
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['cookies'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
    reducer: persistedReducer,
   
});

export const persistor = persistStore(Store);
export default Store;
