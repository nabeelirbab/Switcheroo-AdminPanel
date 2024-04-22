import { gql, useQuery, useMutation } from '@apollo/client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Box, CircularProgress } from '@mui/material';

import ProductCard from '../product-card';

// ----------------------------------------------------------------------

const RESTRICTED_PRODUCTS = gql`
  query RestrictedItems {
    restrictedItems {
      createdByUserId
      description
      id
      targetItemId
      targetUserId
      title
      updatedByUserId
      targetItem {
        askingPrice
        description
        id
        imageUrls
        mainImageUrl
        title
        updatedByUserId
      }
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($itemId: Uuid!) {
    deleteItem(itemId: $itemId)
  }
`;

export default function ProductsView() {
  const { loading, error, data } = useQuery(RESTRICTED_PRODUCTS);
  const [deleteItem] = useMutation(DELETE_ITEM);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  if (error) return <p>Error: {error.message}</p>;
  console.log(data.restrictedItems, '.....Restricted Products....');

  const restrictedProducts = data.restrictedItems || [];

  const hasRestrictedProducts = restrictedProducts.some((product) => product.targetItem.length > 0);

  if (!hasRestrictedProducts) {
    return (
      <Container>
        <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
          <Typography variant="h4" sx={{ p: '20px 10px 20px 20px' }}>
            Reported Items -
          </Typography>
          <Typography variant="h5" sx={{ p: '20px 0px', color: 'grey' }}>
            {restrictedProducts.length}
          </Typography>
        </Box>
        <Typography variant="body1">No restricted Items available.</Typography>
      </Container>
    );
  }

  const handleDeleteItem = async (itemId) => {
    try {
      if (!itemId) {
        console.error('Error deleting item: ItemId is null or undefined');
        return;
      }

      console.log('itemId passed to handleDeleteItem:', itemId);
      await deleteItem({
        variables: {
          itemId: String(itemId),
        },
        refetchQueries: [{ query: RESTRICTED_PRODUCTS }],
      });
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', alignItems: 'baseline', marginBottom: '10px' }}>
        <Typography variant="h4">Reported Items -</Typography>
        <Typography variant="h5" sx={{ paddingLeft: '5px', color: 'grey' }}>
          {restrictedProducts.length}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {restrictedProducts
          .filter((product) => product.targetItem.length > 0)
          .map((product) => (
            <Grid key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} handleDeleteItem={handleDeleteItem} />
            </Grid>
          ))}
      </Grid>
    </Container>
  );
}
