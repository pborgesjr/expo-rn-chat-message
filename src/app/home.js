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
import { UserContext } from "../context";
import { COLOR_PALETTE, GENERAL_STYLES, SPACING } from "../theme";
import { fetchAllConversations } from "../services";

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

      const result = await fetchAllConversations(userID);

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
                size={SPACING.size32}
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
              style={GENERAL_STYLES.loadingIndicator}
            />
          )
        }
        ItemSeparatorComponent={<View style={styles.separator} />}
        ListEmptyComponent={
          status !== STATUS.LOADING && (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {input === ""
                  ? "You have no messages yet. Start a new conversation by searching for a user."
                  : "No result found! Try searching for another user or click on the button to start a new conversation with this user."}
              </Text>
              {input !== "" && (
                <Pressable
                  style={styles.emptyButton}
                  onPress={() => handleJoinConversation(input)}
                >
                  <Text style={styles.emptyButtonText}>Open</Text>
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
  empty: {
    alignItems: "center",
    marginTop: SPACING.size32,
  },
  emptyText: {
    color: COLOR_PALETTE.neutral.white,
    fontSize: 24,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: SPACING.size24,
    backgroundColor: COLOR_PALETTE.green,
    paddingVertical: SPACING.size8,
    borderRadius: SPACING.size4,
    width: "80%",
    alignItems: "center",
  },
  emptyButtonText: { color: COLOR_PALETTE.neutral.white },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.size24,
  },
  title: {
    color: COLOR_PALETTE.neutral.white,
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
  },
  input: {
    flex: 1,
    padding: SPACING.size8,
    borderRadius: SPACING.size8,
    backgroundColor: COLOR_PALETTE.neutral.white,
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: SPACING.size8,
    marginBottom: SPACING.size16,
  },
  spacingHorizontal: {
    paddingHorizontal: SPACING.size16,
  },
  separator: {
    marginBottom: SPACING.size16,
  },
  list: {
    paddingBottom: SPACING.size40,
  },
  refresh: { marginLeft: SPACING.size24 },
});

export default Home;
