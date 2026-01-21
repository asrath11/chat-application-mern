import { useAuth } from '@/app/providers/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/Loading';

export default function Protected({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Block UI only on first auth resolution
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <LoadingScreen />
        <p className="mt-2 text-sm text-muted-foreground">
          Starting server...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
