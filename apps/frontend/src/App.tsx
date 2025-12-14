import { Providers } from '@/app/providers/Providers';
import { AppRouter } from '@/app/routes/AppRouter';

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
