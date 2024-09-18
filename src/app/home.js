import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TextInput } from "react-native";
import { useRouter } from "expo-router";
import {
  collection,
  onSnapshot,
  query,
  addDoc,
  where,
  getDocs,
} from "firebase/firestore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Chat } from "../components";
import { UserContext } from "../context";
import { database } from "../config/firebase";

const Home = () => {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);

  const { userName } = useContext(UserContext);

  const router = useRouter();

  const handleSearch = async () => {
    if (search === userName) {
      return;
    }

    const originQuery = query(
      collection(database, "chats"),
      where("origin", "==", userName),
      where("destination", "==", search)
    );

    const destinationQuery = query(
      collection(database, "chats"),
      where("origin", "==", search),
      where("destination", "==", userName)
    );

    const originQuerySnapshot = await getDocs(originQuery);
    const destinationQuerySnapshot = await getDocs(destinationQuery);

    let originNewDoc;
    let destinationNewDoc;

    if (originQuerySnapshot.empty) {
      originNewDoc = await addDoc(collection(database, "chats"), {
        origin: userName,
        destination: search,
        messages: [],
      });
    }

    if (destinationQuerySnapshot.empty) {
      destinationNewDoc = await addDoc(collection(database, "chats"), {
        origin: search,
        destination: userName,
        messages: [],
      });
    }
    router.push({
      pathname: "conversation",
      params: {
        originConversationID:
          originQuerySnapshot.docs?.[0]?.id || originNewDoc.id,
        destinationConversationID:
          destinationQuerySnapshot.docs?.[0]?.id || destinationNewDoc.id,
      },
    });
  };

  const handleNavigate = async (item) => {
    const destinationQuery = query(
      collection(database, "chats"),
      where("origin", "==", item.contact),
      where("destination", "==", userName)
    );

    const destinationQuerySnapshot = await getDocs(destinationQuery);

    let destinationNewDoc;

    if (destinationQuerySnapshot.empty) {
      destinationNewDoc = await addDoc(collection(database, "chats"), {
        origin: search,
        destination: userName,
        messages: [],
      });
    }

    router.push({
      pathname: "conversation",
      params: {
        originConversationID: item.id,
        destinationConversationID:
          destinationQuerySnapshot.docs?.[0]?.id || destinationNewDoc.id,
      },
    });
  };

  const renderItem = ({ item }) => (
    <Chat {...item} onPress={() => handleNavigate(item)} />
  );

  /**Fetch messages history when the screen is mounted */
  useEffect(() => {
    async function getMessages() {
      const q = query(
        collection(database, "chats"),
        where("origin", "==", userName)
      );

      /**Attach a listener to the collection to fetch changes in real time */
      onSnapshot(q, (snapshot) =>
        setConversations(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              contact: doc.data().destination,
            };
          })
        )
      );
    }

    if (userName) {
      getMessages();
    }
  }, [userName]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages from {userName}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          style={styles.input}
          placeholder="Search for a userName to start a conversation"
        />
        <MaterialCommunityIcons.Button
          name="plus"
          backgroundColor="transparent"
          style={{
            borderRadius: 8,
            backgroundColor: "white",
            marginLeft: 8,
          }}
          iconStyle={{
            color: "black",
            marginLeft: 8,
          }}
          onPress={handleSearch}
          disabled={search === ""}
        />
      </View>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  scrollview: {
    paddingTop: 24,
  },
});

export default Home;
