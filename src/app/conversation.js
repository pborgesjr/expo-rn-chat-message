import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GiftedChat } from "react-native-gifted-chat";

import { UserContext } from "../context/userContext";
import { STATUS } from "../constants";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(STATUS.INITIAL);

  const { userID, socket } = useContext(UserContext);

  const router = useRouter();
  const { destinationID, roomID } = useLocalSearchParams();

  const handleGoBack = () => {
    Keyboard.dismiss();

    setTimeout(() => {
      router.back();
    }, 200);
  };

  const sendMessage = async (currentMessages = []) => {
    const { _id, createdAt, text, user } = currentMessages[0];

    socket.emit("message", {
      message: { _id, createdAt, text, user },
      documentID: roomID,
    });
  };

  /**Initial fetch - fetch all messages */
  useEffect(() => {
    const initialFetch = async () => {
      try {
        setStatus(STATUS.LOADING);
        const response = await fetch(
          `http://192.168.15.22:3000/conversation?roomID=${roomID}`
        );

        const result = await response.json();

        setMessages(result?.messages.reverse() || []);

        setStatus(STATUS.IDLE);
      } catch (e) {
        console.error(e);
        setStatus(STATUS.ERROR);
      }
    };

    initialFetch();

    return () => {
      socket.emit("leave-room", roomID);
      socket.off("message");
    };
  }, []);

  /** Listener to update incoming messages */
  useEffect(() => {
    socket.on("message", (message = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons.Button
          name="chevron-left"
          onPress={handleGoBack}
          backgroundColor="transparent"
          size={36}
          color="white"
          style={styles.goBackButton}
        />
        <Text style={styles.contact}>{destinationID}</Text>
      </View>
      {status === STATUS.LOADING ? (
        <ActivityIndicator size="large" color="white" style={styles.loading} />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={sendMessage}
          user={{
            _id: userID,
          }}
          keyboardShouldPersistTaps="never"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 45,
    paddingHorizontal: 8,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: "white",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  contact: {
    color: "white",
    fontSize: 18,
  },
  goBackButton: {
    marginRight: 24,
  },
  loading: { alignItems: "center", marginTop: 32 },
});

export default Conversation;
