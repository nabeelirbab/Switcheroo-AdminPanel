import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Popover from '@mui/material/Popover';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { SIGN_OUT_MUTATION } from '../../../graphQl/signOut.gql';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Profile',
    icon: 'eva:person-fill',
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const [open, setOpen] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from local storage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const [signOut] = useMutation(SIGN_OUT_MUTATION, {
    onCompleted: () => {
      router.push('/login');
    },
    onError: (error) => {
      console.error('Sign out failed:', error);
    },
  });

  const handleLogout = async () => {
    try {
      await signOut();
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={user?.avatarUrl || ''}
          alt={`${user?.firstName} ${user?.lastName}`}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {(user?.firstName && user?.firstName.charAt(0).toUpperCase()) ||
            (user?.lastName && user?.lastName.charAt(0).toUpperCase())}
        </Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.firstName.charAt(0).toUpperCase()}${user?.firstName.slice(1)} ${
              user?.lastName
            }`}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} >
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label} onClick={handleClose}>
            {option.label}
          </MenuItem>
        ))}

        <Divider sx={{ borderStyle: 'dashed', m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: 'body2', color: 'error.main', py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
