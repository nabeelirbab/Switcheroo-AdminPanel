import React, { useState } from 'react';

import { List, Avatar, ListItem, Typography, ListItemText, ListItemAvatar } from '@mui/material';

const ChatList = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const chats = [
    { id: 1, name: 'John Doe', avatarUrl: 'url_to_avatar_1' },
    { id: 2, name: 'Anderson', avatarUrl: 'url_to_avatar_2' },
    { id: 3, name: 'Jack White', avatarUrl: 'url_to_avatar_1' },
    { id: 4, name: 'Micheal', avatarUrl: 'url_to_avatar_2' },
    { id: 5, name: 'Jhon Anderson', avatarUrl: 'url_to_avatar_1' },
    { id: 6, name: 'Andrew Mead', avatarUrl: 'url_to_avatar_2' },
    { id: 7, name: 'Justin Carter', avatarUrl: 'url_to_avatar_1' },
    { id: 8, name: 'Cenation', avatarUrl: 'url_to_avatar_2' },
    { id: 9, name: 'Alexandar', avatarUrl: 'url_to_avatar_1' },
    { id: 10, name: 'Kuliee Ad', avatarUrl: 'url_to_avatar_2' },
    { id: 11, name: 'Steven Smith', avatarUrl: 'url_to_avatar_1' },
    { id: 12, name: 'Cristina', avatarUrl: 'url_to_avatar_2' },
    { id: 13, name: 'Angelina', avatarUrl: 'url_to_avatar_1' },
    { id: 14, name: 'White James', avatarUrl: 'url_to_avatar_2' },
    { id: 15, name: 'Chat 1', avatarUrl: 'url_to_avatar_1' },
    { id: 16, name: 'Chat 2', avatarUrl: 'url_to_avatar_2' },

    // Add more chats as needed
  ];

  const messages = [
    { id: 1, sender: 'User 1', content: 'Hello!', color: 'rgb(29 159 223)' },
    { id: 2, sender: 'User 2', content: 'Hi there!', color: '#4caf50' },
    { id: 3, sender: 'User 1', content: 'How are you?', color: 'rgb(29 159 223)' },
    { id: 4, sender: 'User 2', content: 'I am doing well, thank you!', color: '#4caf50' },
    { id: 5, sender: 'User 1', content: 'What are you up to?', color: 'rgb(29 159 223)' },
    { id: 6, sender: 'User 2', content: 'Just chilling. How about you?', color: '#4caf50' },
    { id: 7, sender: 'User 1', content: 'Thinking about dinner plans.', color: 'rgb(29 159 223)' },
    { id: 8, sender: 'User 2', content: 'Sounds good. Any preferences?', color: '#4caf50' },
    { id: 9, sender: 'User 1', content: 'Im craving Italian food.', color: 'rgb(29 159 223)' },
    {
      id: 10,
      sender: 'User 2',
      content: 'Great, lets go to that new place downtown.',
      color: '#4caf50',
    },
  ];

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

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
        <List>
          {chats.map((chat) => (
            <ListItem
            key={chat.id}
            alignItems="flex-start"
            button
            onClick={() => handleChatSelect(chat)}
            sx={{ marginTop: '10px', alignItems: 'center', backgroundColor: selectedChat && selectedChat.id === chat.id ? '#f0f0f0' : 'inherit' }}
          >
              <ListItemAvatar sx={{ marginTop: '0px' }}>
                <Avatar alt={chat.name} src={chat.avatarUrl} />
              </ListItemAvatar>
              <ListItemText sx={{ fontWeight: 700 }} primary={chat.name} />
            </ListItem>
          ))}
        </List>
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  style={{
                    display: 'flex',
                    justifyContent: message.sender === 'User 1' ? 'flex-start' : 'flex-end', // Adjust avatar position
                    marginBottom: '10px',
                  }}
                >
                  {message.sender === 'User 1' ? ( // Render Avatar on the left for User 1
                    <Avatar
                      alt={message.sender}
                      src={selectedChat.avatarUrl}
                      sx={{ width: '40px', height: '40px', marginRight: '10px' }}
                    />
                  ) : (
                    <div style={{ flex: 1 }} />
                  )}
                  <div
                    style={{
                      letterSpacing: '1.5px',
                      color: 'white',
                      backgroundColor: message.color,
                      height: '30px',
                      padding: '2px 12px',
                      borderRadius: '8px',
                      maxWidth: '70%',
                    }}
                  >
                    <Typography
                      sx={{ letterSpacing: '1px', marginBottom: '0px', fontSize: '12px' }}
                      variant="subtitle"
                      gutterBottom
                    >
                      {message.sender}: {message.content}
                    </Typography>
                  </div>
                  {message.sender !== 'User 1' ? ( 
                    <Avatar
                      alt={message.sender}
                      src={selectedChat.avatarUrl} 
                      sx={{ width: '40px', height: '40px', marginLeft: '10px' }}
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
