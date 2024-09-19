import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GiftedChat } from "react-native-gifted-chat";

import { UserContext } from "../context";
import { STATUS } from "../constants";
import { COLOR_PALETTE, GENERAL_STYLES, SPACING } from "../theme";
import { fetchMessages } from "../services";

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

        const result = await fetchMessages(roomID);

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
        <Ionicons.Button
          name="chevron-back-outline"
          onPress={handleGoBack}
          backgroundColor="transparent"
          size={SPACING.size36}
          color={COLOR_PALETTE.neutral.white}
          style={styles.goBackButton}
        />
        <Text style={styles.contact}>{destinationID}</Text>
      </View>
      {status === STATUS.LOADING ? (
        <ActivityIndicator
          size="large"
          color={COLOR_PALETTE.neutral.white}
          style={GENERAL_STYLES.loadingIndicator}
        />
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
    backgroundColor: COLOR_PALETTE.neutral.black,
    padding: SPACING.size8,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 45,
    paddingHorizontal: SPACING.size8,
    marginLeft: SPACING.size8,
    borderRadius: SPACING.size4,
    backgroundColor: COLOR_PALETTE.neutral.white,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  contact: {
    color: COLOR_PALETTE.neutral.white,
    fontSize: 18,
  },
  goBackButton: {
    marginRight: SPACING.size24,
  },
});

export default Conversation;
