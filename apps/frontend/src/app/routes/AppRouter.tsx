import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Protected from './ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '../providers/AuthContext';

const SignIn = lazy(() => import('@/features/auth/pages/SignIn'));
const SignUp = lazy(() => import('@/features/auth/pages/SignUp'));
const Profile = lazy(() => import('@/features/auth/pages/Profile'));
const ChatDashboard = lazy(() => import('@/features/chat/pages/ChatDashboard'));
const NotFound = lazy(() => import('./NotFound'));

export const AppRouter = () => {
  const { user } = useAuth();
  const ProtectedChat = (
    <Protected>
      <ChatDashboard />
    </Protected>
  );

  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path={ROUTES.HOME} element={ProtectedChat} />
        <Route path={ROUTES.CHAT} element={ProtectedChat} />

        <Route
          path={ROUTES.PROFILE}
          element={
            <Protected>
              <Profile />
            </Protected>
          }
        />

        <Route
          path={ROUTES.SIGN_IN}
          element={user ? <Navigate to={ROUTES.HOME} /> : <SignIn />}
        />
        <Route
          path={ROUTES.SIGN_UP}
          element={user ? <Navigate to={ROUTES.HOME} /> : <SignUp />}
        />

        <Route path='*' element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
