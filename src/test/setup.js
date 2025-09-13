import { expect, afterEach, beforeAll, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom';
import { setupServer } from 'msw/node';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock axios
vi.mock('axios', () => ({
  default: {
    create: vi.fn().mockReturnValue({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    }),
  },
}));

// Mock threadService
vi.mock('../services/threadService', () => ({
  __esModule: true,
  default: {
    getAllThreads: vi.fn(),
    getThreadDetail: vi.fn(),
    createThread: vi.fn(),
    voteThread: vi.fn(),
  },
}), { virtual: true });

// Create MSW server for API mocking
export const server = setupServer();

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());