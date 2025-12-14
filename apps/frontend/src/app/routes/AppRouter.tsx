import { Routes, Route } from 'react-router-dom';
import SignIn from '@/features/auth/pages/SignIn';
import SignUp from '@/features/auth/pages/SignUp';
import Profile from '@/features/auth/pages/Profile';
import NotFound from './NotFound';
import ChatDashboard from '@/features/chat/pages/ChatDashboard';
import Protected from './ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '../providers/AuthContext';

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path={ROUTES.HOME}
        element={
          <Protected>
            <ChatDashboard />
          </Protected>
        }
      />
      <Route
        path={ROUTES.CHAT}
        element={
          <Protected>
            <ChatDashboard />
          </Protected>
        }
      />
      <Route
        path={ROUTES.PROFILE}
        element={<Protected>{user && <Profile user={user} />}</Protected>}
      />
      <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
      <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
