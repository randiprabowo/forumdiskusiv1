import api from './api';

const leaderboardService = {
  getLeaderboard: async () => {
    const response = await api.get('/leaderboards');
    const data = response.data?.data?.leaderboards ?? response.data?.leaderboards ?? response.data;
    return data;
  },
};

export default leaderboardService;
