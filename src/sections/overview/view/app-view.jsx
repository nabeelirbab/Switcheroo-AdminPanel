import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Line,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { Select, MenuItem, FormControl } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import GenderCount from '../gender-count';
import AppWidgetSummary from '../app-widget-summary';
import CategoriesItemCount from '../categories-item-count';
import { GET_ALL_USERS } from '../../../graphQl/getAllUsers.gql';
import { GENDER_COUNT } from '../../../graphQl/usersGenderCount.gql';
import { TOTAL_ITEMS } from '../../../graphQl/AllItemInDatabase.gql';
import { ITEM_ENGAGEMENTS } from '../../../graphQl/ItemEngagement.gql';
import { USER_ENGAGEMENTS } from '../../../graphQl/UserEngagement.gql';
import { OFFER_ENGAGEMENTS } from '../../../graphQl/offerEngagement.gql';
import { GET_REPORTED_USERS } from '../../../graphQl/RestrictedUsers.gql';
import { RESTRICTED_PRODUCTS } from '../../../graphQl/RestrictedItem.gql';
import { CATEGORIES_ITEM_COUNT } from '../../../graphQl/CategoriesItemCount.gql';

// ----------------------------------------------------------------------

export default function AppView() {
  const [selectedOption, setSelectedOption] = useState('daily');
  const [selectedOptionItem, setSelectedOptionItem] = useState('daily');
  const [selectedOptionOffer, setSelectedOptionOffer] = useState('daily');

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

  const {
    loading: userEngagementloading,
    error: userEngagementerror,
    data: userEngagementData,
  } = useQuery(USER_ENGAGEMENTS);

  const {
    loading: itemEngagementloading,
    error: itemEngagementerror,
    data: itemEngagementData,
  } = useQuery(ITEM_ENGAGEMENTS);

  const {
    loading: offerEngagementloading,
    error: offerEngagementerror,
    data: offerEngagementData,
  } = useQuery(OFFER_ENGAGEMENTS);

  if (
    loading ||
    userLoading ||
    productsLoading ||
    itemloading ||
    restrictedUserLoading ||
    totalitemsLoading ||
    userEngagementloading ||
    itemEngagementloading ||
    offerEngagementloading
  )
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
      >
        <CircularProgress />
      </div>
    );
  if (
    error ||
    userError ||
    productsError ||
    itemerror ||
    restrictedUserError ||
    totalitemsError ||
    userEngagementerror ||
    itemEngagementerror ||
    offerEngagementerror
  ) {
    console.log(
      'Error:',
      error?.message ||
        userError?.message ||
        itemerror?.message ||
        productsError?.message ||
        restrictedUserError?.message ||
        totalitemsError?.message ||
        userEngagementerror?.message ||
        itemEngagementerror?.message ||
        offerEngagementerror?.message
    );
    return (
      <p>
        Error:{' '}
        {error?.message ||
          userError?.message ||
          itemerror?.message ||
          productsError?.message ||
          restrictedUserError?.message ||
          totalitemsError?.message ||
          userEngagementerror?.message ||
          itemEngagementerror?.message ||
          offerEngagementerror?.message}
      </p>
    );
  }
  const Count = userdata.users.totalCount;
  console.log(error, 'error');

  console.log(ProductsCountdata, 'Products Count before filter');
  const ProductsCount = ProductsCountdata?.restrictedItems
    ? ProductsCountdata.restrictedItems.reduce((count, product) => {
        if (product.targetItem && product.targetItem.length > 0) {
          return count + 1;
        }
        return count;
      }, 0)
    : 0;

  console.log(restricteduserdata, 'restricted user before filter');
  // const RestrictedUsersCount = restricteduserdata?.restrictedUsers.length;
  const RestrictedUsersCount = restricteduserdata?.restrictedUsers
    ? restricteduserdata.restrictedUsers.reduce((count, product) => {
        if (product.targetUser && product.targetUser.length > 0) {
          return count + 1;
        }
        return count;
      }, 0)
    : 0;

  const TotalItemsCount = totalitemsdata.allItemsInDatabase.totalCount;

  const genderData = data.usersGenderCount.map((item) => ({
    label: item.key,
    value: item.value,
  }));

  const categoriesItemCountData = categoriesItemData.categoriesItemCount.map((item) => ({
    label: item.key,
    value: item.value,
  }));

  const userEngagement = userEngagementData;
  console.log(userEngagement, '..');
  const itemEngagement = itemEngagementData;
  const offerEngagement = offerEngagementData;

  const getWeekDates = (week, year) => {
    const date = new Date(year, 0, 1 + (week - 1) * 7);
    const startDate = new Date(date.setDate(date.getDate() - date.getDay() + 1));
    const endDate = new Date(date.setDate(date.getDate() + 6));

    // Convert to string in the format "DD Month YYYY"
    const startDateString = `${startDate.getDate()} ${startDate.toLocaleString('default', {
      month: 'long',
    })} ${startDate.getFullYear()}`;
    const endDateString = `${endDate.getDate()} ${endDate.toLocaleString('default', {
      month: 'long',
    })} ${endDate.getFullYear()}`;

    return `${startDateString} - ${endDateString}`;
  };

  // User Engagement data for daily, monthly, and weekly engagement
  const dailyData = userEngagement.userEngagement.dailyRegistrationTrend.slice(-10).map((item) => ({
    date: item.date.split('T')[0],
    count: item.count,
  }));

  const monthlyData = userEngagement.userEngagement.monthlyRegistrationTrend
    .slice(-12)
    .map((item) => ({
      label: `${item.month}/${item.year}`,
      count: item.count,
    }));

  const weeklyData = userEngagement.userEngagement.weeklyRegistrationTrend
    .slice(-12)
    .map((item) => ({
      label: getWeekDates(item.week, item.year),
      count: item.count,
    }));
  console.log(weeklyData, 'USER ENGAGEMENT WEEKLY DATA');

  // Item Engagement data for daily, monthly, and weekly engagement

  const dailyItemData = itemEngagement.itemEngagement.dailyRegistrationTrend
    .slice(-10)
    .map((item) => ({
      date: item.date.split('T')[0],
      count: item.count,
    }));

  const monthlyItemData = itemEngagement.itemEngagement.monthlyRegistrationTrend
    .slice(-12)
    .map((item) => ({
      label: `${item.month}/${item.year}`,
      count: item.count,
    }));

  const weeklyItemData = itemEngagement.itemEngagement.weeklyRegistrationTrend
    .slice(-12)
    .map((item) => ({
      label: getWeekDates(item.week, item.year),
      count: item.count,
    }));

  // Offer Engagement data for daily, monthly, and weekly engagement

  const dailyOfferData = offerEngagement.offerEngagement.dailyTrend.slice(-10).map((item) => ({
    date: item.date.split('T')[0],
    count: item.count,
  }));

  const monthlyOfferData = offerEngagement.offerEngagement.monthlyTrend.slice(-12).map((item) => ({
    label: `${item.month}/${item.year}`,
    count: item.count,
  }));

  const weeklyOfferData = offerEngagement.offerEngagement.weeklyTrend.slice(-12).map((item) => ({
    label: getWeekDates(item.week, item.year),
    count: item.count,
  }));

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleItemOptionChange = (event) => {
    setSelectedOptionItem(event.target.value);
  };

  const handleOfferOptionChange = (event) => {
    setSelectedOptionOffer(event.target.value);
  };

  const renderChart = () => {
    switch (selectedOption) {
      case 'daily':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#1877f2" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#ffc658" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderChartItemEngagement = () => {
    switch (selectedOptionItem) {
      case 'daily':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyItemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyItemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#f05b5b" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyItemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#d0f05b" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  const renderChartOfferEngagement = () => {
    switch (selectedOptionOffer) {
      case 'daily':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyOfferData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2fe4eb" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'weekly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyOfferData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#2feb7d" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'monthly':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyOfferData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#f071e1" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

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
            total={RestrictedUsersCount}
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

      <Container
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow:
            '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          marginTop: '20px',
        }}
      >
        <FormControl variant="outlined" sx={{ m: 2 }}>
          <Typography sx={{ marginBottom: '10px' }} variant="h6">
            User Engagements{' '}
          </Typography>
          <Select value={selectedOption} onChange={handleOptionChange}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        {renderChart()}
      </Container>

      <Container
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow:
            '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          marginTop: '20px',
        }}
      >
        <FormControl variant="outlined" sx={{ m: 2 }}>
          <Typography sx={{ marginBottom: '10px' }} variant="h6">
            Item Engagements{' '}
          </Typography>
          <Select value={selectedOptionItem} onChange={handleItemOptionChange}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        {renderChartItemEngagement()}
      </Container>

      <Container
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          padding: '20px',
          boxShadow:
            '0 0 2px 0 rgba(145, 158, 171, 0.08), 0 12px 24px -4px rgba(145, 158, 171, 0.08)',
          marginTop: '20px',
        }}
      >
        <FormControl variant="outlined" sx={{ m: 2 }}>
          <Typography sx={{ marginBottom: '10px' }} variant="h6">
            Offer Engagements{' '}
          </Typography>
          <Select value={selectedOptionOffer} onChange={handleOfferOptionChange}>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>
        {renderChartOfferEngagement()}
      </Container>
    </Container>
  );
}
