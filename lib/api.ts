const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl: string | null;
  ownerId: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  avgRating?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  listingId: string;
  listing: Listing;
  renterId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  listingId: string;
  userId: string;
  user: {
    id: string;
    name: string;
  };
  createdAt: string;
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Auth
export async function signup(email: string, password: string, name: string) {
  try {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password, name }),
    });
    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.error || 'Signup failed');
      } catch {
        throw new Error(`Signup failed: ${res.status} ${res.statusText}`);
      }
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.error || 'Login failed');
      } catch {
        throw new Error(`Login failed: ${res.status} ${res.statusText}`);
      }
    }
    const data = await res.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

export async function getMe(): Promise<User> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error('Not authenticated');
      }
      throw new Error(`Failed to get user: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      // Silently fail for network errors on getMe to avoid blocking the app
      throw new Error('Not authenticated');
    }
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('token');
}

// Listings
export async function getListings(filters?: {
  type?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Listing[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.type) params.append('type', filters.type);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());

    const res = await fetch(`${API_URL}/listings?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
}

export async function getListing(id: string): Promise<Listing & { reviews: Review[]; avgRating: number | null }> {
  try {
    const res = await fetch(`${API_URL}/listings/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch listing: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running.`);
    }
    throw error;
  }
}

export async function createListing(data: {
  title: string;
  description: string;
  type: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  imageUrl?: string;
}): Promise<Listing> {
  try {
    const res = await fetch(`${API_URL}/listings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create listing');
      } catch {
        throw new Error(`Failed to create listing: ${res.status} ${res.statusText}`);
      }
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

export async function updateListing(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    type: string;
    location: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string;
  }>
): Promise<Listing> {
  try {
    const res = await fetch(`${API_URL}/listings/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update listing');
      } catch {
        throw new Error(`Failed to update listing: ${res.status} ${res.statusText}`);
      }
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

// Bookings
export async function createBooking(listingId: string, startDate: string, endDate: string): Promise<Booking> {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ listingId, startDate, endDate }),
    });
    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create booking');
      } catch {
        throw new Error(`Failed to create booking: ${res.status} ${res.statusText}`);
      }
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

export async function getMyBookings(): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_URL}/bookings`, {
      headers: getHeaders(),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch bookings: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

// Reviews
export async function createReview(listingId: string, rating: number, comment?: string): Promise<Review> {
  try {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ listingId, rating, comment }),
    });
    if (!res.ok) {
      try {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create review');
      } catch {
        throw new Error(`Failed to create review: ${res.status} ${res.statusText}`);
      }
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}

export async function getReviews(listingId: string): Promise<Review[]> {
  try {
    const res = await fetch(`${API_URL}/reviews?listingId=${listingId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch reviews: ${res.status} ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Make sure the backend server is running on port 4000.`);
    }
    throw error;
  }
}
