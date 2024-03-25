import { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

import Fade from '@mui/material/Fade';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// import { products } from 'src/_mock/products';

import ProductCard from '../product-card';

// ----------------------------------------------------------------------

const TOTAL_ITEMS = gql`
  query AllItemsInDatabase {
    allItemsInDatabase(limit: 1000) {
      totalCount
      data {
        askingPrice
        description
        id
        mainImageUrl
        title
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
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteItem] = useMutation(DELETE_ITEM);
  const { loading: itemloading, error: itemerror, data: itemdata } = useQuery(TOTAL_ITEMS);

  if (itemloading) return <p>Loading...</p>;
  if (itemerror) return <p>Error: {itemerror.message}</p>;

  const allItems = itemdata.allItemsInDatabase.data;

  if (allItems.length === 0) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Total Items
        </Typography>
        <Typography variant="body1">No Items available.</Typography>
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
        refetchQueries: [{ query: TOTAL_ITEMS }],
      });
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Total Items
      </Typography>

      <TextField
        label="Search by Title"
        variant="outlined"
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {filteredItems.map((product) => (
          <Fade in key={product.id}>
            <Grid item xs={12} sm={6} md={3}>
              <ProductCard product={product} handleDeleteItem={handleDeleteItem} />
            </Grid>
          </Fade>
        ))}
      </Grid>
    </Container>
  );
}
