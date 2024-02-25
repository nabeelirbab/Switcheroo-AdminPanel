import { gql, useQuery, useMutation } from '@apollo/client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

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
        categories
        createdByUserId
        description
        flexibilityRange
        id
        imageUrls
        isFlexible
        isHidden
        isSwapOnly
        latitude
        longitude
        mainImageUrl
        title
        updatedByUserId
      }
    }
  }
`;

const DELETE_ITEM = gql`
  mutation DeleteItem($userId: ID!) {
    deleteUser(itemId: $itemId)
  }
`;


export default function ProductsView() {
  const { loading, error, data, refetch } = useQuery(RESTRICTED_PRODUCTS);
  const [deleteItem] = useMutation(DELETE_ITEM);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data.restrictedItems, '.....Restricted Products....');

  const restrictedProducts = data.restrictedItems;

  

  const handleDeleteItem = async (userId) => {
    try {
      console.log('userId passed to handleDeleteUser:', userId);
      await deleteItem({
        variables: {
          userIds: userId,
        },
      });
      refetch();
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Reported Products
      </Typography>

      <Grid container spacing={3}>
        {restrictedProducts.map((product) => (
          <Grid key={restrictedProducts.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} handleDeleteItem={handleDeleteItem} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
