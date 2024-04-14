import { useState } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function UserTableRow({
  selected,
  targetUser,
  createdUser,
  title,
  description,
  handleClick,
  handleDeleteUser,
}) {
  const [open, setOpen] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
    handleCloseMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  const handleDeleteUserss = async () => {
    const targetUserId = targetUser.id;
    console.log('Deleting item with ID:', targetUserId);
    try {
      await handleDeleteUser(targetUserId);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={targetUser?.firstName} src={targetUser?.avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {targetUser?.firstName} {targetUser?.lastName}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{title}</TableCell>

        <TableCell>{targetUser?.email}</TableCell>

        <TableCell>{description}</TableCell>

        <TableCell>
          <Label align="center">
            {createdUser?.firstName} {createdUser?.lastName}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleOpenDeleteConfirm} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Popover
        open={openDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Stack p={2} alignItems="center">
          <Typography sx={{ mb: '20px' }} variant="body1">
            Are you sure you want to delete?
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleDeleteUserss} color="error">
              Yes
            </Button>
            <Button variant="contained" onClick={handleCloseDeleteConfirm}>
              No
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
}

UserTableRow.propTypes = {
  targetUser: PropTypes.shape({
    avatarUrl: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
  createdUser: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
  }),
  handleClick: PropTypes.func,
  handleDeleteUser: PropTypes.func,
  title: PropTypes.string,
  description: PropTypes.string,
  selected: PropTypes.bool,
};
