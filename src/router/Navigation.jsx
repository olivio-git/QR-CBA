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

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const {auth,setDataAuth} = useContext(DataContext);  
  const getAuthLocalStorge = async () => {
    const response = await SecureStore.getItemAsync(loginKey);
    const transformJson = await JSON.parse(response);
    if(response){
      setDataAuth(transformJson);
    }
  }
  useEffect(() => {
    getAuthLocalStorge();
  }, [auth]);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={!auth?"login":null}>
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
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
