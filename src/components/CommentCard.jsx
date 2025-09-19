import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import Avatar from './Avatar';
import { voteComment } from '../features/commentsSlice';
import { addOptimisticUpdate, removeOptimisticUpdate } from '../features/votesSlice';

function CommentCard({ comment, threadId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { optimisticUpdates } = useSelector((state) => state.votes);

  const {
    id, content, createdAt, owner, upVotesBy, downVotesBy,
  } = comment;

  const isUpVoted = user && upVotesBy ? upVotesBy.includes(user.id) : false;
  const isDownVoted = user && downVotesBy ? downVotesBy.includes(user.id) : false;

  // Check for optimistic updates
  const optimisticUpdate = optimisticUpdates.find(
    (update) => update.id === (id || '') && update.type === 'comment',
  );

  const displayUpVoted = optimisticUpdate ? optimisticUpdate.isUpVoted : isUpVoted;
  const displayDownVoted = optimisticUpdate ? optimisticUpdate.isDownVoted : isDownVoted;
  const displayedUpvoteCount = (displayUpVoted && !isUpVoted)
    ? (upVotesBy?.length || 0) + 1
    : (!displayUpVoted && isUpVoted)
      ? Math.max(0, (upVotesBy?.length || 0) - 1)
      : upVotesBy?.length || 0;

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
      type: 'comment',
      isUpVoted: newUpVoted,
      isDownVoted: newDownVoted,
    }));

    // Dispatch the actual vote action
    dispatch(voteComment({ threadId, commentId: id || '', voteType }))
      .unwrap()
      .catch(() => {
        // If the vote fails, remove the optimistic update
        dispatch(removeOptimisticUpdate({ id: id || '', type: 'comment' }));
      });
  };

  return (
    <div className="bg-white rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition-all duration-300 border-l-2 border-blue-400" data-testid="comment-item">
      <div className="flex items-center mb-3">
        <div className="relative">
          <Avatar src={owner?.avatar} alt={owner?.name} size="sm" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{owner?.name}</p>
          <p className="text-xs text-gray-500">
            {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : 'Unknown time'}
          </p>
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed pl-2 border-l-2 border-gray-100">{content || ''}</p>

      <div className="flex items-center text-gray-600 pt-2">
        <button
          type="button"
          onClick={() => handleVote('up')}
          className={`flex items-center mr-5 ${displayUpVoted ? 'text-blue-600 font-medium voted' : 'hover:text-blue-500'} transition-colors duration-200`}
          disabled={!user}
          data-testid="comment-upvote-button"
        >
          <span className="mr-1 text-sm">{displayUpVoted ? <FaThumbsUp /> : <FaRegThumbsUp />}</span>
          <span className="text-sm" data-testid="comment-upvote-count">{displayedUpvoteCount}</span>
        </button>

        <button
          type="button"
          onClick={() => handleVote('down')}
          className={`flex items-center mr-5 ${displayDownVoted ? 'text-red-600 font-medium' : 'hover:text-red-500'} transition-colors duration-200`}
          disabled={!user}
          data-testid="comment-downvote-button"
        >
          <span className="mr-1 text-sm">{displayDownVoted ? <FaThumbsDown /> : <FaRegThumbsDown />}</span>
          <span className="text-sm">{downVotesBy?.length || 0}</span>
        </button>
      </div>
    </div>
  );
}

export default CommentCard;