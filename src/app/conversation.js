import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GiftedChat } from "react-native-gifted-chat";

import { UserContext } from "../context";
import { STATUS } from "../constants";
import { COLOR_PALETTE, SPACING } from "../theme";
import { fetchMessages, uploadImageService } from "../services";
import { handleSelectImageFromGallery, handleSelectImageFromCameraRoll } from "../utils";


const Conversation = () => {
  const [messages, setMessages] = useState([]);
  //TODO: give feedback to the user using status state
  const [status, setStatus] = useState(STATUS.INITIAL);

  const { userID, socket } = useContext(UserContext);

  

  const router = useRouter();
  const { destinationID, roomID } = useLocalSearchParams();

  const handleGoBack = () => {
    /** Workaround to manually hide the keyboard on some certain devices of Android when using GiftedChat */
    Keyboard.dismiss();

    setTimeout(() => {
      router.back();
    }, 200);
  };

  /** Function to emit event and send the message through the socket */
  const sendMessage = async (currentMessages = [], avoidInsertion) => {
    const { _id, createdAt, text, user, image } = currentMessages[0];

    socket.emit("message", {
      message: { _id, createdAt, text, user, image },
      documentID: roomID,
      avoidInsertion,
    });
  };

  const selectImageFromAlbum = async () => {
    const imageFromGallery = await handleSelectImageFromGallery();

    if (imageFromGallery) {
      await uploadImage(imageFromGallery);
    }
  };

  const captureImageAndSend = async () => {
    const imageFromCameraRoll = await handleSelectImageFromCameraRoll();
    
 
    if (imageFromCameraRoll) {
      await uploadImage(imageFromCameraRoll);
    }
  };

  const uploadImage = async (uri, retries = 3) => {
    let formData = new FormData();
  
    formData.append("image", {
      uri: uri,
      name: "image.jpg",
      type: "image/jpeg",
    });
  
    formData.append("documentID", roomID);
    formData.append("userID", userID);
  
    setStatus(STATUS.SENDING);
  
    try {
      const data = await uploadImageService(formData);
  
      if (data.success) {
        await sendMessage([data.message], true);
      }
    } catch (error) {
      console.log("Error uploading image:", error);
  
      if (retries > 0) {
        console.log(`Retrying... attempts left: ${retries - 1}`);
        await uploadImage(uri, retries - 1); // Recursively retry with one less attempt
      } else {
        console.log("Max retries reached.");
        return;
      }
    } finally {
      setStatus(STATUS.IDLE);
    }
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

    /** Cleanup function to emit leave-room  */
    return () => {
      socket.emit("leave-room", roomID);
    };
  }, []);

  /** Listener to update incoming messages */
  useEffect(() => {
    socket.on("send-message", (message = []) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, [message])
      );
    });

        /** Cleanup function to unbind event listener for "send-message" and "join-conversation" on screen unmount  */
        return () => {
          socket.off("send-message");
          socket.off("join-conversation");
        };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.rowCenterAligned, styles.header]}>
        <View style={styles.rowCenterAligned}>
          <Ionicons.Button
            name="chevron-back-outline"
            onPress={handleGoBack}
            backgroundColor="transparent"
            size={SPACING.size36}
            color={COLOR_PALETTE.neutral.white}
            style={styles.marginRightIcon}
          />
          <Text style={styles.contact}>{destinationID}</Text>
        </View>
        <View style={styles.rowCenterAligned}>
          <Ionicons.Button
            name="camera-outline"
            onPress={captureImageAndSend}
            backgroundColor="transparent"
            size={SPACING.size36}
            color={COLOR_PALETTE.neutral.white}
            style={styles.marginRightIcon}
          />
          <Ionicons.Button
            name="image-outline"
            onPress={selectImageFromAlbum}
            backgroundColor="transparent"
            size={SPACING.size36}
            color={COLOR_PALETTE.neutral.white}
          />
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={sendMessage}
        user={{
          _id: userID,
        }}
        keyboardShouldPersistTaps="never"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.neutral.black,
    padding: SPACING.size8,
  },
  rowCenterAligned: {
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
    justifyContent: "space-between",
  },
  contact: {
    color: COLOR_PALETTE.neutral.white,
    fontSize: 18,
  },
  marginRightIcon: {
    marginRight: SPACING.size24,
  },
});

export default Conversation;
