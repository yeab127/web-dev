'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getListings } from '@/lib/api';
import ListingCard from '@/components/ListingCard';

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeaturedListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFeaturedListings() {
    try {
      setError(null);
      const listings = await getListings();
      setFeaturedListings(listings.slice(0, 6));
    } catch (err) {
      console.error('Failed to load listings:', err);
      setError((err && err.message) || 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover unique places to stay and things to do
            </p>
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations..."
                  className="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Listings</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading listings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
              <p className="text-red-800 font-semibold mb-2">Error loading listings</p>
              <p className="text-red-600 text-sm">{error}</p>
              <button
                onClick={loadFeaturedListings}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No listings found</p>
          </div>
        )}
        {featuredListings.length > 0 && (
          <div className="text-center mt-8">
            <Link
              href="/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Listings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}