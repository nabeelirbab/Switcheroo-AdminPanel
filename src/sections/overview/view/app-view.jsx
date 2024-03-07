import { gql, useQuery } from '@apollo/client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import GenderCount from '../gender-count';
import AppWidgetSummary from '../app-widget-summary';
import CategoriesItemCount from '../categories-item-count';

// ----------------------------------------------------------------------

const GENDER_COUNT = gql`
  query usersGenderCount {
    usersGenderCount {
      key
      value
    }
  }
`;

const CATEGORIES_ITEM_COUNT = gql`
  query CategoriesItemCount {
    categoriesItemCount {
      key
      value
    }
  }
`;

const GET_ALL_USERS = gql`
  query getAllUsers {
    users(limit: 100) {
      totalCount
    }
  }
`;

const RESTRICTED_PRODUCTS = gql`
  query RestrictedItems {
    restrictedItems {
      id
    }
  }
`;

const GET_REPORTED_USERS = gql`
  query RestrictedUsers {
    restrictedUsers {
      id
    }
  }
`;
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

export default function AppView() {
  const { data: userdata, loading: userLoading, error: userError } = useQuery(GET_ALL_USERS);
  const {
    data: totalitemsdata,
    loading: totalitemsLoading,
    error: totalitemsError,
  } = useQuery(TOTAL_ITEMS);
  const {
    data: restricteduserdata,
    loading: restrictedUserLoading,
    error: restrictedUserError,
  } = useQuery(GET_REPORTED_USERS);
  const {
    data: ProductsCountdata,
    loading: productsLoading,
    error: productsError,
  } = useQuery(RESTRICTED_PRODUCTS);
  const { loading, error, data } = useQuery(GENDER_COUNT);
  const {
    loading: itemloading,
    error: itemerror,
    data: categoriesItemData,
  } = useQuery(CATEGORIES_ITEM_COUNT);

  if (
    loading ||
    userLoading ||
    productsLoading ||
    itemloading ||
    restrictedUserLoading ||
    totalitemsLoading
  )
    return <p>Loading...</p>;
  if (error || userError || productsError || itemerror || restrictedUserError || totalitemsError)
    return (
      <p>
        Error:{' '}
        {error?.message ||
          userError?.message ||
          itemerror?.message ||
          productsError?.message ||
          restrictedUserError?.message ||
          totalitemsError.message}
      </p>
    );

  const Count = userdata.users.totalCount;
  const ProductsCount = ProductsCountdata?.restrictedItems?.length;
  const RestricteduserCount = restricteduserdata?.restrictedUsers?.length;
  const TotalItemsCount = totalitemsdata.allItemsInDatabase.totalCount
  console.log(TotalItemsCount,'.........')


  console.log(data.usersGenderCount);
  const genderData = data.usersGenderCount.map((item) => ({
    label: item.key,
    value: item.value,
  }));

  const categoriesItemCountData = categoriesItemData.categoriesItemCount.map((item) => ({
    label: item.key,
    value: item.value,
  }));

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Users"
            total={Count}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Total Items"
            total={TotalItemsCount}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Reported Users"
            total={RestricteduserCount}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Reported Items"
            total={ProductsCount}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <CategoriesItemCount
            title="Categories Item Count"
            chart={{
              series: categoriesItemCountData,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <GenderCount
            title="Gender Count"
            chart={{
              series: genderData,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
