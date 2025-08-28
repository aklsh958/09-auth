'use client';

import { checkSession, getMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import { useEffect } from 'react';
type Props = {
  children: React.ReactNode;
};
const AuthProvider = ({ children }: Props) => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );
  useEffect(() => {
    const fetchSession = async () => {
      const response = await checkSession();
      if (response) {
        const user = await getMe();
        setUser(user);
      } else {
        clearIsAuthenticated();
      }
    };
    fetchSession();
  }, [clearIsAuthenticated, setUser]);

  return children;
};
export default AuthProvider;