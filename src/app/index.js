import React, { useState, useContext } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";

import { UserContext } from "../context";

const Login = () => {
  const [input, setInput] = useState("");

  const router = useRouter();

  const { setUserName } = useContext(UserContext);

  const handleLogin = () => {
    setUserName(input);

    router.push("home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fake Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        value={input}
        onChangeText={setInput}
      />
      <Pressable
        style={[styles.button, input === "" && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={input === ""}
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

export default Login;
