import ChatIcon from "@mui/icons-material/Chat";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapIcon from "@mui/icons-material/Map";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  Modal,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getListingById } from "../api/listings";

const ProductDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError(err?.message || "Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!listing) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <Typography variant="h5">Listing not found</Typography>
      </Box>
    );
  }

  const handleChat = () => {
    // Implement chat functionality
    console.log("Chat with seller");
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12} md={7}>
            <ImageList variant="quilted" cols={2} gap={8}>
              {listing.images?.map((img, i) => (
                <ImageListItem
                  key={i}
                  cols={i === 0 ? 2 : 1}
                  rows={i === 0 ? 2 : 1}
                >
                  <img
                    src={img}
                    alt={`Product ${i + 1}`}
                    style={{
                      borderRadius: 8,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={5}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                {listing.title}
              </Typography>
              <Typography
                variant="h5"
                color="primary"
                gutterBottom
                fontWeight="bold"
              >
                ${listing.price?.toFixed(2)}
              </Typography>

              {/* Categories and Condition */}
              <Box sx={{ my: 2, display: "flex", gap: 1 }}>
                {listing.category && (
                  <Chip
                    label={listing.category}
                    color="primary"
                    variant="outlined"
                  />
                )}
                {listing.condition && (
                  <Chip
                    label={listing.condition}
                    color="secondary"
                    variant="outlined"
                  />
                )}
              </Box>

              {/* Description */}
              <Typography variant="body1" paragraph sx={{ my: 3 }}>
                {listing.description}
              </Typography>

              {/* Location */}
              {listing.address && (
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Location
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnIcon color="action" />
                    <Typography variant="body2">{listing.address}</Typography>
                  </Box>
                </Box>
              )}

              {/* Latitude and Longitude */}
              {listing.latitude && listing.longitude && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Lat: {listing.latitude}, Lng: {listing.longitude}
                  </Typography>
                </Box>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                <Button
                  variant="contained"
                  startIcon={<ChatIcon />}
                  onClick={handleChat}
                  sx={{ flex: 1 }}
                >
                  Chat with Seller
                </Button>
                {listing.location?.coordinates && (
                  <Button
                    variant="outlined"
                    startIcon={<MapIcon />}
                    onClick={() => setMapOpen(true)}
                    sx={{ flex: 1 }}
                  >
                    View on Map
                  </Button>
                )}
              </Box>

              {/* Seller Info */}
              {listing.seller && (
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
                      {listing.seller?.name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {listing.seller?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {listing.university}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Map Modal */}
      {listing.location?.coordinates && (
        <Modal
          open={mapOpen}
          onClose={() => setMapOpen(false)}
          aria-labelledby="map-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 800,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Box sx={{ height: 400, width: "100%" }}>
              <iframe
                title="listing-location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  listing.location.coordinates[0] - 0.01
                },${listing.location.coordinates[1] - 0.01},${
                  listing.location.coordinates[0] + 0.01
                },${
                  listing.location.coordinates[1] + 0.01
                }&layer=mapnik&marker=${listing.location.coordinates[1]},${
                  listing.location.coordinates[0]
                }`}
              />
            </Box>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

export default ProductDetails;
