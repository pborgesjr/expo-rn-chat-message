import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Button } from "react-native";

import { collection, addDoc } from "firebase/firestore";

import { database } from "../config/firebase";

import { setItem } from "../utils";

const Login = () => {
  const [user, setUser] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    //TODO: insert error handling
    await setItem("user", user);
    const collectionRef = collection(database, "origin");

    await addDoc(collectionRef, {
      value: user,
    });

    router.push("home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.boxInput}>
        <Text>Nome de Usuário</Text>

        <TextInput style={styles.input} onChangeText={setUser} />
      </View>

      <Button title="Entrar" onPress={handleLogin} disabled={user === ""} />
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;
