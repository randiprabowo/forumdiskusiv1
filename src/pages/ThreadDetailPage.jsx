import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegThumbsUp, FaThumbsUp, FaRegThumbsDown, FaThumbsDown, FaRegComment } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { fetchThreadDetail } from '../features/threadsSlice';
import { createComment } from '../features/commentsSlice';
import { voteThread } from '../features/threadsSlice';
import { addOptimisticUpdate, removeOptimisticUpdate } from '../features/votesSlice';
import Avatar from '../components/Avatar';
import CommentCard from '../components/CommentCard';
import Loading from '../components/Loading';

function ThreadDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentThread, loading, error } = useSelector((state) => state.threads);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { optimisticUpdates } = useSelector((state) => state.votes);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState([]);

  useEffect(() => {
    dispatch(fetchThreadDetail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentThread?.comments) {
      setLocalComments(currentThread.comments);
    }
  }, [currentThread]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await dispatch(createComment({ threadId: id, content: commentContent })).unwrap();
      setCommentContent('');
      // Optimistically update local comments for E2E expectations
      setLocalComments((prev) => [...prev, newComment]);
    } catch (err) {
      // Error is handled in the slice
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = (voteType) => {
    if (!isAuthenticated) return;

    const isUpVoted = currentThread?.upVotesBy?.includes(user.id);
    const isDownVoted = currentThread?.downVotesBy?.includes(user.id);

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
      id: currentThread.id,
      type: 'thread',
      isUpVoted: newUpVoted,
      isDownVoted: newDownVoted,
    }));

    // Dispatch the actual vote action
    dispatch(voteThread({ threadId: currentThread.id, voteType }))
      .unwrap()
      .catch(() => {
        // If the vote fails, remove the optimistic update
        dispatch(removeOptimisticUpdate({ id: currentThread.id, type: 'thread' }));
      });
  };

  if (loading || !currentThread) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  const {
    title, body, category, createdAt, owner, upVotesBy, downVotesBy, comments,
  } = currentThread;

  const isUpVoted = user ? upVotesBy.includes(user.id) : false;
  const isDownVoted = user ? downVotesBy.includes(user.id) : false;

  // Check for optimistic updates
  const optimisticUpdate = optimisticUpdates.find(
    (update) => update.id === currentThread.id && update.type === 'thread',
  );

  const displayUpVoted = optimisticUpdate ? optimisticUpdate.isUpVoted : isUpVoted;
  const displayDownVoted = optimisticUpdate ? optimisticUpdate.isDownVoted : isDownVoted;

  const displayedUpvoteCount = (displayUpVoted && !isUpVoted)
    ? upVotesBy.length + 1
    : (!displayUpVoted && isUpVoted)
      ? Math.max(0, upVotesBy.length - 1)
      : upVotesBy.length;

  const displayedDownvoteCount = (displayDownVoted && !isDownVoted)
    ? downVotesBy.length + 1
    : (!displayDownVoted && isDownVoted)
      ? Math.max(0, downVotesBy.length - 1)
      : downVotesBy.length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl" data-testid="thread-detail">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8 border-t-4 border-blue-600">
        <div className="flex items-center mb-6">
          <div className="relative">
            <Avatar src={owner?.avatar} alt={owner?.name} />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="ml-4">
            <p className="font-semibold text-lg text-gray-800">{owner?.name}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800" data-testid="thread-title">{title}</h1>
        {category && (
          <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-4 py-1 rounded-full mb-6 shadow-sm" data-testid="thread-category">
            #{category}
          </span>
        )}

        <div className="prose max-w-none mb-8 text-gray-700 leading-relaxed" data-testid="thread-body">
          <p className="whitespace-pre-line">{body}</p>
        </div>

        <div className="flex flex-wrap items-center text-gray-600 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => handleVote('up')}
            className={`flex items-center mr-4 ${displayUpVoted ? 'text-blue-600 font-medium voted' : 'hover:text-blue-600'} transition-colors duration-200`}
            disabled={!isAuthenticated}
            data-testid="upvote-button"
          >
            <span className="mr-1 text-sm">{displayUpVoted ? <FaThumbsUp /> : <FaRegThumbsUp />}</span>
            <span data-testid="upvote-count">{displayedUpvoteCount}</span>
          </button>

          <button
            type="button"
            onClick={() => handleVote('down')}
            className={`flex items-center mr-4 ${displayDownVoted ? 'text-red-600 font-medium voted' : 'hover:text-red-600'} transition-colors duration-200`}
            disabled={!isAuthenticated}
            data-testid="downvote-button"
          >
            <span className="mr-1 text-sm">{displayDownVoted ? <FaThumbsDown /> : <FaRegThumbsDown />}</span>
            <span data-testid="downvote-count">{displayedDownvoteCount}</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
          <FaRegComment className="mr-2 text-blue-600 text-base" />
          Comments <span className="ml-2 text-blue-600">({comments.length})</span>
        </h2>

        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Add a comment
              </label>
              <textarea
                id="comment"
                rows="4"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Share your thoughts..."
                required
                data-testid="comment-input"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center"
              data-testid="comment-submit"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 text-sm text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="bg-blue-50 p-6 rounded-xl mb-8 border border-blue-100 flex items-center justify-between">
            <p className="text-blue-700">Please login to join the discussion.</p>
            <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 text-sm font-medium">Login</Link>
          </div>
        )}

        {comments.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-6 text-center mb-4">
            <FaRegComment className="mx-auto text-2xl text-gray-300 mb-2" />
            <p className="text-gray-500 text-base">No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(localComments.length ? localComments : comments).map((comment) => (
              <CommentCard key={comment.id} comment={comment} threadId={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadDetailPage;