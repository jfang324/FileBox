'use client'
import { useUser } from '@auth0/nextjs-auth0/client'
import dynamic from 'next/dynamic'

const HomePage = dynamic(() => import('@/components/HomePage').then((mod) => mod.default))

export default function Home() {
    const { user, error, isLoading } = useUser()

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    // If user is not authenticated, redirect to login page
    return user ? (
        <HomePage />
    ) : (
        <div className="flex h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Welcome to FileBox</h1>
                <p className="text-lg">Please log in to continue</p>
                <button
                    onClick={() => {
                        window.location.href = '/api/auth/login'
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold mt-1 py-2 px-4 rounded"
                >
                    Log In
                </button>
            </div>
        </div>
    )
}
