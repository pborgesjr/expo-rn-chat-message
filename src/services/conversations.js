/** Fetch all conversations for the specific userID */
export const fetchAllConversations = async (userID) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API}/conversations?origin=${userID}`
  );

  const result = await response.json();

  return result;
};

/** Fetch messages from a specific destinationID */
export const fetchMessages = async (destinationID) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API}/conversation?roomID=${destinationID}`
  );

  const result = await response.json();

  return result;
};
