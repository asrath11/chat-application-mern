import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import { Providers } from '@/providers/Providers';
import './App.css';

function Home() {

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Home</h1>
    </div>
  );
}

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Providers>
  );
}

export default App;
