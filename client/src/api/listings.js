import axios from "axios";

const baseURL = "http://localhost:5000";

// Get all listings
export const getListings = async () => {
  const res = await axios.get(`${baseURL}/api/listings`);
  return res.data;
};

// Get a single listing by ID
export const getListingById = async (id) => {
  const res = await axios.get(`${baseURL}/api/listings/${id}`);
  return res.data;
};

// Create a new listing
export const postListing = async (listing, token) => {
  const formData = new FormData();
  Object.entries(listing).forEach(([key, value]) => {
    if (key === 'images') {
      value.forEach((file) => formData.append('images', file));
    } else {
      formData.append(key, value);
    }
  });

  const res = await axios.post(`${baseURL}/api/listings`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

// Update a listing by ID
export const updateListing = async (id, listing, token) => {
  const res = await axios.put(`${baseURL}/api/listings/${id}`, listing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete a listing by ID
export const deleteListing = async (id, token) => {
  const res = await axios.delete(`${baseURL}/api/listings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};