import React, { createContext, useEffect, useState } from "react";
import { getEvents } from "../https/GetFetchs";
import {
  validateSessionCbaPlus,
  validateSessionWebApi,
} from "../https/PostFetchs";
import * as SecureStore from "expo-secure-store";
import { loginKey } from "../config/configGlobal.json";
import { useNavigation } from "@react-navigation/native";

export const DataContext = createContext();

export const DataContextProvider = ({ children }) => { 
  const [auth, setAuth] = useState({
    //contexto de usuario logeado
    user: null,
  });
  const [dataEvents, setDataEvents] = useState({
    //contexto de eventos
    data: null,
    indicator: false,
  });
  const [selectedEventoDetails, setSelectEventDetails] = useState(null); //contexto de estado
  const [dataEventDetail, setDataEventoDetail] = useState(null);
  const [ avatar,setAvatar ] =useState("https://i.ibb.co/9HVb8Dq/pngwing-com.png");

  const setDataAuth = (data) => {
    setAuth({
      ...auth,
      user: data,
    });
  };
  const handleChargeDataEvents = async () => {
    try {
      setDataEvents({
        ...dataEvents,
        indicator: true,
      });
      const response = await getEvents();
      setDataEvents({
        ...dataEvents,
        data: response.data.results.datosEvento,
        indicator: false,
      });
    } catch (error) {
    }
  };
  const handleSetSelectedEvent = (value) => {
    setSelectEventDetails(value);
  };
  const handleSetDataEventDetails = (value) => {
    setDataEventoDetail(value);
  };
  const handleValidateSession = async () => { 
    const token = await SecureStore.getItemAsync(loginKey);
    if (token) { 
      try {
        const sessionData = JSON.parse(token);  

        // Si se pudo parsear como JSON, es un objeto y podemos continuar con él
        if (sessionData.username) {
          try {
            const response = await validateSessionCbaPlus(sessionData.token);
            console.log(response.data);
            setDataAuth(response.data.userData);
            return "student";
          } catch (error) {
          }
          return;
        }
      } catch (error) { 
        const response = await validateSessionWebApi(token);
        setDataAuth(response.data.user);
        return "admin";
        // Si falla el parseo, asumimos que es un token y continuamos
      } 
    }
  };
  const STATES_MODIFIC = {
    auth,
    setDataAuth,
    dataEvents,
    setDataEvents,
    handleChargeDataEvents,
    selectedEventoDetails,
    handleSetSelectedEvent,
    dataEventDetail,
    handleSetDataEventDetails,
    handleValidateSession,
    avatar
  };
  useEffect(() => {
    // handleValidateSession();
  }, []);
  return (
    <DataContext.Provider value={STATES_MODIFIC}>
      {children}
    </DataContext.Provider>
  );
};
