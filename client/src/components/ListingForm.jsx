import FileUploadIcon from "@mui/icons-material/FileUpload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const categories = ["Books", "Electronics", "Services", "Clothing", "Other"];

// Define backendPath at the top of the component
const backendPath = "http://localhost:5000";

const ListingForm = ({
  form,
  setForm,
  handleFormChange,
  onSubmit,
  openLocationPicker,
}) => {
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);

    // Check file count limit
    if (files.length > 5) {
      alert("You can upload a maximum of 5 images");
      return;
    }

    // Check file sizes (5MB limit per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    for (let file of files) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
    }

    const apiKey = "8c9ee1af0611cd0e6b62c5eacffe5451";

    if (!apiKey || apiKey === "YOUR_IMGBB_API_KEY_HERE") {
      alert(
        "ImgBB API key is missing. Please set REACT_APP_IMGBB_API_KEY in your environment variables."
      );
      return;
    }

    const uploadToImgBB = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Image = reader.result.split(",")[1];
            const formData = new FormData();
            formData.append("image", base64Image);

            const response = await fetch(
              `https://api.imgbb.com/1/upload?key=${apiKey}`,
              {
                method: "POST",
                body: formData,
              }
            );

            const result = await response.json();
            console.log("ImgBB Response:", result); // Debugging log

            if (result.success) {
              resolve({
                url: result.data.url,
                display_url: result.data.display_url,
                delete_url: result.data.delete_url,
              });
            } else {
              reject(new Error(result.error?.message || "Upload failed"));
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });
    };

    setUploading(true);
    try {
      const uploadedData = await Promise.all(files.map(uploadToImgBB));
      const imageUrls = uploadedData.map((data) => data.url);

      setForm((prev) => {
        const updatedForm = {
          ...prev,
          images: [...(prev.images || []), ...imageUrls],
        };
        console.log("Updated form.images:", updatedForm.images); // Debugging log
        return updatedForm;
      });
      setImageFiles((prev) => [...prev, ...files]);

      console.log("Images uploaded successfully:", uploadedData);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(`Image upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !form.title ||
      !form.description ||
      !form.category ||
      !form.condition ||
      !form.price
    ) {
      alert("Please fill in all required fields");
      return;
    }

    if (form.latitude == null || form.longitude == null) {
      alert("Please select a location on the map");
      return;
    }

    try {
      console.log("Form data being submitted:", form); // Debugging log

      const token = localStorage.getItem("token"); // Adjust based on how you store auth token

      const response = await fetch(`${backendPath}/api/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add auth header if needed
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || "Failed to create listing");
      }

      const data = await response.json();
      console.log("Listing created:", data);
      alert("Listing created successfully!");

      // Reset form
      setForm({
        title: "",
        description: "",
        category: "",
        condition: "",
        price: "",
        images: [],
        latitude: null,
        longitude: null,
        address: "",
      });
      setImageFiles([]);
    } catch (error) {
      console.error("Error creating listing:", error);
      alert(`Failed to create listing: ${error.message}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Post a New Listing
      </Typography>

      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleFormChange}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleFormChange}
        multiline
        rows={3}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        select
        label="Category"
        name="category"
        value={form.category}
        onChange={handleFormChange}
        required
        fullWidth
        sx={{ mb: 2 }}
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
        sx={{ mb: 2 }}
      >
        <MenuItem value="New">New</MenuItem>
        <MenuItem value="Like New">Like New</MenuItem>
        <MenuItem value="Good">Good</MenuItem>
        <MenuItem value="Fair">Fair</MenuItem>
        <MenuItem value="Poor">Poor</MenuItem>
      </TextField>

      <TextField
        label="Price ($)"
        name="price"
        type="number"
        value={form.price}
        onChange={handleFormChange}
        required
        fullWidth
        inputProps={{ min: 0, step: "0.01" }}
        sx={{ mb: 2 }}
      />

      {/* Image upload section */}
      <Box sx={{ mb: 2 }}>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="image-upload"
          multiple
          type="file"
          onChange={handleImageUpload}
          disabled={uploading || (form.images && form.images.length >= 5)}
        />
        <label htmlFor="image-upload">
          <Button
            variant="outlined"
            component="span"
            startIcon={
              uploading ? <CircularProgress size={20} /> : <FileUploadIcon />
            }
            fullWidth
            disabled={uploading || (form.images && form.images.length >= 5)}
          >
            {uploading
              ? "Uploading..."
              : `Upload Images (${form.images?.length || 0}/5)`}
          </Button>
        </label>

        {form.images && form.images.length > 0 && (
          <ImageList sx={{ mt: 2 }} cols={3} rowHeight={120}>
            {form.images.map((img, index) => (
              <ImageListItem key={index} sx={{ position: "relative" }}>
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
                <Button
                  onClick={() => removeImage(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    minWidth: "auto",
                    width: 24,
                    height: 24,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    color: "red",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.9)",
                    },
                  }}
                >
                  ×
                </Button>
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      {/* Location section */}
      <Box sx={{ mb: 2 }}>
        <Button
          variant="outlined"
          startIcon={<LocationOnIcon />}
          onClick={openLocationPicker}
          fullWidth
        >
          Choose Location on Map
        </Button>
        {form.latitude != null && form.longitude != null ? (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            ✓ Location selected: Lat {form.latitude?.toFixed(5)}, Lng{" "}
            {form.longitude?.toFixed(5)}
          </Typography>
        ) : (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Please select a location on the map (required)
          </Typography>
        )}
      </Box>

      <TextField
        label="Address (Optional)"
        name="address"
        value={form.address}
        onChange={handleFormChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        disabled={form.latitude == null || form.longitude == null || uploading}
      >
        Post Listing
      </Button>
    </Box>
  );
};

export default ListingForm;
