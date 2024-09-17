import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput } from "react-native";

import { Chat } from "../components";

//TODO: remove mock
const chatInstances = [
  {
    contact: "+55 (11) 93044-5599",
    lastSent: "09:30",
    unreadCount: 5,
    lastMessage:
      "Exercitation enim esse Lorem veniam elit. Magna et nisi quis ad deserunt consequat ea eiusmod consequat commodo aliquip voluptate sit.",
  },
  {
    contact: "+55 (11) 98123-4567",
    lastSent: "11:00",
    unreadCount: 2,
    lastMessage:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque commodo magna.",
  },
  {
    contact: "+55 (21) 91234-5678",
    lastSent: "14:15",
    unreadCount: 3,
    lastMessage:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    contact: "+55 (31) 98765-4321",
    lastSent: "08:45",
    unreadCount: 1,
    lastMessage:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    contact: "+55 (41) 97654-3210",
    lastSent: "12:30",
    unreadCount: 0,
    lastMessage:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    contact: "+55 (51) 95678-1234",
    lastSent: "15:40",
    unreadCount: 4,
    lastMessage:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    contact: "+55 (61) 96543-2109",
    lastSent: "10:20",
    unreadCount: 8,
    lastMessage:
      "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
  {
    contact: "+55 (71) 93456-7890",
    lastSent: "13:55",
    unreadCount: 6,
    lastMessage:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  },
  {
    contact: "+55 (81) 94567-8901",
    lastSent: "16:10",
    unreadCount: 9,
    lastMessage:
      "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  },
  {
    contact: "+55 (91) 91234-5678",
    lastSent: "07:05",
    unreadCount: 12,
    lastMessage:
      "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?",
  },
  {
    contact: "+55 (11) 92345-6789",
    lastSent: "18:45",
    unreadCount: 7,
    lastMessage:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  },
  {
    contact: "+55 (21) 93456-7890",
    lastSent: "19:00",
    unreadCount: 0,
    lastMessage:
      "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.",
  },
  {
    contact: "+55 (31) 94567-8901",
    lastSent: "20:30",
    unreadCount: 3,
    lastMessage:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
  },
  {
    contact: "+55 (41) 95678-9012",
    lastSent: "21:15",
    unreadCount: 5,
    lastMessage: "Et harum quidem rerum facilis est et expedita distinctio.",
  },
  {
    contact: "+55 (51) 96789-0123",
    lastSent: "22:10",
    unreadCount: 4,
    lastMessage:
      "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus.",
  },
  {
    contact: "+55 (61) 97890-1234",
    lastSent: "06:00",
    unreadCount: 0,
    lastMessage: "Omnis voluptas assumenda est, omnis dolor repellendus.",
  },
  {
    contact: "+55 (71) 98901-2345",
    lastSent: "17:45",
    unreadCount: 6,
    lastMessage:
      "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
  },
  {
    contact: "+55 (81) 99912-3456",
    lastSent: "23:50",
    unreadCount: 11,
    lastMessage:
      "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur.",
  },
  {
    contact: "+55 (91) 91023-4567",
    lastSent: "05:30",
    unreadCount: 2,
    lastMessage: "Perferendis doloribus asperiores repellat.",
  },
  {
    contact: "+55 (11) 92134-5678",
    lastSent: "16:30",
    unreadCount: 0,
    lastMessage: "Vero eos et accusamus et iusto odio dignissimos ducimus.",
  },
];

const Home = () => {
  const [search, setSearch] = useState("");

  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>expo-rn-chat-message</Text>
      <TextInput
        value={search}
        onChangeText={setSearch}
        style={styles.input}
        placeholder="Search for a contact or number..."
      />
      {/**TODO: replace with FlatList */}
      <ScrollView style={styles.scrollview}>
        {chatInstances.map((chat) => (
          <Chat key={chat.contact} {...chat} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  input: {
    padding: 8,
    margin: 8,
    borderRadius: 8,
    backgroundColor: "white",
  },
  scrollview: {
    paddingTop: 24,
  },
});

export default Home;
