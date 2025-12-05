import { Providers } from '@/providers/Providers';
import { AppRouter } from './router';
import './App.css';

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
