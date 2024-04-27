import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';

import {
  Box,
  List,
  Avatar,
  ListItem,
  Typography,
  ListItemText,
  ListItemAvatar,
  CircularProgress,
} from '@mui/material';

import { ALL_CHAT_BY_USER } from '../../graphQl/allChatByUser.gql';
import { GET_ALL_MESSAGES_BY_USER } from '../../graphQl/messages.gql';

const ChatList = ({ user }) => {
  console.log(user.id, 'user id passing to chat...');
  const [selectedChat, setSelectedChat] = useState(null);

  const { loading, error, data } = useQuery(ALL_CHAT_BY_USER, {
    variables: { userId: user.id },
  });

  console.log(data?.allChatByUser, 'chats');

  const chats =
    data?.allChatByUser
      .filter((chatData) => chatData.targetUser[0].id) 
      .map((chatData) => ({
        id: chatData.offerId,
        cash: chatData.cash,
        name: `${chatData.targetUser[0].firstName} ${chatData.targetUser[0].lastName}`,
        sourceItemTitle:
          chatData.sourceItem && chatData.sourceItem[0]?.title ? chatData.sourceItem[0].title : '',
        targetItemTitle: `${chatData.targetItem[0].title}`,
        userAvatar: chatData.targetUser[0]?.avatarUrl,
        avatarUrl: chatData.targetItem[0].mainImageUrl,
      })) || [];

  const {
    data: messagesData,
    loading: messagesLoading,
    error: messagesError,
  } = useQuery(GET_ALL_MESSAGES_BY_USER, {
    variables: { offerId: selectedChat ? selectedChat.id : null }, // Pass selected chat's offerId
  });
  console.log(messagesData, 'Messages Data');
  console.log(messagesError, ',message error');
  console.log(messagesLoading, 'message loading');

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  const sortedMessages = messagesData && messagesData.messages ? [...messagesData.messages] : [];

  // Sort messages by createdAt timestamp in ascending order
  sortedMessages.sort((a, b) => {
    if (a.createdAt < b.createdAt) return -1;
    if (a.createdAt > b.createdAt) return 1;
    return 0;
  });

  console.log(sortedMessages, 'sorted messages');

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Typography variant="body1">{error?.message || messagesError?.message}</Typography>;

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '10px', padding: '20px' }}>
        <Typography
          sx={{ borderBottom: '1px solid #ccc', paddingBottom: '10px' }}
          variant="h6"
          gutterBottom
        >
          Chats
        </Typography>
        {chats.length === 0 ? (
          <Typography variant="body1">No chats available.</Typography>
        ) : (
          <List>
            {chats.map((chat) => (
              <ListItem
                key={chat.id}
                alignItems="flex-start"
                button
                onClick={() => handleChatSelect(chat)}
                sx={{
                  marginTop: '10px',
                  alignItems: 'center',
                  backgroundColor:
                    selectedChat && selectedChat.id === chat.id ? '#f0f0f0' : 'inherit',
                }}
              >
                <ListItemAvatar sx={{ marginTop: '0px' }}>
                  <Avatar alt={chat.name} src={chat.avatarUrl} />
                </ListItemAvatar>

                <ListItemText
                  sx={{ fontWeight: 700 }}
                  primary={`${chat.cash ? `$${chat.cash}` : ''} ${chat.targetItemTitle} ${
                    chat.sourceItemTitle ? `- ${chat.sourceItemTitle}` : ''
                  }`}
                  secondary={chat.name}
                />
              </ListItem>
            ))}
          </List>
        )}
      </div>
      <div
        style={{
          backgroundColor: 'rgb(237, 237, 237)',
          flex: 3,
          padding: '20px',
          marginLeft: '10px',
          borderRadius: '10px',
        }}
      >
        {selectedChat && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: '10px',
                marginBottom: '30px',
                borderBottom: '1px solid #ccc',
              }}
            >
              <Avatar
                sx={{ width: '50px', height: '50px' }}
                alt={selectedChat.name}
                src={selectedChat.avatarUrl}
              />
              <Typography variant="h5" gutterBottom style={{ marginLeft: '10px' }}>
                {selectedChat.name}
              </Typography>
            </div>
            <div style={{ maxHeight: '900px', overflowY: 'auto' }}>
              {sortedMessages.map((message) => (
                <div
                  key={message.createdAt}
                  style={{
                    display: 'flex',
                    justifyContent: message.createdByUserId !== user.id ? 'flex-end' : 'flex-start',
                    marginBottom: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  {message.createdByUserId !== user.id ? (
                    <Avatar
                      alt={message.sender}
                      src={message.targetUser[0].avatarUrl}
                      sx={{ width: '40px', height: '40px', marginRight: '10px', marginTop: '5px' }}
                    />
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}

                  <div
                    style={{
                      letterSpacing: '1.5px',
                      color: 'white',
                      backgroundColor:
                        message.createdByUserId === user.id ? '#4caf50' : 'rgb(29 159 223)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      maxWidth: '70%',
                    }}
                  >
                    <Typography
                      sx={{ letterSpacing: '1px', marginBottom: '0px', fontSize: '12px' }}
                      variant="subtitle"
                      gutterBottom
                    >
                      {message.messageText}
                    </Typography>
                    {/* <Typography
                      sx={{ letterSpacing: '1px', marginBottom: '0px', fontSize: '10px' }}
                      variant="subtitle"
                      gutterBottom
                    >
                      {message.createdAt} 
                    </Typography> */}
                  </div>
                  {message.createdByUserId === user.id ? (
                    <Avatar
                      alt={message.sender}
                      src={message.targetUser[0].avatarUrl}
                      sx={{ width: '40px', height: '40px', marginLeft: '10px', marginTop: '5px' }}
                    />
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;

ChatList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};
