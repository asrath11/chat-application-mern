import { useAuth } from '@/app/providers/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/Loading';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to='/signin' replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
