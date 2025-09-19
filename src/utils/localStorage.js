/**
 * Local storage utility functions
 */

// Token key in local storage (primary)
const TOKEN_KEY = 'diskusi_forum_token';
// Backward-compat keys expected by E2E/mocks
const TOKEN_KEY_COMPAT = 'token';

// User key in local storage (primary)
const USER_KEY = 'diskusi_forum_user';
// Backward-compat keys expected by E2E/mocks
const USER_KEY_COMPAT = 'user';

/**
 * Save auth token to local storage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  // write compat key for tests
  localStorage.setItem(TOKEN_KEY_COMPAT, token);
};

/**
 * Get auth token from local storage
 * @returns {string|null} JWT token or null if not found
 */
export const getToken = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY_COMPAT);
    
    // Check for null, undefined, or string representations of null/undefined
    if (!token || token === 'undefined' || token === 'null') {
      return null;
    }
    
    return token;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

/**
 * Remove auth token from local storage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY_COMPAT);
};

/**
 * Save user data to local storage
 * @param {Object} user - User object
 */
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  // write compat key for tests
  localStorage.setItem(USER_KEY_COMPAT, JSON.stringify(user));
};

/**
 * Get user data from local storage
 * @returns {Object|null} User object or null if not found
 */
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY_COMPAT);
    
    // Check for null, undefined, or string representations of null/undefined
    if (!user || user === 'undefined' || user === 'null') {
      return null;
    }
    
    return JSON.parse(user);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error parsing user data from localStorage:', error);
    return null;
  }
};

/**
 * Remove user data from local storage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(USER_KEY_COMPAT);
};

/**
 * Clear all auth data from local storage
 */
export const clearAuthData = () => {
  removeToken();
  removeUser();
};
