import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import runReducer from './runSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    run: runReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serialization warnings
        ignoredActions: ['run/addLocation'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
