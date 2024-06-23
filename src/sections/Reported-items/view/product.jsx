import axios from 'axios';
import 'react-image-lightbox/style.css';
import { useLocation } from 'react-router-dom';
import React, { lazy, useState, useEffect } from 'react';

import {
  Chip,
  Grid,
  Card,
  Divider,
  Container,
  CardMedia,
  Typography,
  CardContent,
} from '@mui/material';

const Lightbox = lazy(() => import('react-image-lightbox'));

const getLocationName = async (latitude, longitude) => {
  const API_KEY = 'c73ff3a0eff74fd29028c9ef7cf26e69';
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json`, {
      params: {
        key: API_KEY,
        q: `${latitude}+${longitude}`,
      },
    });
    const { results } = response.data;
    if (results && results.length > 0) {
      return results[0].formatted;
    }
    return 'Unknown location';
  } catch (error) {
    console.error('Error fetching location:', error);
    return 'Unknown location';
  }
};

const Product = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [locationName, setLocationName] = useState('Unknown location');

  useEffect(() => {
    if (product) {
      console.log('Product received:', product);
      if (product.latitude && product.longitude) {
        console.log('Product coordinates:', product.latitude, product.longitude);
        const fetchLocation = async () => {
          const fetchedLocationName = await getLocationName(product.latitude, product.longitude);
          setLocationName(fetchedLocationName);
        };
        fetchLocation();
      } else {
        console.error('Product coordinates are missing');
      }
    } else {
      console.error('Product is not defined');
    }
  }, [product]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Product Details
      </Typography>
      {product ? (
        <Card>
          <CardMedia
            component="img"
            alt={product.title}
            height="400"
            image={product.mainImageUrl}
            onClick={() => openLightbox(0)}
            style={{ cursor: 'pointer', zIndex: 2000, position: 'relative' }}
          />
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              <span style={{ fontWeight: 'bold' }}>Title:</span> {product.title}
            </Typography>
            <Typography variant="subtitle" component="p">
              <span style={{ fontWeight: '600' }}>Description:</span> {product.description}
            </Typography>
            <Typography variant="subtitle2" component="p" gutterBottom>
              Asking Price: ${product.askingPrice}
            </Typography>
            <Typography sx={{ pt: '10px' }} variant="body2" color="text.secondary">
              <strong>Location:</strong> {locationName}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Categories
            </Typography>
            <Grid container spacing={1}>
              {product.categories.map((category, index) => (
                <Grid item key={index}>
                  <Chip label={category} variant="outlined" />
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Additional Images
            </Typography>
            <Grid container spacing={2}>
              {product.imageUrls.map((imageUrl, index) => (
                <Grid
                  item
                  key={index}
                  xs={6}
                  sm={4}
                  md={3}
                  style={{ height: 300, overflow: 'hidden' }}
                >
                  <CardMedia
                    component="img"
                    alt={`Image ${index + 1}`}
                    image={imageUrl}
                    onClick={() => openLightbox(index + 1)}
                    style={{
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      zIndex: 2000,
                      position: 'relative',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No product data available
        </Typography>
      )}
      {lightboxOpen && (
        <Lightbox
          mainSrc={
            lightboxIndex === 0 ? product.mainImageUrl : product.imageUrls[lightboxIndex - 1]
          }
          nextSrc={
            lightboxIndex === 0
              ? product.imageUrls[0]
              : product.imageUrls[(lightboxIndex - 1 + 1) % product.imageUrls.length]
          }
          prevSrc={
            lightboxIndex === 0
              ? product.imageUrls[product.imageUrls.length - 1]
              : product.imageUrls[
                  (lightboxIndex - 1 + product.imageUrls.length - 1) % product.imageUrls.length
                ]
          }
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() =>
            setLightboxIndex(
              lightboxIndex === 0
                ? product.imageUrls.length
                : (lightboxIndex - 1 + product.imageUrls.length) % (product.imageUrls.length + 1)
            )
          }
          onMoveNextRequest={() =>
            setLightboxIndex((lightboxIndex + 1) % (product.imageUrls.length + 1))
          }
          reactModalStyle={{ overlay: { zIndex: 2000 } }}
        />
      )}
    </Container>
  );
};

export default Product;
