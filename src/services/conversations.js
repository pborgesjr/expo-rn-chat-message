export const fetchAllConversations = async (userID) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API}/conversations?origin=${userID}`
  );

  const result = await response.json();

  return result;
};

export const fetchMessages = async (roomID) => {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API}/conversation?roomID=${roomID}`
  );

  const result = await response.json();

  return result;
};
