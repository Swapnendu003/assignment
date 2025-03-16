
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCookie } from './cookies';

export default function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthProtected(props: P) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const token = getCookie('token');
      if (!token) {
        router.push('/');
      } else {
        setIsAuthenticated(true);
      }
      setLoading(false);
    }, [router]);

    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}