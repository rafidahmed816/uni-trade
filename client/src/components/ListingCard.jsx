import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";

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
        listing.images?.[0] || "https://via.placeholder.com/300?text=No+Image"
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
      {listing.latitude && listing.longitude && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Lat: {listing.latitude}, Lng: {listing.longitude}
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

export default ListingCard;
