import { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

export default function ShopProductCard({ product, handleDeleteItem }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDelete = () => {
    handleDeleteItem(product.id)
      .then(() => {
        setAnchorEl(null);
      })
      .catch(() => {
        setAnchorEl(null);
      });
  };

  const handleClickDelete = (event) => {
    event.stopPropagation(); // Prevent the card click event from firing
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const handleNoButtonClick = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleCardClick = () => {
    const productData = {
      id: product.id,
      title: product.title,
      description: product.description,
      askingPrice: product.askingPrice,
      mainImageUrl: product.mainImageUrl,
      categories: product.categories,
      imageUrls: product.imageUrls,
    };
    navigate(`/item/${product.id}`, {
      state: { product: productData },
    });
  };

  const renderImg = (
    <Box
      component="img"
      alt={product.title}
      src={product.mainImageUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ marginRight: '4px' }}>$</Box>
      {product.askingPrice}
    </Typography>
  );

  return (
    <Card>
      <Box
        sx={{
          pt: '100%',
          position: 'relative',
          cursor: 'pointer',
        }}
        onClick={handleCardClick}
      >
        {renderImg}
      </Box>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Link
          sx={{
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={handleCardClick}
          color="inherit"
          underline="hover"
          variant="h6"
          noWrap
        >
          {product.title}
        </Link>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            color="text.secondary"
            sx={{
              fontWeight: '14px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.description}
          </Typography>
          {renderPrice}
        </Stack>
        <Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
          Status:{' '}
          <Label sx={{ marginLeft: '4px' }} color={product.isDeleted ? 'error' : 'success'}>
            {product.isDeleted ? 'Deleted' : 'Active'}
          </Label>
        </Typography>
      </Stack>
      <TableCell>
        <Button
          disabled={product.isDeleted}
          sx={{ cursor: 'pointer' }}
          color="error"
          onClick={handleClickDelete}
        >
          Delete
        </Button>
      </TableCell>
      <Popover
        open={open}
        onClose={handleClosePopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Stack p={2} alignItems="center">
          <Typography sx={{ mb: '20px' }} variant="body1">
            Are you sure you want to delete?
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleDelete} color="error">
              Yes
            </Button>
            <Button variant="contained" onClick={handleNoButtonClick}>
              No
            </Button>
          </Stack>
        </Stack>
      </Popover>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
    mainImageUrl: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    askingPrice: PropTypes.number,
    isDeleted: PropTypes.bool,
    priceSale: PropTypes.number,
    categories: PropTypes.arrayOf(PropTypes.string),
    imageUrls: PropTypes.arrayOf(PropTypes.string),
  }),
  handleDeleteItem: PropTypes.func.isRequired,
};
