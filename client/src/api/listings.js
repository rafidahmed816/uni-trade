import axios from "axios";

const baseURL = "http://localhost:5000";
// Get all listings
export const getListings = async () => {
  const res = await api.get(`${baseURL}/api/listings`);
  return res.data;
};

// Get a single listing by ID
export const getListingById = async (id) => {
  const res = await api.get(`${baseURL}/api/listings/${id}`);
  return res.data;
};

// Create a new listing
export const postListing = async (listing, token) => {
  const res = await api.post(`${baseURL}/api/listings`, listing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Update a listing by ID
export const updateListing = async (id, listing, token) => {
  const res = await api.put(`${baseURL}/api/listings/${id}`, listing, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Delete a listing by ID
export const deleteListing = async (id, token) => {
  const res = await api.delete(`${baseURL}/api/listings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};