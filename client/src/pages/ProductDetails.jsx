import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getListingById } from '../api/listings';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Avatar,
  ImageList,
  ImageListItem,
} from '@mui/material';

const ProductDetails = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    getListingById(id).then(setListing);
  }, [id]);

  if (!listing) return <Box>Loading...</Box>;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={7}>
            <ImageList variant="quilted" cols={2} gap={8}>
              {listing.images?.map((img, i) => (
                <ImageListItem key={i} cols={i === 0 ? 2 : 1} rows={i === 0 ? 2 : 1}>
                  <img
                    src={img}
                    alt={`Product ${i + 1}`}
                    style={{ borderRadius: 8 }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
          <Grid item xs={12} md={5}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {listing.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              ${listing.price}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Chip label={listing.category} sx={{ mr: 1 }} />
              <Chip label={listing.condition} />
            </Box>
            <Typography variant="body1" paragraph>
              {listing.description}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
              <Avatar sx={{ mr: 2 }}>{listing.seller?.name?.[0]}</Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {listing.seller?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {listing.university}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetails;