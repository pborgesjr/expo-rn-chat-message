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

## Opinion
It was an interesting and funny technical assignment to do. It evolves many technologies and skills. If I had more time, I would implement way more functionalities to make it similar to chat applications that we all know, like WhatsApp, Instagram, iMessage and others.
Regarding to coding, I would create unit tests to help assure that the logic is working properly and as it should. Implement internationalization regard to texts and theme selection. The library(https://github.com/FaridSafi/react-native-gifted-chat) that I used for the chat window has some downsides, the input component sometimes causes some flickering to the application, the keyboard does not hide automatically when unmounting the screen(this made me implement a hotfix to make it work, the library probably needs a patch), but it is not all that bad. The library provides good functionalities out of the box regarding to chat bubbles, timestamps, ticks, message list and many others.
