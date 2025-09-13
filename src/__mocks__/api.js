import { vi } from 'vitest';

// Mock for api.js
const api = {
  create: vi.fn().mockReturnValue({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  }),
};

export default api;