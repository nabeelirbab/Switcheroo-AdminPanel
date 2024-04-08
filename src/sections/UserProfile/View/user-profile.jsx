import React from 'react';
import PropTypes from 'prop-types';

import { Box, Tab, Tabs, AppBar, Typography } from '@mui/material';

import ChatList from '../chats';
import UserProfile from '../profile';
import ListedItems from '../user-items';

// const query = `
//   query AllItemsInDatabase {
//     allItemsInDatabase(limit: 100) {
//       cursor
//       hasNextPage
//       totalCount
//     }
//   }
// `;

// fetch('http://16.171.36.179:5000', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     // Add any other headers as needed, e.g., authorization token
//   },
//   body: JSON.stringify({ query }),
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log('Query result:', data);
//   })
//   .catch((error) => {
//     console.error('Error executing query:', error);
//   });

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function ProfileTabs() {
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 5 }}>
        User Profile
      </Typography>
      <AppBar position="static" style={{ backgroundColor: 'white' }}>
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Profile tabs">
          <Tab
            label="Profile"
            style={{
              borderBottom: tabIndex === 0 ? '2px solid blue' : '2px solid transparent',
            }}
          />
          <Tab
            label="Listed Items"
            style={{
              borderBottom: tabIndex === 1 ? '2px solid blue' : '2px solid transparent',
            }}
          />
          <Tab
            label="Chats"
            style={{
              borderBottom: tabIndex === 2 ? '2px solid blue' : '2px solid transparent',
            }}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <UserProfile />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <ListedItems />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <ChatList />
      </TabPanel>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};
