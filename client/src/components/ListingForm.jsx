import FileUploadIcon from "@mui/icons-material/FileUpload";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  ImageList,
  ImageListItem,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const categories = ["Books", "Electronics", "Services", "Clothing", "Other"];

const ListingForm = ({
  form,
  setForm,
  handleFormChange,
  handleImageUpload,
  onSubmit,
  openLocationPicker,
}) => (
  <Box component="form" onSubmit={onSubmit} sx={{ p: 2 }}>
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
    {/* Location section */}
    <Box sx={{ mt: 2 }}>
      <Button
        variant="outlined"
        startIcon={<LocationOnIcon />}
        onClick={openLocationPicker}
        fullWidth
      >
        Choose Location on Map
      </Button>
      {form.latitude != null && form.longitude != null ? (
        <Typography variant="body2" sx={{ mt: 1 }}>
          Selected: Lat {form.latitude?.toFixed(5)}, Lng{" "}
          {form.longitude?.toFixed(5)}
        </Typography>
      ) : (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          Please select a location on the map (required)
        </Typography>
      )}
    </Box>
    <Button
  type="submit"
  variant="contained"
  fullWidth
  sx={{ mt: 3 }}
  disabled={form.latitude == null || form.longitude == null}
>
  Post Listing
</Button>
  </Box>
);

export default ListingForm;
