import { Slot } from "expo-router";
import { UserProvider } from "../context";

export default function Layout() {
  return (
    <UserProvider>
      <Slot />
    </UserProvider>
  );
}
