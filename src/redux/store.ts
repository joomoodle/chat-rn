import {configureStore} from '@reduxjs/toolkit';
import {persistReducer, persistStore} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from './rootReducer';
import {UserState} from './slice/userSlice';

interface RootState {
  user: UserState;
}

const persistConfig = {
  key: 'root-app-multibank',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type {RootState};
