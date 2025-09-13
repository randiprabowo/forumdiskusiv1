import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import threadsReducer from './threadsSlice';
import commentsReducer from './commentsSlice';
import votesReducer from './votesSlice';
import leaderboardReducer from './leaderboardSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    threads: threadsReducer,
    comments: commentsReducer,
    votes: votesReducer,
    leaderboard: leaderboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
