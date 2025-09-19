import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegComment } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar';
import { voteThread } from '../features/threadsSlice';
import { addOptimisticUpdate, removeOptimisticUpdate } from '../features/votesSlice';

function ThreadCard({ thread }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { optimisticUpdates } = useSelector((state) => state.votes);

  const {
    id, title, body, category, createdAt, owner, upVotesBy, downVotesBy, totalComments,
  } = thread;

  const isUpVoted = user && upVotesBy ? upVotesBy.includes(user.id) : false;
  const isDownVoted = user && downVotesBy ? downVotesBy.includes(user.id) : false;

  // Check for optimistic updates
  const optimisticUpdate = optimisticUpdates.find(
    (update) => update.id === (id || '') && update.type === 'thread',
  );

  const displayUpVoted = optimisticUpdate ? optimisticUpdate.isUpVoted : isUpVoted;
  const displayDownVoted = optimisticUpdate ? optimisticUpdate.isDownVoted : isDownVoted;

  const handleVote = (voteType) => {
    if (!user) {
      // Redirect to login if not authenticated
      return;
    }

    // Determine the new vote state for optimistic update
    let newUpVoted = isUpVoted;
    let newDownVoted = isDownVoted;

    if (voteType === 'up') {
      newUpVoted = !isUpVoted;
      newDownVoted = false; // Cancel down vote if exists
    } else if (voteType === 'down') {
      newDownVoted = !isDownVoted;
      newUpVoted = false; // Cancel up vote if exists
    } else {
      // neutral vote (cancel both)
      newUpVoted = false;
      newDownVoted = false;
    }

    // Apply optimistic update
    dispatch(addOptimisticUpdate({
      id: id || '',
      type: 'thread',
      isUpVoted: newUpVoted,
      isDownVoted: newDownVoted,
    }));

    // Dispatch the actual vote action
    const dispatched = dispatch(voteThread({ threadId: id || '', voteType }));
    // Support both real thunk result (with unwrap) and mocked dispatch (plain function)
    if (dispatched && typeof dispatched.unwrap === 'function') {
      dispatched.unwrap().catch(() => {
        dispatch(removeOptimisticUpdate({ id: id || '', type: 'thread' }));
      });
    } else if (dispatched && typeof dispatched.then === 'function') {
      dispatched.catch(() => {
        dispatch(removeOptimisticUpdate({ id: id || '', type: 'thread' }));
      });
    }
  };

  // Format the body to show only a preview
  const bodyPreview = body && body.length > 150 ? `${body.substring(0, 150)}...` : (body || '');

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform hover:-translate-y-1">
      <div className="flex items-center mb-3">
        <div className="relative">
          <Avatar src={owner?.avatar} alt={owner?.name} size="sm" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{owner?.name}</p>
          <p className="text-xs text-gray-500">
            {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Unknown time'}
          </p>
        </div>
      </div>

      <Link to={`/threads/${id || ''}`} className="block group">
        <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{title || 'Untitled'}</h2>
        
        {category && (
          <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-3 py-1 rounded-full mb-3 shadow-sm">
            #{category}
          </span>
        )}

        <p className="text-gray-700 mb-4 leading-relaxed">{bodyPreview}</p>
      </Link>

      <div className="flex flex-wrap items-center text-gray-600 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => handleVote('up')}
          className={`flex items-center mr-4 ${displayUpVoted ? 'text-blue-600' : 'hover:text-blue-600'}`}
          aria-label="upvote"
          data-testid="upvote-button"
        >
          {displayUpVoted ? <FaThumbsUp className="mr-1" /> : <FaRegThumbsUp className="mr-1" />}
          <span data-testid="upvote-count">{upVotesBy?.length || 0}</span>
        </button>
        <button
          type="button"
          onClick={() => handleVote('down')}
          className={`flex items-center mr-4 ${displayDownVoted ? 'text-red-600' : 'hover:text-red-600'}`}
          aria-label="downvote"
          data-testid="downvote-button"
        >
          {displayDownVoted ? <FaThumbsDown className="mr-1" /> : <FaRegThumbsDown className="mr-1" />}
          <span data-testid="downvote-count">{downVotesBy?.length || 0}</span>
        </button>
        <button
          type="button"
          onClick={() => navigate(`/threads/${id || ''}`)}
          className="flex items-center hover:text-blue-600 cursor-pointer"
        >
          <FaRegComment className="mr-1" />
          <span>{totalComments || 0}</span>
        </button>
      </div>
    </div>
  );
}

export default ThreadCard;