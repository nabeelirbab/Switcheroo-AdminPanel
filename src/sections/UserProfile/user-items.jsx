import React from 'react';

import { Box, Card, CardMedia, Typography, CardContent } from '@mui/material';

const ListedItems = () => {
  // Dummy Data
  const items = [
    {
      id: 1,
      title: 'Car Charger',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      price: '$19.99',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      title: 'Remote',
      description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      price: '$29.99',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 3,
      title: 'Headphones',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      price: '$39.99',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 4,
      title: 'Airpods',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      price: '$39.99',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 5,
      title: 'Wireless Charger',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      price: '$39.99',
      imageUrl: 'https://via.placeholder.com/150',
    },
    {
      id: 6,
      title: 'Product 4',
      description:
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      price: '$39.99',
      imageUrl: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <Card elevation={3}>
      <Typography variant="h4" sx={{ p: '20px' }}>
        Uploaded Items
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', p: '20px', marginBottom: '20px' }}>
        {items.map((item) => (
          <Card key={item.id} sx={{ maxWidth: 300, boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <CardMedia component="img" height="180" image={item.imageUrl} alt={item.title} />
            <CardContent>
              <Typography variant="h5" component="div">
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
              <Typography sx={{ pt: '10px' }} variant="body2" color="text.secondary">
                <strong>Price:</strong> {item.price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Card>
  );
};

export default ListedItems;
