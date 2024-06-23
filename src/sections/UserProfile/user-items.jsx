import axios from 'axios';
import PropTypes from 'prop-types';
import 'react-image-lightbox/style.css';
import { useQuery } from '@apollo/client';
import React, { lazy, useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Grid,
  Divider,
  CardMedia,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { GET_ALL_ITEMS_BY_USER } from '../../graphQl/allItemsbyUser.gql';

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

const ListedItems = ({ user }) => {
  console.log(user.id, 'user id passing...');
  const { loading, error, data } = useQuery(GET_ALL_ITEMS_BY_USER, {
    variables: { userId: user.id },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [locations, setLocations] = useState({});

  console.log(currentItemIndex)

  useEffect(() => {
    if (data) {
      const fetchLocations = async () => {
        const items = data.allItemsByUser.data.filter((item) => !item.isDeleted);
        const locationPromises = items.map(async (item) => {
          const locationName = await getLocationName(item.latitude, item.longitude);
          return { id: item.id, locationName };
        });
        const resolvedLocations = await Promise.all(locationPromises);
        const newLocations = resolvedLocations.reduce((acc, { id, locationName }) => {
          acc[id] = locationName;
          return acc;
        }, {});
        setLocations(newLocations);
      };
      fetchLocations();
    }
  }, [data]);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography variant="body1">Error fetching data.</Typography>;

  const items = data?.allItemsByUser?.data.filter((item) => !item.isDeleted) || [];

  const handleImageClick = (item, index) => {
    const imageUrls =
      item.imageUrls && item.imageUrls.length > 0
        ? [item.mainImageUrl, ...item.imageUrls]
        : [item.mainImageUrl];
    setCurrentImages(imageUrls);
    setPhotoIndex(0);
    setCurrentItemIndex(index);
    setIsOpen(true);
  };

  return (
    <Card elevation={3}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ p: '20px' }}>
          Uploaded Items
        </Typography>
        <Typography variant="h5" sx={{ p: '20px 2px', color: 'grey' }}>
          {items.length}
        </Typography>
      </Box>

      {items.length === 0 ? (
        <Typography variant="body1" sx={{ p: '20px' }}>
          There are no items listed by this user.
        </Typography>
      ) : (
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', p: '20px', marginBottom: '20px' }}
        >
          {items.map((item, index) => (
            <Card key={item.id} sx={{ width: 350, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
              <CardMedia
                component="img"
                height="180"
                image={item.mainImageUrl}
                alt={item.title}
                onClick={() => handleImageClick(item, index)}
                style={{ cursor: 'pointer' }}
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>{item.description}</Typography>
                <Typography sx={{ pt: '10px' }} variant="body2" color="text.secondary">
                  <strong>Price:</strong> {item.askingPrice} $
                </Typography>
                {locations[item.id] && (
                  <Typography sx={{ pt: '10px' }} variant="body2" color="text.secondary">
                    <strong>Location:</strong> {locations[item.id]}
                  </Typography>
                )}
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Categories
                </Typography>
                <Grid container spacing={1}>
                  {item.categories.map((category, ind) => (
                    <Grid item key={ind}>
                      <Chip label={category} variant="outlined" />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {isOpen && (
        <Lightbox
          mainSrc={currentImages[photoIndex]}
          nextSrc={
            currentImages.length > 1 ? currentImages[(photoIndex + 1) % currentImages.length] : null
          }
          prevSrc={
            currentImages.length > 1
              ? currentImages[(photoIndex + currentImages.length - 1) % currentImages.length]
              : null
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + currentImages.length - 1) % currentImages.length)
          }
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % currentImages.length)}
          reactModalStyle={{ overlay: { zIndex: 2000 } }}
        />
      )}
    </Card>
  );
};

ListedItems.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default ListedItems;
