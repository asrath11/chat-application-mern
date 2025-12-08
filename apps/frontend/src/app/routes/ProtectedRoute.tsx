import { useAuth } from '@/context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/signin' replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
