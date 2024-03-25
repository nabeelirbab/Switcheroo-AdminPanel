import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

export default function UserTableRow({
  selected,
  name,
  email,
  totalitems,
  matchedItems,
  avatarUrl,
  status,
  handleDelete,
  lastname,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  const handleOpenMenu = (event) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenu(null);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteConfirm(false);
    handleDelete();
  };

  const handleOpenDeleteConfirm = () => {
    setOpenDeleteConfirm(true);
    handleCloseMenu();
  };

  const handleCloseDeleteConfirm = () => {
    setOpenDeleteConfirm(false);
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell component="th" scope="row">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name} {lastname}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{totalitems}</TableCell>

        <TableCell align="center">{matchedItems}</TableCell>

        <TableCell>
          <Label color={(status === 'banned' && 'error') || 'success'}>Active</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openMenu}
        anchorEl={openMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        transformOrigin={{ vertical: 'center', horizontal: 'center' }}
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
            <Button variant="contained" onClick={handleConfirmDelete} color="error">
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
  avatarUrl: PropTypes.any,
  email: PropTypes.any,
  handleDelete: PropTypes.func,
  matchedItems: PropTypes.any,
  name: PropTypes.any,
  lastname: PropTypes.any,
  totalitems: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
