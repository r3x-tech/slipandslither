import { useQuery } from 'react-query';

export const useAuth = () => {
  const queryInfo = useQuery('auth', async () => {
    // Fetch authentication status from the server or local storage
    return 'unauthenticated'; // Replace with real authentication logic
  });

  return queryInfo;
};
