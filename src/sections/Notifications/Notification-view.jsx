import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';
import { useQuery, useMutation } from '@apollo/client';

import {
  Box,
  Card,
  Modal,
  Button,
  Checkbox,
  Container,
  TextField,
  FormGroup,
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
  const [notificationData, setNotificationData] = useState({
    title: '',
    description: '',
    gender: '',
    item: '',
  });
  const [formErrors, setFormErrors] = useState({
    title: '',
    description: '',
    filters: '',
  });
  const [allUsers, setAllUsers] = useState(false);

  React.useEffect(() => {
    if (!openModal) {
      setNotificationData({ title: '', description: '', gender: '', item: '' });
      setFormErrors({ title: '', description: '', filters: '' });
      setAllUsers(false);
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
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? '' : 'This field is required',
    }));
  };

  const handleCheckboxChange = (e, category) => {
    const { name, checked } = e.target;
    setNotificationData((prevData) => ({
      ...prevData,
      [category]: checked ? name : '',
    }));
  };

  const handleAllUsersChange = (e) => {
    const { checked } = e.target;
    setAllUsers(checked);
    if (checked) {
      setNotificationData((prevData) => ({
        ...prevData,
        gender: '',
        item: '',
      }));
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        filters: '',
      }));
    }
  };

  const handleSendNotification = async () => {
    const { title, description, gender, item } = notificationData;
    const errors = {
      title: title ? '' : 'Title is required',
      description: description ? '' : 'Description is required',
      filters: '',
    };

    if (!allUsers && (!gender || !item)) {
      errors.filters = 'Either "All Users" must be checked or both gender and item filters must be selected.';
      toast.error(errors.filters);
    }

    setFormErrors(errors);

    if (!title || !description || errors.filters) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createCustomNotification({
        variables: {
          title,
          description,
          genderFilter: allUsers ? null : gender,
          itemFilter: allUsers ? null : item,
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
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
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
            error={!!formErrors.title}
            helperText={formErrors.title}
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
            error={!!formErrors.description}
            helperText={formErrors.description}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={allUsers}
                onChange={handleAllUsersChange}
              />
            }
            label="All Users"
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Gender
          </Typography>
          <FormGroup row sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="Male"
                  checked={notificationData.gender === 'Male'}
                  onChange={(e) => handleCheckboxChange(e, 'gender')}
                  disabled={allUsers}
                />
              }
              label="Male"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="Female"
                  checked={notificationData.gender === 'Female'}
                  onChange={(e) => handleCheckboxChange(e, 'gender')}
                  disabled={allUsers}
                />
              }
              label="Female"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="Others"
                  checked={notificationData.gender === 'Others'}
                  onChange={(e) => handleCheckboxChange(e, 'gender')}
                  disabled={allUsers}
                />
              }
              label="Others"
            />
          </FormGroup>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Item
          </Typography>
          <FormGroup row sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  name="No Items"
                  checked={notificationData.item === 'No Items'}
                  onChange={(e) => handleCheckboxChange(e, 'item')}
                  disabled={allUsers}
                />
              }
              label="No Items"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="At Least One Item"
                  checked={notificationData.item === 'At Least One Item'}
                  onChange={(e) => handleCheckboxChange(e, 'item')}
                  disabled={allUsers}
                />
              }
              label="At Least One Item"
            />
          </FormGroup>
          {formErrors.filters && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {formErrors.filters}
            </Typography>
          )}
          <Button variant="contained" onClick={handleSendNotification}>
            Send
          </Button>
        </Box>
      </Modal>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </Container>
  );
}
