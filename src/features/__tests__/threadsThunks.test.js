import { describe, it, expect, vi, beforeEach } from 'vitest';
import { voteThread, fetchThreads } from '../threadsSlice';

// Create mock threadService
const mockThreadService = {
  voteThread: vi.fn(),
  getAllThreads: vi.fn(),
};

// Mock the threadService module
vi.mock('../../services/threadService', () => ({
  __esModule: true,
  default: mockThreadService,
}), { virtual: true });

describe('Threads Thunks', () => {
  let dispatch;
  let getState;

  beforeEach(() => {
    dispatch = vi.fn();
    getState = vi.fn();
    vi.clearAllMocks();
  });

  describe('voteThread', () => {
    it('should call threadService.voteThread with correct parameters for upvote', async () => {
      const threadId = 'thread-1';
      const voteType = 'up';
      mockThreadService.voteThread.mockResolvedValue({ id: threadId, upVotesBy: ['user-1'] });

      await voteThread({ threadId, voteType })(dispatch, getState);

      expect(mockThreadService.voteThread).toHaveBeenCalledWith(threadId, voteType);
    });

    it('should call threadService.voteThread with correct parameters for downvote', async () => {
      const threadId = 'thread-1';
      const voteType = 'down';
      mockThreadService.voteThread.mockResolvedValue({ id: threadId, downVotesBy: ['user-1'] });

      await voteThread({ threadId, voteType })(dispatch, getState);

      expect(mockThreadService.voteThread).toHaveBeenCalledWith(threadId, voteType);
    });

    it('should handle error with message', async () => {
      const threadId = 'thread-1';
      const voteType = 'up';
      const errorMessage = 'Error voting thread';
      mockThreadService.voteThread.mockRejectedValue(new Error(errorMessage));

      const result = await voteThread({ threadId, voteType })(dispatch, getState);

      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });

    it('should handle error without message', async () => {
      const threadId = 'thread-1';
      const voteType = 'up';
      mockThreadService.voteThread.mockRejectedValue(new Error());

      const result = await voteThread({ threadId, voteType })(dispatch, getState);

      expect(result.payload).toBe('Failed to vote thread');
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });

  describe('fetchThreads', () => {
    it('should call threadService.getAllThreads', async () => {
      const threads = [{ id: 'thread-1', title: 'Thread 1' }];
      mockThreadService.getAllThreads.mockResolvedValue(threads);

      await fetchThreads()(dispatch, getState);

      expect(mockThreadService.getAllThreads).toHaveBeenCalled();
    });

    it('should handle error', async () => {
      const errorMessage = 'Error fetching threads';
      mockThreadService.getAllThreads.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const result = await fetchThreads()(dispatch, getState);

      expect(result.payload).toBe(errorMessage);
      expect(result.meta.requestStatus).toBe('rejected');
    });
  });
});