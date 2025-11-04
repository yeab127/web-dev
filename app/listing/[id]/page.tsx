'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { getListing, createBooking, Listing, Review } from '@/lib/api';
import BookingForm from '@/components/BookingForm';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState<(Listing & { reviews: Review[]; avgRating: number | null }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      loadListing();
    }
  }, [params.id]);

  async function loadListing() {
    try {
      const data = await getListing(params.id as string);
      setListing(data);
    } catch (error: any) {
      setError(error.message || 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  }

  async function handleBooking(startDate: string, endDate: string) {
    try {
      await createBooking(listing!.id, startDate, endDate);
      alert('Booking request created successfully!');
      router.push('/trips');
    } catch (error: any) {
      alert(error.message || 'Failed to create booking');
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading listing...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-red-600">{error || 'Listing not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
          <p className="text-gray-600 mb-4">{listing.location}</p>

          {listing.imageUrl && (
            <div className="relative h-96 w-full mb-6 rounded-lg overflow-hidden">
              <Image
                src={listing.imageUrl}
                alt={listing.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4 p-4 border-t border-b">
            <div>
              <p className="text-sm text-gray-600">Bedrooms</p>
              <p className="text-lg font-semibold">{listing.bedrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Bathrooms</p>
              <p className="text-lg font-semibold">{listing.bathrooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="text-lg font-semibold capitalize">{listing.type}</p>
            </div>
          </div>

          {/* Reviews */}
          {listing.reviews && listing.reviews.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">
                Reviews {listing.avgRating && `(${listing.avgRating.toFixed(1)}⭐)`}
              </h2>
              <div className="space-y-4">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold">{review.user.name}</p>
                      <p className="text-yellow-500">{'⭐'.repeat(review.rating)}</p>
                    </div>
                    {review.comment && <p className="text-gray-700">{review.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 bg-white border rounded-lg p-6 shadow-md">
            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">${listing.price}</span>
              <span className="text-gray-600"> / night</span>
            </div>
            <BookingForm listing={listing} onSubmit={handleBooking} />
          </div>
        </div>
      </div>
    </div>
  );
}
