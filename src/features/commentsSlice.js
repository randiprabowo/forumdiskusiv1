import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import commentService from '../services/commentService';

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ threadId, content }, { rejectWithValue }) => {
    try {
      return await commentService.createComment(threadId, content);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
    }
  },
);

export const voteComment = createAsyncThunk(
  'comments/voteComment',
  async ({ threadId, commentId, voteType }, { rejectWithValue }) => {
    try {
      return await commentService.voteComment(threadId, commentId, voteType);
    } catch (error) {
      if (error.message) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to vote comment');
    }
  },
);

const initialState = {
  loading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Vote comment
      .addCase(voteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voteComment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(voteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCommentsError } = commentsSlice.actions;
export default commentsSlice.reducer;
