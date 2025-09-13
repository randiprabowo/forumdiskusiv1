import api from './api';

const threadService = {
  getAllThreads: async () => {
    const response = await api.get('/threads');
    const data = response.data?.data?.threads ?? response.data?.threads ?? response.data;
    return data;
  },

  getThreadDetail: async (threadId) => {
    const response = await api.get(`/threads/${threadId}`);
    const data = response.data?.data?.detailThread ?? response.data?.threadDetail ?? response.data;
    return data;
  },

  createThread: async (threadData) => {
    const response = await api.post('/threads', threadData);
    const data = response.data?.data?.thread ?? response.data;
    return data;
  },

  voteThread: async (threadId, voteType) => {
    let voteEndpoint = 'neutral-vote';
    if (voteType === 'up') {
      voteEndpoint = 'up-vote';
    } else if (voteType === 'down') {
      voteEndpoint = 'down-vote';
    }
    const endpoint = `/threads/${threadId}/${voteEndpoint}`;
    const response = await api.post(endpoint);
    return response.data.data.vote;
  },
};

export default threadService;
