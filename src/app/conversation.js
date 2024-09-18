import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { GiftedChat } from "react-native-gifted-chat";
import { onSnapshot, updateDoc, arrayUnion, doc } from "firebase/firestore";

import { UserContext } from "../context";
import { database } from "../config/firebase";

const Conversation = () => {
  const [messages, setMessages] = useState([]);

  const { userName } = useContext(UserContext);

  const router = useRouter();
  const { originConversationID, destinationConversationID } =
    useLocalSearchParams();

  const originDocRef = doc(database, "chats", originConversationID);
  const destinationDocRef = doc(database, "chats", destinationConversationID);

  const handleGoBack = () => {
    Keyboard.dismiss();

    setTimeout(() => {
      router.back();
    }, 200);
  };

  const sendMessage = async (messages = []) => {
    setMessages((previousMessages) => {
      GiftedChat.append(previousMessages, messages);
    });
    const { _id, createdAt, text, user } = messages[0];

    await updateDoc(originDocRef, {
      messages: arrayUnion({
        _id,
        createdAt,
        text,
        user,
      }),
    });

    await updateDoc(destinationDocRef, {
      messages: arrayUnion({
        _id,
        createdAt,
        text,
        user,
      }),
    });
  };

  /**Fetch messages history when the screen is mounted */
  useEffect(() => {
    async function getMessages() {
      onSnapshot(originDocRef, (snapshot) =>
        setMessages(
          snapshot
            .data()
            .messages.map((message) => ({
              _id: message._id,
              createdAt: message.createdAt.toDate(),
              text: message.text,
              user: message.user,
            }))
            .reverse()
        )
      );
    }
    getMessages();
  }, [userName, originConversationID]);

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
        <Text style={styles.contact}>{originConversationID}</Text>
      </View>

      <GiftedChat
        messages={messages}
        onSend={sendMessage}
        user={{
          _id: userName,
        }}
        keyboardShouldPersistTaps="never"
      />
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
});

export default Conversation;
