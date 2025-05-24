import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MapIcon from "@mui/icons-material/Map";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Drawer,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import imageCompression from "browser-image-compression";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getListings, postListing } from "../api/listings"; // Import API functions

const drawerWidth = 260;

const categories = ["Books", "Electronics", "Services", "Clothing", "Other"];

const ListingCard = ({ listing, onClick }) => (
  <Card
    sx={{
      height: 400,
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
      },
    }}
    onClick={onClick}
  >
    <CardMedia
      component="img"
      height="200"
      image={
        listing.images?.[0] ||
        "https://via.placeholder.com/300?text=No+Image"
      }
      alt={listing.title}
      sx={{ objectFit: "cover" }}
    />
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h6" component="div">
        {listing.title}
      </Typography>
      <Typography variant="h6" color="primary" gutterBottom>
        ${listing.price}
      </Typography>
      <Typography variant="body2" color="text.secondary" noWrap>
        {listing.description}
      </Typography>
      <Box sx={{ mt: 2, display: "flex", alignItems: "center" }}>
        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
          {listing.seller?.name?.[0]}
        </Avatar>
        <Typography variant="body2">{listing.seller?.name}</Typography>
      </Box>
    </CardContent>
  </Card>
);

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
  });
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    university: "",
    priceRange: [0, 1000],
  });

  // Add to your form state
  const [imageFiles, setImageFiles] = useState([]);

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
    try {
      // Validate image sizes
      const totalSize = form.images.reduce((acc, img) => {
        // Remove data:image/jpeg;base64, part to get actual size
        const base64str = img.split("base64,")[1];
        const size = (base64str.length * 3) / 4; // Convert base64 to approximate file size
        return acc + size;
      }, 0);

      // Check if total size is less than 16MB (MongoDB document limit is 16MB)
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
      });
      setImageFiles([]);

      // Refresh listings
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

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    setImageFiles(files);

    // Compression options
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    try {
      // Convert and compress files to base64
      const processedImages = await Promise.all(
        files.map(async (file) => {
          // Compress the image
          const compressedFile = await imageCompression(file, options);

          // Convert to base64
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

  // Add filter handlers
  const handleFilterChange = (event) => {
    setFilters((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
          },
        }}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Marketplace
          </Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="Messages" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="My Listings" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: "#fff" }}>
                  <MapIcon />
                </ListItemIcon>
                <ListItemText primary="Meeting Maps" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          ml: `${drawerWidth}px`,
          overflowY: "auto",
          minHeight: "100vh",
          bgcolor: "#fff", // White background
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
          <Grid container spacing={2}>
            {Array.isArray(listings) && listings.length > 0 ? (
              listings.map((listing) => (
                <Grid item xs={12} md={6} lg={4} key={listing._id}>
                  <ListingCard
                    listing={listing}
                    onClick={() => navigate(`/marketplace/${listing._id}`)}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No listings found.</Typography>
              </Grid>
            )}
          </Grid>
        )}

        {/* Post Listing Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            component="form"
            onSubmit={handleSubmit}
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
            <Typography variant="h6" sx={{ mb: 1 }}>
              Post a New Listing
            </Typography>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              required
              fullWidth
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Condition"
              name="condition"
              value={form.condition}
              onChange={handleFormChange}
              required
              fullWidth
            >
              <MenuItem value="New">New</MenuItem>
              <MenuItem value="Like New">Like New</MenuItem>
              <MenuItem value="Good">Good</MenuItem>
              <MenuItem value="Fair">Fair</MenuItem>
              <MenuItem value="Poor">Poor</MenuItem>
            </TextField>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleFormChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            {/* Image upload */}
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image-upload"
                multiple
                type="file"
                onChange={handleImageUpload}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<FileUploadIcon />}
                  fullWidth
                >
                  Upload Images
                </Button>
              </label>
              {form.images?.length > 0 && (
                <ImageList sx={{ mt: 2 }} cols={3} rowHeight={100}>
                  {form.images.map((img, index) => (
                    <ImageListItem key={index}>
                      <img src={img} alt={`Preview ${index + 1}`} />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: 700,
              }}
            >
              Post Listing
            </Button>
          </Box>
        </Modal>

        <Snackbar
          open={!!snackbar}
          autoHideDuration={3000}
          onClose={() => setSnackbar("")}
          message={snackbar}
        />
      </Box>
    </Box>
  );
};

export default Marketplace;
