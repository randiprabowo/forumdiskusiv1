import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getToken, getUser } from '../utils/localStorage';
import { setUser, setToken } from '../features/authSlice';

function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = getToken();
    const storedUser = getUser();

    if (storedToken && storedUser) {
      dispatch(setToken(storedToken));
      dispatch(setUser(storedUser));
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}

export default AuthInitializer;
