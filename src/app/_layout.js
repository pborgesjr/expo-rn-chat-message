import { Slot } from "expo-router";
import { UserProvider } from "../context/userContext";

export default function Layout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
