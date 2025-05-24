import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getListings, postListing } from "../api/listings";
import ListingForm from "../components/ListingForm";
import ListingsGrid from "../components/ListingGrid";
import LocationPicker from "../components/LocationPicker";
import MarketplaceSidebar from "../components/MarketplaceSideBar";

const categories = ["Books", "Electronics", "Services", "Clothing", "Other"];

const Marketplace = ({ user }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "Good",
    price: "",
    images: [],
    address: "",
    latitude: null,
    longitude: null,
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    university: "",
    priceRange: [0, 1000],
  });
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  // Fetch listings
  useEffect(() => {
    setLoading(true);
    getListings()
      .then((data) => setListings(data))
      .catch(() => setSnackbar("Failed to load listings"))
      .finally(() => setLoading(false));
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle new listing submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submit if location is missing
    if (form.latitude == null || form.longitude == null) {
      setSnackbar("Please select a location on the map.");
      return;
    }

    try {
      // Validate image sizes
      const totalSize = form.images.reduce((acc, img) => {
        const base64str = img.split("base64,")[1];
        const size = (base64str.length * 3) / 4;
        return acc + size;
      }, 0);

      if (totalSize > 16 * 1024 * 1024) {
        setSnackbar("Total image size must be less than 16MB");
        return;
      }

      await postListing(
        {
          ...form,
          price: Number(form.price),
        },
        localStorage.getItem("token")
      );

      setSnackbar("Listing posted!");
      setModalOpen(false);
      setForm({
        title: "",
        description: "",
        category: "",
        condition: "Good",
        price: "",
        images: [],
        address: "",
        latitude: null,
        longitude: null,
      });

      setLoading(true);
      const newListings = await getListings();
      setListings(newListings);
      setLoading(false);
    } catch (err) {
      setSnackbar(
        "Failed to post listing: " + (err.message || "Unknown error")
      );
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    const imageCompression = (await import("browser-image-compression"))
      .default;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      const processedImages = await Promise.all(
        files.map(async (file) => {
          const compressedFile = await imageCompression(file, options);
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result);
            };
            reader.readAsDataURL(compressedFile);
          });
        })
      );

      setForm((prev) => ({
        ...prev,
        images: processedImages,
      }));
    } catch (error) {
      setSnackbar("Error processing images: " + error.message);
    }
  };

  // Filter handlers
  const handleFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // Open location picker
  const openLocationPicker = () => setLocationModalOpen(true);

  // Handle location select
  const handleLocationSelect = (coords) => {
    setForm((prev) => ({
      ...prev,
      latitude: coords[0], // lat
      longitude: coords[1], // lng
    }));
    setLocationModalOpen(false);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Sidebar */}
      <MarketplaceSidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          ml: `260px`,
          overflowY: "auto",
          minHeight: "100vh",
          bgcolor: "#fff",
        }}
      >
        {/* Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="search"
                placeholder="Search listings..."
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>University</InputLabel>
                <Select
                  name="university"
                  value={filters.university}
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="IUT">IUT</MenuItem>
                  {/* Add more universities */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            All Listings
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 700,
              borderRadius: 3,
              px: 3,
              py: 1,
              boxShadow: 2,
            }}
            onClick={() => setModalOpen(true)}
          >
            Post Listing
          </Button>
        </Box>

        {/* Listings */}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ListingsGrid
            listings={listings}
            onCardClick={(listing) => navigate(`/marketplace/${listing._id}`)}
          />
        )}

        {/* Post Listing Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#fff",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              width: 600,
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <ListingForm
              form={form}
              setForm={setForm}
              handleFormChange={handleFormChange}
              handleImageUpload={handleImageUpload}
              onSubmit={handleSubmit}
              openLocationPicker={openLocationPicker}
            />
          </Box>
        </Modal>

        <Snackbar
          open={!!snackbar}
          autoHideDuration={3000}
          onClose={() => setSnackbar("")}
          message={snackbar}
        />

        {/* Location Picker Modal */}
        <LocationPicker
          open={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          onSelect={handleLocationSelect}
          initialPosition={
            form.latitude && form.longitude
              ? [form.latitude, form.longitude]
              : [23.8103, 90.4125]
          }
        />
      </Box>
    </Box>
  );
};

export default Marketplace;
