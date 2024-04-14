import React from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';

import { Box, Tab, Tabs, AppBar, Typography } from '@mui/material';

import ChatList from '../chats';
import UserProfile from '../profile';
import ListedItems from '../user-items';

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
  const location = useLocation();
  const userData = location.state ? location.state.user : null;

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
        {userData && <UserProfile user={userData} />}
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
      {userData && <ListedItems user={userData} />}
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
