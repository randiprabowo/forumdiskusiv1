import { createSlice } from '@reduxjs/toolkit';
import { voteThread } from './threadsSlice';
import { voteComment } from './commentsSlice';

const initialState = {
  loading: false,
  error: null,
  optimisticUpdates: [],
};

const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    // For optimistic updates
    addOptimisticUpdate: (state, action) => {
      state.optimisticUpdates.push(action.payload);
    },
    removeOptimisticUpdate: (state, action) => {
      const { id, type } = action.payload;
      state.optimisticUpdates = state.optimisticUpdates.filter(
        (update) => !(update.id === id && update.type === type),
      );
    },
    clearVotesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(voteThread.pending, (state) => {
        state.loading = true;
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        state.loading = false;
        // Remove optimistic update when vote is successful
        // For thread votes, we need to get the id from the action payload
        // The API returns the thread object with id
        const { id } = action.payload;
        state.optimisticUpdates = state.optimisticUpdates.filter(
          (update) => !(update.id === id && update.type === 'thread'),
        );
      })
      .addCase(voteThread.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(voteComment.pending, (state) => {
        state.loading = true;
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        state.loading = false;
        // Remove optimistic update when vote is successful
        // For comment votes, we need to get the commentId from the action payload
        // The API returns the comment object with id
        const { id } = action.payload;
        state.optimisticUpdates = state.optimisticUpdates.filter(
          (update) => !(update.id === id && update.type === 'comment'),
        );
      })
      .addCase(voteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addOptimisticUpdate, removeOptimisticUpdate, clearVotesError } = votesSlice.actions;
export default votesSlice.reducer;
