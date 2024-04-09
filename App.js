import React from "react"; 
import Navigation from "./src/router/Navigation"; 
import { DataContextProvider } from "./src/context/Provider"; 
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
export default function App() {  
  return (
    <DataContextProvider>
      <StatusBar style="inverted" ></StatusBar>
      <Navigation/> 
      <Toast
        visibilityTime={1800}
      ></Toast>
    </DataContextProvider>
  );
}
