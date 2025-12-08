import { Link } from "react-router-dom"

export default function NotFound() {
    return (
        <div className="flex items-center min-h-screen px-4 py-12 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <div className="w-full space-y-6 text-center">
                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">404 Page Not Found</h1>
                    <p className="text-gray-500">Sorry, we couldn&#x27;t find the page you&#x27;re looking for.</p>
                </div>
                <Link
                    to="/"
                    className="inline-flex h-10 items-center rounded-md border p-2"
                >
                    Return to website
                </Link>
            </div>
        </div>
    )
}