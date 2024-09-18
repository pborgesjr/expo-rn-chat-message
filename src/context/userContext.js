import { createContext, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", { autoConnect: false });

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState(null);

  return (
    <UserContext.Provider value={{ userID, setUserID, socket }}>
      {children}
    </UserContext.Provider>
  );
};
