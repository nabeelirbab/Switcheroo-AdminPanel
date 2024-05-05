import React from 'react';
import { useLocation } from 'react-router-dom';

import { Box, Grid, Paper, Divider, Container, Typography } from '@mui/material';

export default function NotificationDetails() {
  const location = useLocation();
  const notification = location.state?.notification;
  //   const index = location.state?.index;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Notification Details
      </Typography>
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: '#f5f5f5' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box>
              <Typography color="#1877F2" variant="h5">
                {notification.title}
              </Typography>
              <Typography variant="caption">
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Delivery Status
            </Typography>
            {notification.deliveryStatus.length === 0 ? (
              <Typography variant="body2">No delivery statuses available</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {notification.deliveryStatus.map((item) => (
                  <Paper
                    key={item.id}
                    elevation={1}
                    sx={{ padding: 2, backgroundColor: '#ffffff', width: 'calc(50% - 5px)' }}
                  >
                    <Typography variant="body2" color="textSecondary">
                      <span style={{ fontWeight: '500', color: 'black' }}>Username:</span>{' '}
                      {item.userName.charAt(0).toUpperCase() + item.userName.slice(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <span style={{ fontWeight: '500', color: 'black' }}>Email:</span>{' '}
                      {item.userEmail}
                    </Typography>
                    <Typography
                      sx={{
                        backgroundColor: item.status
                          ? 'rgba(0, 167, 111, 0.16)'
                          : 'rgba(255, 86, 48, 0.16)',
                        padding: '6px 10px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        width: 'fit-content',
                        marginTop: '6px',
                      }}
                      variant="subtitle1"
                      color={item.status ? '#007867' : 'red'}
                    >
                      {item.status ? 'Sent' : 'Not sent'}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
