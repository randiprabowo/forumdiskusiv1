import api from './api';

const commentService = {
  createComment: async (threadId, content) => {
    const response = await api.post(`/threads/${threadId}/comments`, { content });
    return response.data?.data?.comment ?? response.data;
  },

  voteComment: async (threadId, commentId, voteType) => {
    let voteEndpoint = 'neutral-vote';
    if (voteType === 'up') {
      voteEndpoint = 'up-vote';
    } else if (voteType === 'down') {
      voteEndpoint = 'down-vote';
    }
    const endpoint = `/threads/${threadId}/comments/${commentId}/${voteEndpoint}`;
    const response = await api.post(endpoint);
    return response.data?.data?.vote ?? response.data;
  },
};

export default commentService;
