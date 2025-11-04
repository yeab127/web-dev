'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getMyBookings, getMe, Booking } from '@/lib/api';

export default function TripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadBookings();
  }, []);

  async function checkAuth() {
    try {
      await getMe();
    } catch {
      router.push('/auth');
    }
  }

  async function loadBookings() {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading your trips...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Trips</h1>

      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="md:flex">
                {booking.listing.imageUrl && (
                  <div className="relative h-48 md:h-auto md:w-64 bg-gray-200">
                    <Image
                      src={booking.listing.imageUrl}
                      alt={booking.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <Link
                        href={`/listing/${booking.listing.id}`}
                        className="text-2xl font-semibold text-blue-600 hover:underline"
                      >
                        {booking.listing.title}
                      </Link>
                      <p className="text-gray-600 mt-1">{booking.listing.location}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        booking.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Check-in</p>
                      <p className="font-semibold">{formatDate(booking.startDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Check-out</p>
                      <p className="font-semibold">{formatDate(booking.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Price</p>
                      <p className="font-semibold text-lg">${booking.totalPrice.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Hosted by {booking.listing.owner.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
          <Link
            href="/search"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Browse Listings
          </Link>
        </div>
      )}
    </div>
  );
}
