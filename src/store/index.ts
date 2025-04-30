import { configureStore } from '@reduxjs/toolkit';
import idolReducer from './slices/idolSlice';
import walletReducer from './slices/walletSlice';
import agentReducer from './slices/agentSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    idol: idolReducer,
    wallet: walletReducer,
    agent: agentReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['wallet/setProvider'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.provider', 'meta.arg.provider'],
        // Ignore these paths in the state
        ignoredPaths: ['wallet.provider'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 