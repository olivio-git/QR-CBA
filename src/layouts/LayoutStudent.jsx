import React, { useContext, useEffect } from "react";
import { SafeAreaView, Text, View, StatusBar, ScrollView, Alert, BackHandler } from "react-native";
import { StyleSheet } from "react-native";
import { colors } from "../config/environments";
import { EventsManager } from "../components/EventsManager";
import { DataContext } from "../context/Provider";
import { Divider } from "react-native-elements";
import * as SecureStore from "expo-secure-store";
import { loginKey } from "../config/configGlobal.json";
import { useNavigation } from "@react-navigation/native";


export const LayoutStudent = () => {
  const { auth } = useContext(DataContext);
  const navigate = useNavigation();
  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Cerrar sesión",
        "¿Estás seguro de que quieres cerrar sesión?",
        [
          {
            text: "Cancelar",
            onPress: () => null, 
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              SecureStore.deleteItemAsync(loginKey);
              navigate.navigate('login');
            },
          },
        ]
      );
      return true; // Indica que la acción ha sido manejada
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-[#111B21]">
      <StatusBar style="light" />
      {auth.user && (
        <View className="flex-1 mt-10 px-4">
          <View className="flex flex-row h-14">
            <View className="flex justify-center items-center w-14 bg-zinc-200 rounded-full">
              <Text className="text-red-600 text-2xl  ">
                {auth.user.fullName[0].toUpperCase() +
                  "" +
                  auth.user.fullName[1].toUpperCase()}
              </Text>
            </View>
            <View className="ml-2 w-[75%] flex items-start justify-center">
              <Text className="text-sm text-white">{auth.user.fullName}</Text>
            </View>
          </View>
          <Divider className="bg-gray-200 mt-2"></Divider>
          <Text className="font-light text-xs text-start text-white mt-1">
            List of upcoming events
          </Text>
          <EventsManager></EventsManager>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBody,
  },
});
