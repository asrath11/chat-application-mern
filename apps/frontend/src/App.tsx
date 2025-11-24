import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import { Providers } from '@/providers/Providers';
import { useAuth } from '@/context/AuthContext';
import './App.css';
import Protected from './pages/auth/Protected';
function Home() {
  const { user } = useAuth();
  console.log(user);

  return (
    <div className='flex items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Home</h1>
    </div>
  );
}

function App() {
  return (
    <Providers>
      <Routes>
        <Route
          path='/'
          element={
            <Protected>
              <Home />
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
