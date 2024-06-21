import PropTypes from 'prop-types';
import React, { useState } from 'react';
import 'react-image-lightbox/style.css';
import { useQuery } from '@apollo/client';
import Lightbox from 'react-image-lightbox';

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

const ListedItems = ({ user }) => {
  console.log(user.id, 'user id passing...');
  const { loading, error, data } = useQuery(GET_ALL_ITEMS_BY_USER, {
    variables: { userId: user.id },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [currentImages, setCurrentImages] = useState([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  console.log(currentItemIndex)

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography variant="body1">Error fetching data.</Typography>;

  const items = data?.allItemsByUser?.data.filter((item) => !item.isDeleted) || []; // Filter out deleted items

  const handleImageClick = (item, index) => {
    const imageUrls =
      item.imageUrls && item.imageUrls.length > 0
        ? [item.mainImageUrl, ...item.imageUrls]
        : [item.mainImageUrl];
    setCurrentImages(imageUrls);
    setPhotoIndex(0); // Reset photo index when changing items
    setCurrentItemIndex(index); // Track current item index
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', p: '20px', marginBottom: '20px' }}>
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
          reactModalStyle={{ overlay: { zIndex: 2000 } }} // Ensure Lightbox appears on top
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
