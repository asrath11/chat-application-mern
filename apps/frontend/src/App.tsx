import { Providers } from '@/app/providers/Providers';
import { AppRouter } from '@/app/routes/AppRouter';
import './App.css';

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
