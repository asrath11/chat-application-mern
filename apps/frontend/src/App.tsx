import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import ChatDashboard from './pages/ChatDashboard';
import { Providers } from '@/providers/Providers';
import './App.css';
import Protected from './pages/auth/Protected';

function App() {
  return (
    <Providers>
      <Routes>
        <Route
          path='/'
          element={
            <Protected>
              <ChatDashboard />
            </Protected>
          }
        />
        <Route
          path='/chat/:chatId'
          element={
            <Protected>
              <ChatDashboard />
            </Protected>
          }
        />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Providers>
  );
}

export default App;
