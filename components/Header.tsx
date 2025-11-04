'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMe, logout, User } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    logout();
    setUser(null);
    router.push('/');
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            RentApp
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link href="/search" className="text-gray-700 hover:text-blue-600">
              Search
            </Link>
            {user ? (
              <>
                <Link href="/host" className="text-gray-700 hover:text-blue-600">
                  Host
                </Link>
                <Link href="/trips" className="text-gray-700 hover:text-blue-600">
                  Trips
                </Link>
                <span className="text-gray-700">Hello, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/auth" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
