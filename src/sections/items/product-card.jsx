import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';
// import { fCurrency } from 'src/utils/format-number';

export default function ShopProductCard({ product }) {
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
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {product.priceSale && (product.priceSale)}
      </Typography>
      &nbsp;
      {(product.askingPrice)} $ 
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
          <Typography>{product.description}</Typography>
          {renderPrice}
        </Stack>
      </Stack>
      <TableCell>
        <Label sx={{ cursor: 'pointer' }} color="error">
          Delete
        </Label>
      </TableCell>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.shape({
    mainImageUrl: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    askingPrice: PropTypes.number,
    priceSale: PropTypes.number,
  }),
};
