import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import ChatDashboard from './pages/ChatDashboard';
import Protected from './pages/auth/Protected';
import { ROUTES } from './constants';

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
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};
