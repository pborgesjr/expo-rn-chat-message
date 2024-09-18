import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";

import { person } from "../assets";

export const Chat = ({
  contact,
  lastSent,
  unreadCount,
  lastMessage,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.chatButton} onPress={onPress}>
      <Image source={person} style={styles.image} />

      <View style={styles.chat}>
        <View style={styles.chat.first}>
          <Text style={styles.text.contact}>{contact}</Text>

          <View style={styles.chat.second}>
            <Text>{lastSent}</Text>
            {unreadCount > 0 && (
              <View style={styles.circle}>
                <Text>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        <Text numberOfLines={2}>{lastMessage}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatButton: {
    padding: 8,
    margin: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
  },
  chat: {
    flex: 1,
    marginLeft: 12,
    first: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 4,
    },
    second: {
      flexDirection: "row",
      alignItems: "center",
    },
  },
  text: {
    contact: {
      fontSize: 18,
      fontWeight: "bold",
    },
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#c2c2c2",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
});
