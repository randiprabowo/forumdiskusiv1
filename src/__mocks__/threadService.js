import { vi } from 'vitest';

// Mock for threadService.js
const threadService = {
  getAllThreads: vi.fn(),
  getThreadDetail: vi.fn(),
  createThread: vi.fn(),
  voteThread: vi.fn(),
};

export default threadService;