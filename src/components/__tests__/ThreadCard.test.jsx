import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import ThreadCard from '../ThreadCard';

// Mock all dependencies
vi.mock('@reduxjs/toolkit', () => ({
  createAsyncThunk: (type, payloadCreator) => {
    const actionCreator = (...args) => ({
      type,
      payload: args[0],
    });
    actionCreator.pending = `${type}/pending`;
    actionCreator.fulfilled = `${type}/fulfilled`;
    actionCreator.rejected = `${type}/rejected`;
    return actionCreator;
  },
}));

vi.mock('../../features/threadsSlice', () => ({
  voteThread: vi.fn().mockImplementation((data) => ({
    type: 'threads/voteThread',
    payload: data,
  })),
}));

vi.mock('../../features/votesSlice', () => ({
  addOptimisticUpdate: vi.fn(),
  removeOptimisticUpdate: vi.fn(),
}));

// Mock react-redux
const mockDispatch = vi.fn();
vi.mock('react-redux', () => ({
  useSelector: vi.fn((selector) => {
    const state = {
      auth: {
        user: { id: 'user-1', name: 'John Doe' },
      },
      votes: {
        optimisticUpdates: [],
      },
    };
    return selector(state);
  }),
  useDispatch: () => mockDispatch,
  Provider: ({ children }) => children,
}));

describe('ThreadCard Component', () => {
  // Skenario pengujian: Komponen ThreadCard dapat menampilkan data thread dan melakukan voting
  
  const mockThread = {
    id: 'thread-1',
    title: 'Thread Title',
    body: 'Thread body content',
    category: 'general',
    createdAt: '2023-01-01T00:00:00.000Z',
    upVotesBy: ['user-2'],
    downVotesBy: [],
    totalComments: 2,
    owner: {
      id: 'user-2',
      name: 'Jane Doe',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=random',
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render thread information correctly', () => {
    render(
      <BrowserRouter>
        <ThreadCard thread={mockThread} />
      </BrowserRouter>,
    );

    // Check if thread information is displayed
    expect(screen.getByText(mockThread.title)).toBeInTheDocument();
    expect(screen.getByText(/#general/)).toBeInTheDocument();
    expect(screen.getByText(mockThread.owner.name)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // Check for comment count
  });

  it('should handle upvote when user clicks upvote button', async () => {
    mockDispatch.mockClear();

    render(
      <BrowserRouter>
        <ThreadCard thread={mockThread} />
      </BrowserRouter>,
    );

    // Find and click upvote button
    const upvoteButton = screen.getByLabelText('upvote');
    await fireEvent.click(upvoteButton);

    // Check if dispatch was called
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('should handle downvote when user clicks downvote button', async () => {
    mockDispatch.mockClear();

    render(
      <BrowserRouter>
        <ThreadCard thread={mockThread} />
      </BrowserRouter>,
    );

    // Find and click downvote button
    const downvoteButton = screen.getByLabelText('downvote');
    await fireEvent.click(downvoteButton);

    // Check if dispatch was called
    expect(mockDispatch).toHaveBeenCalled();
  });
});