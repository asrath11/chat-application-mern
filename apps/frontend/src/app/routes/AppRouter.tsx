import { Routes, Route } from 'react-router-dom';
import SignIn from '@/features/auth/pages/SignIn';
import SignUp from '@/features/auth/pages/SignUp';
import NotFound from './NotFound';
import ChatDashboard from '@/features/chat/pages/ChatDashboard';
import Protected from './ProtectedRoute';
import { ROUTES } from '@/constants/routes';

export const AppRouter = () => {
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
      <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
      <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};
