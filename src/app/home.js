import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import debounce from "lodash/debounce";

import { Chat } from "../components";
import { STATUS } from "../constants";
import { UserContext } from "../context/userContext";
import { COLOR_PALETTE } from "../theme";

const Home = () => {
  const [input, setInput] = useState("");
  const [allConversations, setAllConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [status, setStatus] = useState(STATUS.INITIAL);

  const router = useRouter();
  const { userID, socket, setUserID } = useContext(UserContext);

  const logout = () => {
    setUserID(null);
    socket.disconnect();
    router.back();
  };

  const handleJoinConversation = (destinationID) => {
    socket.emit("join-conversation", userID, destinationID);

    socket.on("join-conversation", (roomID) => {
      router.navigate({
        pathname: "conversation",
        params: { destinationID, roomID },
      });
    });
  };

  const debouncedFilterConversations = useCallback(
    debounce((text) => {
      if (text === "") {
        setFilteredConversations(allConversations);
      } else {
        const filtered = allConversations.filter(
          (item) =>
            item.origin.includes(text) || item.destination.includes(text)
        );
        setFilteredConversations(filtered);
      }
    }, 2000),
    [allConversations]
  );

  const onChangeInput = (text) => {
    setInput(text);
    debouncedFilterConversations(text);
  };

  const renderItem = ({ item }) => {
    const destination =
      userID === item.destination ? item.origin : item.destination;

    return (
      <Chat
        contact={destination}
        onPress={() => handleJoinConversation(destination)}
      />
    );
  };

  const onRefresh = async () => {
    setStatus(STATUS.REFRESHING);
    await fetchFn();
    setStatus(STATUS.IDLE);
  };

  const fetchFn = useCallback(async () => {
    try {
      setStatus(STATUS.LOADING);
      const response = await fetch(
        `http://192.168.15.22:3000/conversations?origin=${userID}`
      );

      const result = await response.json();

      setAllConversations(result);
      setFilteredConversations(result);
      setStatus(STATUS.IDLE);
    } catch (e) {
      setStatus(STATUS.ERROR);
      console.error(e);
    }
  }, []);

  /**Initial fetch */
  useEffect(() => {
    fetchFn();
  }, [fetchFn]);

  return (
    <View style={styles.container}>
      <View style={[styles.header, styles.spacingHorizontal]}>
        <Text style={styles.title}>Messages from {userID}</Text>
        <Ionicons.Button
          name="log-out-outline"
          size={32}
          color={COLOR_PALETTE.neutral.white}
          backgroundColor="transparent"
          onPress={logout}
        />
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={status === STATUS.REFRESHING}
            onRefresh={onRefresh}
            enabled
          />
        }
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <TextInput
              value={input}
              onChangeText={onChangeInput}
              style={styles.input}
              placeholder="Search for a user"
            />
            {Platform.OS === "web" && (
              <Ionicons.Button
                name="refresh-outline"
                backgroundColor="transparent"
                size={32}
                color={COLOR_PALETTE.neutral.white}
                onPress={onRefresh}
                style={styles.refresh}
                disabled={
                  status === STATUS.REFRESHING || status === STATUS.LOADING
                }
              />
            )}
          </View>
        }
        keyExtractor={(item) => item?._id}
        contentContainerStyle={[styles.list, styles.spacingHorizontal]}
        ListFooterComponent={
          status === STATUS.LOADING && (
            <ActivityIndicator
              size="large"
              color={COLOR_PALETTE.neutral.white}
              style={styles.loading}
            />
          )
        }
        ItemSeparatorComponent={<View style={styles.separator} />}
        ListEmptyComponent={
          status !== STATUS.LOADING && (
            <View
              style={{
                alignItems: "center",
                marginTop: 32,
              }}
            >
              <Text
                style={{
                  color: COLOR_PALETTE.neutral.white,
                  fontSize: 24,
                  textAlign: "center",
                }}
              >
                {input === ""
                  ? "You have no messages yet. Start a new conversation by searching for a user."
                  : "No result found! Try searching for another user or click on the button to start a new conversation with this user."}
              </Text>
              {input !== "" && (
                <Pressable
                  style={{
                    marginTop: 24,
                    backgroundColor: "#4CAF50",
                    paddingVertical: 8,
                    borderRadius: 4,
                    width: "80%",
                    alignItems: "center",
                  }}
                  onPress={() => handleJoinConversation(input)}
                >
                  <Text style={{ color: COLOR_PALETTE.neutral.white }}>
                    Open
                  </Text>
                </Pressable>
              )}
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.neutral.black,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 24,
  },
  title: {
    color: COLOR_PALETTE.neutral.white,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLOR_PALETTE.neutral.white,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  spacingHorizontal: {
    paddingHorizontal: 16,
  },
  separator: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 40,
  },
  refresh: { marginLeft: 24 },
  loading: { alignItems: "center", marginTop: 32 },
});

export default Home;
