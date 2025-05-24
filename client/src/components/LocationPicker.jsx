import { Box, Button, Modal, Typography } from "@mui/material";
import L from "leaflet";
import { useState } from "react";
import React from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ open, onClose, onSelect, initialPosition }) {
  const [position, setPosition] = useState(initialPosition);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });
    return position ? <Marker position={position} /> : null;
  }

  const handleSave = () => {
    if (position) {
      // Pass [lat, lng] to parent
      onSelect(position);
    }
    onClose();
  };

  // Keep position in sync with initialPosition when modal is reopened
  React.useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Select Location
        </Typography>
        <Box sx={{ height: 400, width: "100%", mb: 2 }}>
          <MapContainer
            center={position || [23.8103, 90.4125]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker />
          </MapContainer>
        </Box>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!position}
          fullWidth
        >
          Save Location
        </Button>
      </Box>
    </Modal>
  );
}

export default LocationPicker;
