import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { loginKey } from "../config/configGlobal.json";
export const LayoutStudent = () => {
  return (
    <TouchableOpacity
      onPress={async () => {
        await SecureStore.deleteItemAsync(loginKey);
        navigate.navigate("login");
      }}
    >
      <Text>Remove</Text>
    </TouchableOpacity>
  );
};
