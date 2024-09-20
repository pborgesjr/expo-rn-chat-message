import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GiftedChat } from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";

import { UserContext } from "../context";
import { STATUS } from "../constants";
import { COLOR_PALETTE, SPACING } from "../theme";
import { fetchMessages, uploadImageService } from "../services";

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  //TODO: give feedback to the user using status state
  const [status, setStatus] = useState(STATUS.INITIAL);
  const [retries, setRetries] = useState(3);

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
    const imageFromLibrary = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!imageFromLibrary.canceled) {
      await uploadImage(imageFromLibrary?.assets[0]?.uri);
    }
  };

  const captureImageAndSend = async () => {
    const imageFromCamera = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    });

    if (!imageFromCamera.canceled) {
      await uploadImage(imageFromCamera?.assets[0]?.uri);
    }
  };

  const uploadImage = async (uri) => {
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
      setRetries((prevState) => prevState - 1);
      console.log("Error uploading image:", error);

      if (retries > 0) {
        await uploadImage(uri);
      } else {
        setRetries(3);
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

    /** Cleanup function to emit leave-room event and unbind event listener for "message" on screen unmount  */
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
    </View>
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
