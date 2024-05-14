import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';

import {
  Box,
  Card,
  Modal,
  Radio,
  Button,
  Container,
  TextField,
  RadioGroup,
  Typography,
  CardContent,
  CircularProgress,
  FormControlLabel,
} from '@mui/material';

import { NOTIFICATIONS, CREATE_CUSTOM_NOTIFICATION } from '../../graphQl/getNotifications.gql';

export default function NotificationView() {
  const navigateTo = useNavigate();
  const { loading, error, data, refetch } = useQuery(NOTIFICATIONS);
  const [createCustomNotification] = useMutation(CREATE_CUSTOM_NOTIFICATION);
  const [openModal, setOpenModal] = useState(false);
  const [notificationData, setNotificationData] = useState({ title: '', description: '', gender: '', item: '' });

  React.useEffect(() => {
    if (!openModal) {
      setNotificationData({ title: '', description: '', gender: '', item: '' });
    }
  }, [openModal]);

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked, Data being passed:', notification);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotificationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenderChange = (e) => {
    setNotificationData((prevData) => ({
      ...prevData,
      gender: e.target.value,
    }));
  };
  
  const handleItemChange = (e) => {
    setNotificationData((prevData) => ({
      ...prevData,
      item: e.target.value,
    }));
  };

  const handleSendNotification = async () => {
    try {
      await createCustomNotification({
        variables: {
          title: notificationData.title,
          description: notificationData.description,
          genderFilter: notificationData.gender,
          itemFilter: notificationData.item,
        },
      });
      handleCloseModal();
      refetch();
      toast.success('Notification successfully sent!');
      console.log('Notification added');
    } catch (err) {
      console.error('Error creating custom notification:', err);
      toast.error('Error creating custom notification');
    }
  };

  if (loading)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      >
        <CircularProgress />
      </div>
    );
  if (error) return <p>Error: {error?.message}</p>;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Notifications
      </Typography>

      <Button variant="contained" onClick={handleOpenModal} sx={{ mb: 2 }}>
        Create Notification
      </Button>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 4,
          padding: 3,
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          boxShadow: '10px rgba(0, 0, 0, 1)',
        }}
      >
        {data.notifications
          .slice()
          .reverse()
          .map((notification, index) => (
            <Card key={notification.id} sx={{ minWidth: 330, maxWidth: 330, minHeight: 150 }}>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' }}>
                    <Typography
                      variant="h6"
                      sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}
                    >
                      Notification {data.notifications.length - index}
                    </Typography>
                    <Typography variant="caption">
                      {new Date(notification.createdAt).toLocaleString()}
                    </Typography>
                  </Box>

                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Title: {notification.title}
                  </Typography>
                  <Typography align="justify" variant="body2">
                    Description: {notification.description}
                  </Typography>
                </div>
                <Button
                  sx={{ mt: 2, width: '50%', fontSize: '14px' }}
                  variant="outlined"
                  onClick={() => {
                    handleNotificationClick(notification);
                    navigateTo(`/notifications/${notification.id}`, {
                      state: { notification, index },
                    });
                  }}
                >
                  View Status
                </Button>
              </CardContent>
            </Card>
          ))}
      </Box>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            minWidth: 400,
            maxWidth: '80%',
          }}
        >
          <Button onClick={handleCloseModal} sx={{ position: 'absolute', top: 0, right: 0 }}>
            x
          </Button>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            Add Notification
          </Typography>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={notificationData.title}
            onChange={handleInputChange}
            inputProps={{ maxLength: 500 }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={notificationData.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            inputProps={{ maxLength: 3000 }}
            sx={{ mb: 2 }}
          />
          <RadioGroup
            aria-label="gender"
            name="gender"
            value={notificationData.gender}
            onChange={handleGenderChange}
            sx={{ flexDirection: 'row', mb: 2 }}
          >
            <FormControlLabel value="Male" control={<Radio />} label="Male" />
            <FormControlLabel value="Female" control={<Radio />} label="Female" />
            <FormControlLabel value="Others" control={<Radio />} label="Others" />
          </RadioGroup>
          <RadioGroup
            aria-label="item"
            name="item"
            value={notificationData.item}
            onChange={handleItemChange}
            sx={{ flexDirection: 'row', mb: 2 }}
          >
            <FormControlLabel value="No Items" control={<Radio />} label="No Items" />
            <FormControlLabel
              value="At Least One Item"
              control={<Radio />}
              label="At Least One Item"
            />
          </RadioGroup>
          <Button variant="contained" onClick={handleSendNotification}>
            Send
          </Button>
        </Box>
      </Modal>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
}
