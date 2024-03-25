import React from "react"; 
import Navigation from "./src/router/Navigation";
import './global.css';
import { DataContextProvider } from "./src/context/Provider"; 
export default function App() {  
  return (
    <DataContextProvider>
      <Navigation/>
    </DataContextProvider>
  );
}
