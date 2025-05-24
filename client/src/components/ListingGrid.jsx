import { Grid, Typography } from "@mui/material";
import ListingCard from "./ListingCard";

const ListingsGrid = ({ listings, onCardClick }) => (
  <Grid container spacing={2}>
    {Array.isArray(listings) && listings.length > 0 ? (
      listings.map((listing) => (
        <Grid item xs={12} md={6} lg={4} key={listing._id}>
          <ListingCard listing={listing} onClick={() => onCardClick(listing)} />
        </Grid>
      ))
    ) : (
      <Grid item xs={12}>
        <Typography>No listings found.</Typography>
      </Grid>
    )}
  </Grid>
);

export default ListingsGrid;
