import React, { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { UserContext } from "../context/userContext";
import { COLOR_PALETTE } from "../theme";

const LoginScreen = () => {
  const [user, setUser] = useState("user1");
  const router = useRouter();
  const { setUserID, socket } = useContext(UserContext);

  const handleLogin = () => {
    setUserID(user);
    socket.connect();
    router.navigate("home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fake Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={user}
        onChangeText={setUser}
      />
      <Pressable
        style={[styles.button, user === "" && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={user === ""}
      >
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR_PALETTE.neutral.black,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: COLOR_PALETTE.neutral.white,
  },
  input: {
    width: "100%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.neutral.greyc2,
    borderRadius: 8,
    backgroundColor: COLOR_PALETTE.neutral.white,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLOR_PALETTE.green,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: COLOR_PALETTE.neutral.greyc2,
  },
  buttonText: {
    color: COLOR_PALETTE.neutral.white,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
