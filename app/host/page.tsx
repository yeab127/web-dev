'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getListings, createListing, updateListing, getMe, Listing } from '@/lib/api';
import ListingForm from '@/components/ListingForm';
import ListingCard from '@/components/ListingCard';

export default function HostPage() {
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    loadMyListings();
  }, []);

  async function checkAuth() {
    try {
      await getMe();
    } catch {
      router.push('/auth');
    }
  }

  async function loadMyListings() {
    try {
      const user = await getMe();
      const allListings = await getListings();
      const filtered = allListings.filter((listing) => listing.ownerId === user.id);
      setMyListings(filtered);
    } catch (error) {
      console.error('Failed to load listings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(formData: any) {
    try {
      if (editingListing) {
        await updateListing(editingListing.id, formData);
      } else {
        await createListing(formData);
      }
      setShowForm(false);
      setEditingListing(null);
      loadMyListings();
    } catch (error: any) {
      alert(error.message || 'Failed to save listing');
    }
  }

  function handleEdit(listing: Listing) {
    setEditingListing(listing);
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingListing(null);
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            New Listing
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingListing ? 'Edit Listing' : 'Create New Listing'}
          </h2>
          <ListingForm
            listing={editingListing}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}

      {myListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <div key={listing.id} className="relative">
              <ListingCard listing={listing} />
              <button
                onClick={() => handleEdit(listing)}
                className="mt-2 w-full bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Edit
              </button>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Listing
            </button>
          </div>
        )
      )}
    </div>
  );
}
