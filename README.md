# Chat Application

This project is a real-time chat application built with React Native and Expo. It allows users to send and receive messages in real-time, along with the ability to upload and share images. The app uses `Socket.IO` for real-time communication.

## Features

- **Real-time Messaging**: Users can send and receive messages in real-time using Socket.IO.
- **Image Sharing**: Users can upload and share images from their gallery or camera roll.
- **Search and Filter**: Search for conversations based on user names.

## Screens

### 1. Fake Login Screen
Stores the userID chosen by the user in the UserContext and connects to the socket.

### 2. Home Screen
Displays a list of active conversations and allows the user to:
- Search for contacts
- Start a new conversation

### 3. Conversation Screen
The chat interface where users can:
- Exchange real-time messages
- Upload and share images
- View the past conversation history

## Usage
- Starting a conversation: Select a contact from the home screen or start a conversation with any user.
- Uploading images: Click on the camera or gallery icon to take a photo or select one from your device.
- Real-time updates: Messages sent by other users will appear automatically in the conversation.
- Message history: All messages sent will be stored and can be retrieved at any time.

## Project Structure

```bash
├── components          # Reusable components (e.g., Chat component)
├── context             # User context to manage user session
├── services            # API service functions (fetching messages, uploading images, etc.)
├── theme               # Styling constants (e.g., colors, spacing)
├── utils               # Utility functions (e.g., image selection)
├── app                 # Screens (e.g., Fake Login, Home and Conversation)
└── constants           # Constant values used across the project
```

## Demo

https://drive.google.com/file/d/1MUip5CrBHZ7KmnZh4zePXab_v2CnwF7q/view?usp=sharing
