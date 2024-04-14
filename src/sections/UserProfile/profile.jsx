import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

const InfoBox = ({ label, value, color }) => {
  let valueColor = 'text.secondary';
  let valueStyle = {};

  // Check if the value is "status"
  if (label.toLowerCase() === 'status') {
    valueColor = '#007867'; // Set color to green for status
    valueStyle = {
      fontSize: '12px',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0, 167, 111, 0.16)',
      padding: '0px 6px',
      borderRadius: '4px',
    };
  }

  return (
    <Typography
      sx={{
        fontSize: '14px',
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
      <Typography color={valueColor} sx={{ marginLeft: '10px', ...valueStyle }}>
        {value}
      </Typography>
    </Typography>
  );
};

export default function UserProfile({ user }) {
  console.log(user.id, 'item count');

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
                      {user.name} {user.lastname}
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
                {/* <InfoBox label="Distance" value={user.distance} /> */}
                <InfoBox label="Items Count" value={user.totalitems} />
                <InfoBox label="Matched Items Count" value={user.matchedItems} color="green" />
                <InfoBox label="UnMatched Item Count" value="0" color="red" />
                <InfoBox label="Status" value="Active" />
              </Grid>
            </Grid>
          </Grid>
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

UserProfile.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lastname: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    status: PropTypes.string,
    avatarUrl: PropTypes.string,
    dateOfBirth: PropTypes.string.isRequired,
    distance: PropTypes.string.isRequired,
    totalitems: PropTypes.number.isRequired,
    matchedItems: PropTypes.number.isRequired,
    unMatchedItemCount: PropTypes.number.isRequired,
    itemImages: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
