import { useAuth } from '@/features/auth/hooks/useAuth';
import { Avatar } from '@/components/common/Avatar';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className='border-b bg-white px-4 py-3'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Chat Application</h1>

        {user && (
          <div className='flex items-center gap-3'>
            <Avatar name={user.name} size='sm' />
            <span className='text-sm font-medium'>{user.name}</span>
            <button
              onClick={logout}
              className='text-sm text-gray-600 hover:text-gray-900'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
