import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

const InfoBox = ({ label, value, color }) => (
  <Typography
    sx={{
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      fontWeight: '600',
      marginTop: '10px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
      ...(color && { color }),
    }}
    variant="body2"
    color="text.primary"
  >
    {label}:{' '}
    <Typography color="text.secondary" sx={{ marginLeft: '10px' }}>
      {value}
    </Typography>
  </Typography>
);

export default function UserProfile() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://via.placeholder.com/150',
    dateOfBirth: '1990-01-01',
    distance: '5 miles',
    itemCount: 10,
    matchedItemCount: 5,
    unMatchedItemCount: 5,
    itemImages: [
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
      'https://via.placeholder.com/100',
    ],
  };

  return (
    <Card sx={{ padding: '20px' }}>
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Grid container justifyContent="center" alignItems="center">
              <Box sx={{ justifyContent: 'center' }}>
                <Grid container direction="column" alignItems="center">
                  <Grid item xs={12}>
                    <Avatar alt={user.name} src={user.avatarUrl} sx={{ width: 100, height: 100 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      sx={{ marginTop: '10px', textAlign: 'center' }}
                      gutterBottom
                      variant="h3"
                      component="div"
                    >
                      {user.name}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Grid item xs={12}>
                <InfoBox label="Email" value={user.email} />
                <InfoBox
                  label="Date of Birth"
                  value={new Date(user.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
                <InfoBox label="Distance" value={user.distance} />
                <InfoBox label="Item Count" value={user.itemCount} />
                <InfoBox
                  label="Matched Item Count"
                  value={user.matchedItemCount}
                  color={user.matchedItemCount > 0 ? 'green' : null}
                />
                <InfoBox
                  label="Unmatched Item Count"
                  value={user.unMatchedItemCount}
                  color={user.unMatchedItemCount > 0 ? 'red' : null}
                />
              </Grid>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              <strong>Item Images:</strong>
            </Typography>
            <Grid container spacing={2}>
              {user.itemImages.map((imageUrl, index) => (
                <Grid item key={index}>
                  <img
                    src={imageUrl}
                    alt={`Item ${index + 1}`}
                    style={{
                      borderRadius: '5px',
                      boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                      width: '100px',
                      height: '100px',
                      margin: '5px',
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid> */}
        </Grid>
      </CardContent>
    </Card>
  );
}

// PropTypes validation
InfoBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  color: PropTypes.string,
};
