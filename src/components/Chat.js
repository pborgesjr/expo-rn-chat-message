import React from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";

import { person } from "../assets";
import { COLOR_PALETTE, SPACING } from "../theme";

export const Chat = ({
  contact,
  lastSent,
  unreadCount,
  lastMessage,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.chatButton, pressed && styles.pressed]}
      onPress={onPress}
    >
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
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    borderRadius: SPACING.size25,
  },
  chatButton: {
    padding: SPACING.size8,
    borderRadius: SPACING.size8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLOR_PALETTE.neutral.white,
  },
  chat: {
    flex: 1,
    marginLeft: SPACING.size16,
    first: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: SPACING.size4,
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
    backgroundColor: COLOR_PALETTE.neutral.greyc2,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: SPACING.size8,
  },
  pressed: { opacity: 0.6 },
});
