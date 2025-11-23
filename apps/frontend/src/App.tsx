import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import NotFound from './pages/NotFound';
import { ThemeProvider } from 'next-themes';
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
    <ThemeProvider defaultTheme='system' attribute='class' enableSystem={true}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
