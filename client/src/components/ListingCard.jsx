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
      width: 300,
      height: 320,
      display: "flex",
      flexDirection: "column",
      cursor: "pointer",
      borderRadius: 3,
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
      },
    }}
    onClick={onClick}
  >
    <CardMedia
      component="img"
      height="180"
      image={
        listing.images?.[0] ||
        "https://via.placeholder.com/300x180?text=No+Image"
      }
      alt={listing.title}
      sx={{
        objectFit: "cover",
        backgroundColor: "#f5f5f5",
      }}
    />
    <CardContent
      sx={{
        flexGrow: 1,
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            minHeight: "2.6rem",
          }}
        >
          {listing.title}
        </Typography>
        <Typography
          variant="h6"
          color="primary"
          sx={{
            fontWeight: 700,
            fontSize: "1.25rem",
            mb: 1,
          }}
        >
          ${listing.price}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mt: "auto" }}>
        <Avatar
          sx={{
            width: 28,
            height: 28,
            mr: 1.5,
            bgcolor: "primary.main",
            fontSize: "0.875rem",
          }}
        >
          {listing.seller?.name?.[0]?.toUpperCase() || "?"}
        </Avatar>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {listing.seller?.name || "Unknown Seller"}
        </Typography>
      </Box>
      {listing.address && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          📍 {listing.address}
        </Typography>
      )}
    </CardContent>
  </Card>
);

export default ListingCard;
