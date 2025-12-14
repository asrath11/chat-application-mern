import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='flex items-center min-h-screen bg-background px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16'>
      <div className='w-full space-y-6 text-center'>
        <div className='space-y-3'>
          <h1 className='text-4xl font-bold tracking-tighter sm:text-5xl text-foreground'>
            404 Page Not Found
          </h1>
          <p className='text-muted-foreground'>
            Sorry, we couldn&#x27;t find the page you&#x27;re looking for.
          </p>
        </div>
        <Link
          to='/'
          className='inline-flex h-10 items-center rounded-md border border-border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground p-2 transition-colors'
        >
          Return to website
        </Link>
      </div>
    </div>
  );
}
