import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import { Box, Card, CardMedia, Typography, CardContent, CircularProgress } from '@mui/material';

import { GET_ALL_ITEMS_BY_USER } from '../../graphQl/allItemsbyUser.gql';

const ListedItems = ({ user }) => {
  console.log(user.id, 'user id passing...');
  const { loading, error, data } = useQuery(GET_ALL_ITEMS_BY_USER, {
    variables: { userId: user.id },
  });
  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );

  if (error) return <Typography variant="body1">Error fetching data.</Typography>;

  const items = data.allItemsByUser.data.filter(item => !item.isDeleted); // Filter out deleted items
  console.log(items, 'items data');

  console.log(user.id, 'idddddddd');
  return (
    <Card elevation={3}>
      <Typography variant="h4" sx={{ p: '20px' }}>
        Uploaded Items
      </Typography>
      {items.length === 0 ? (
        <Typography variant="body1" sx={{ p: '20px' }}>
          There are no items listed by this user.
        </Typography>
      ) : (
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', p: '20px', marginBottom: '20px' }}
        >
          {items.map((item) => (
            <Card
              key={item.id}
              sx={{ width: 300, height: '350px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}
            >
              <CardMedia component="img" height="180" image={item.mainImageUrl} alt={item.title} />
              <CardContent>
                <Typography variant="h6" component="div">
                  {item.title}
                </Typography>
                <Typography sx={{ fontSize: '14px' }}>{item.description}</Typography>
                <Typography sx={{ pt: '10px' }} variant="body2" color="text.secondary">
                  <strong>Price:</strong> {item.askingPrice} $
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Card>
  );
};

export default ListedItems;

ListedItems.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
