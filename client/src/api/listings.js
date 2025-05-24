import axios from "axios";

const baseURL = "http://localhost:5000";

// Create axios instance with default config
const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
);

// Get all listings
export const getListings = async () => {
  try {
    return await api.get('/listings');
  } catch (error) {
    console.error('Error fetching listings:', error);
    throw error;
  }
};

// Get a single listing by ID
export const getListingById = async (id) => {
  try {
    return await api.get(`/listings/${id}`);
  } catch (error) {
    console.error('Error fetching listing:', error);
    throw error;
  }
};

// Create a new listing
export const postListing = async (listing, token) => {
  try {
    const formData = new FormData();
    Object.entries(listing).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((file) => formData.append('images', file));
      } else {
        formData.append(key, value);
      }
    });
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      }
    };
    return await api.post('/listings', formData, config);
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

// Update a listing by ID
export const updateListing = async (id, listing, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    return await api.put(`/listings/${id}`, listing, config);
  } catch (error) {
    console.error('Error updating listing:', error);
    throw error;
  }
};

// Delete a listing by ID
export const deleteListing = async (id, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    return await api.delete(`/listings/${id}`, config);
  } catch (error) {
    console.error('Error deleting listing:', error);
    throw error;
  }
};