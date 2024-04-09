import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext, useEffect, useState } from "react";
import { LayoutLoguin } from "../layouts/LayoutLoguin";
import { LayoutAdmin } from "../layouts/LayoutAdmin";
import { LayoutStudent } from "../layouts/LayoutStudent";
import { LayoutMain } from "../layouts/LayoutMain";
import { Text, TouchableOpacity } from "react-native";
import * as SecureStore from "expo-secure-store";
import { loginKey } from "../config/configGlobal.json";
import { DataContext } from "../context/Provider";
import { validateSession } from "../https/PostFetchs";
import { CreateEvent } from "../components/CreateEvent";
import { LayoutPodcast } from "../layouts/LayoutPodcast";
import { EventDetails } from "../components/ModalEventDetails";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { auth, setDataAuth } = useContext(DataContext);
  const getAuthLocalStorgeValidSession = async () => {
    const token = await SecureStore.getItemAsync(loginKey);
    if (token) {
      const result = await validateSession(token);
      if (result) { 
        setDataAuth(result.data);
      };
    }
  };
  useEffect(() => {
    getAuthLocalStorgeValidSession()
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!auth ? "login" : null}>
        <Stack.Screen
          name="login"
          component={LayoutLoguin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="admin"
          component={LayoutAdmin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="student"
          component={LayoutStudent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="main"
          component={LayoutMain}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="event"
          component={CreateEvent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="podcast"
          component={LayoutPodcast}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="eventdetail"
          component={EventDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
