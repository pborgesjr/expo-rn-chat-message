import React, { useContext, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { UserContext } from "../context/userContext";

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
    backgroundColor: "black",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "100%",
    height: 50,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: "#c2c2c2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default LoginScreen;
