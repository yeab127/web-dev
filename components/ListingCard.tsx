import Link from 'next/link';
import Image from 'next/image';
import { Listing } from '@/lib/api';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48 w-full bg-gray-200">
          {listing.imageUrl ? (
            <Image
              src={listing.imageUrl}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
              {listing.title}
            </h3>
            <span className="text-lg font-bold text-blue-600">${listing.price}/night</span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{listing.location}</p>
          <p className="text-gray-500 text-sm line-clamp-2">{listing.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
            <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</span>
            <span className="capitalize">{listing.type}</span>
            {listing.avgRating && (
              <span className="ml-auto">⭐ {listing.avgRating.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
