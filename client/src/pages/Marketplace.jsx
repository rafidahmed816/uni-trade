import AddIcon from "@mui/icons-material/Add";
import ChatIcon from "@mui/icons-material/Chat";
import ListAltIcon from "@mui/icons-material/ListAlt";
import MapIcon from "@mui/icons-material/Map";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getListings, postListing } from "../api/listings"; // Import API functions

const drawerWidth = 260;

const categories = ["Books", "Electronics", "Services", "Clothing", "Other"];

const ListingCard = ({ listing }) => (
  <Card sx={{ display: "flex", mb: 2 }}>
    {listing.images && listing.images.length > 0 && (
      <CardMedia
        component="img"
        sx={{ width: 120 }}
        image={listing.images[0]}
        alt={listing.title}
      />
    )}
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <CardContent>
        <Typography variant="h6">{listing.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {listing.category} &middot; {listing.condition}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          ${listing.price}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {listing.description}
        </Typography>
      </CardContent>
    </Box>
  </Card>
);

const Marketplace = ({ user }) => {
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
      await postListing(
        { ...form, price: Number(form.price) },
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
      // Refresh listings
      setLoading(true);
      getListings()
        .then((data) => setListings(data))
        .finally(() => setLoading(false));
    } catch {
      setSnackbar("Failed to post listing");
    }
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
                  <ListingCard listing={listing} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>No listings found.</Typography>
              </Grid>
            )}
          </Grid>
        )}
      </Box>

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
            minWidth: 350,
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 2,
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
          {/* Image upload can be added here */}
          <Button
            type="submit"
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              fontWeight: 700,
              borderRadius: 2,
              mt: 2,
            }}
          >
            Post
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
  );
};

export default Marketplace;
