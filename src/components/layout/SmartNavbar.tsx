import { useMemo } from 'react';
import Navbar from './Navbar';
import AuthenticatedNavbar from './AuthenticatedNavbar';

const SmartNavbar = () => {
  const authData = useMemo(() => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      if (token && user) {
        const parsed = JSON.parse(user);
        return {
          isAuthenticated: true,
          user: {
            id: parsed._id,
            name: `${parsed.firstName} ${parsed.lastName}`,
            email: parsed.email,
            role: parsed.role as 'client' | 'helper',
            avatar: parsed.avatar,
          },
        };
      }
    } catch {}
    return { isAuthenticated: false, user: null };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (authData.isAuthenticated && authData.user) {
    return <AuthenticatedNavbar user={authData.user} onLogout={handleLogout} />;
  }

  return <Navbar />;
};

export default SmartNavbar;
