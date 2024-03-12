import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

export default function ShopProductCard({ product, handleDeleteItem }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    console.log('Deleting item with ID:', product.id);
    handleDeleteItem(product.id)
      .then(() => {
        setIsDeleting(false);
      })
      .catch(() => {
        setIsDeleting(false);
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
      <Box sx={{ pt: '100%', position: 'relative' }}>{renderImg}</Box>
      <Stack spacing={2} sx={{ p: 2 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.title}
        </Link>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.description}
          </Typography>
          {renderPrice}
        </Stack>
      </Stack>
      <TableCell>
        <Label
          sx={{ cursor: 'pointer' }}
          color="error"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Label>
      </TableCell>
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
    priceSale: PropTypes.number,
  }),
  handleDeleteItem: PropTypes.func.isRequired,
};
