import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
// import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export default function ShopProductCard({ product }) {
  const renderImg = product.targetItem.map((item, index) => (
    <Box
      key={index}
      component="img"
      alt={product.title}
      src={item.mainImageUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  ));

  const renderPrice = product.targetItem && product.targetItem.length > 0 && (
    <Stack direction="row" alignItems="center">
      {product.targetItem.map((item, index) => (
        <Typography key={index} variant="subtitle1">
          <Typography
            component="span"
            variant="body1"
            sx={{
              color: 'text.disabled',
              textDecoration: 'line-through',
            }}
          >
            {product.priceSale && fCurrency(product.priceSale)}
          </Typography>
          &nbsp;
          {item.askingPrice} $
        </Typography>
      ))}
    </Stack>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>{renderImg}</Box>

      <Stack spacing={2} sx={{ p: 2 }}>
        {product.targetItem &&
          product.targetItem.map((item, idx) => (
            <Link key={idx} color="inherit" underline="hover" variant="subtitle2" noWrap>
              {item.title}
            </Link>
          ))}

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography>{product.title}</Typography>
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
  product: PropTypes.object,
};
