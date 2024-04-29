import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { DataContext } from "../context/Provider";
import { getEventDetail } from "../https/GetFetchs";
import { useNavigation } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { colors } from "../config/environments";
import { ActivityIndicator } from "react-native";
import { Divider } from "react-native-elements";
import { ModalGenerateQR } from "./ModalGenerateQR";
import { generateQrCode } from "../https/PostFetchs";

export const EventDetails = ({ modalDetails, setModalDetails, item }) => {
  const {
    auth,
    selectedEventoDetails,
    handleSetSelectedEvent,
    dataEventDetail,
    handleSetDataEventDetails,
  } = useContext(DataContext);
  const [indicatorState, setIndicatorState] = useState(false); // Indicador de carga
  const [idQr, setIdQR] = useState(null);
  const navigation = useNavigation(); // Navegación
  const [isVisible, setIsVisible] = useState(false); // Estado del modal generador qr
  const handleChargeDataEventDetail = async () => {
    // Cargar detalles del evento
    try {
      setIndicatorState(true);
      const response = await getEventDetail(selectedEventoDetails);
      setIndicatorState(false);
      handleSetDataEventDetails(response.data.results);
    } catch (error) {
    }
  };
  const handleGenerateQR = async () => {
    setIsVisible(true);
    try {
      const response = await generateQrCode({
        id_Evento: dataEventDetail.datosEvento.id_Evento,
        id_Estudiante: auth.user.id.toString(),
        cantidad_uso: 0,
        fecha_Expiracion: dataEventDetail.General.end,
      });
      setIdQR(response.data.data.result.id_QR);
    } catch (error) {
    }
  };
  useEffect(() => {
    handleChargeDataEventDetail();
  }, []);
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true; // Indica que la acción ha sido manejada
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#111B21] justify-center items-center w-full">
      <StatusBar style="light"></StatusBar>
      {!dataEventDetail ? (
        <ActivityIndicator size="large" color={colors.colorGreen} />
      ) : (
        <View className="flex-1  m-5 rounded-xl p-4 shadow-lg w-full">
          <View className="flex-1 py-4 h-50 items-center">
            <View className="flex p-2 flex-row justify-between w-full items-center">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="flex flex-row items-center 
                bg-[#293237] p-3 rounded-l-xl w-16 justify-center"
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="white"
                ></MaterialCommunityIcons>
              </TouchableOpacity>
              <Text
                className="ml-1 bg-[#293237] text-white font-light text-base text-center 
                p-3 rounded-r-xl flex-grow"
              >
                Event Details
              </Text>
            </View>
            <View className="flex  p-2 flex-row justify-between w-full items-center">
              <Image
                resizeMode="cover"
                className="w-[50%] h-56 rounded-lg"
                source={{ uri: dataEventDetail.datosEvento.multimedia[0] }}
              ></Image>
              <View className="flex flex-column w-[50%] h-56 ml-2">
                <Text
                  className="text-white font-bold text-xl text-justify"
                  numberOfLines={3}
                  ellipsizeMode="head"
                >
                  {dataEventDetail.General.title}
                </Text>
                <Text
                  className="text-gray-400 font-bold text-light text-justify"
                  numberOfLines={10}
                  ellipsizeMode="tail"
                >
                  {dataEventDetail.datosEvento.descripcion}
                </Text>
              </View>
            </View>
          </View>
          <Text className="text-zinc-100 ml-2 font-bold text-lg">Details</Text>
          <View className="flex-1 px-2 flex-row h-50">
            {dataEventDetail.General.allDay ? (
              <View
                className="flex flex-column w-[100%] h-32  border border-zinc-500 
                border-[0.5px] items-center
              rounded-lg justify-center"
              >
                <Text className="text-white font-bold text-lg ml-2">
                  <MaterialCommunityIcons
                    className="text-align-center"
                    name="calendar-start"
                    size={20}
                    color="#FFFF"
                  ></MaterialCommunityIcons>{" "}
                  Event date
                </Text>

                <Text className="text-white font-bold text-lg ml-2">
                  {dataEventDetail.General.start}
                  <MaterialCommunityIcons
                    className="text-align-center"
                    name="arrow-right"
                    size={20}
                    color="aqua"
                  ></MaterialCommunityIcons>
                  {dataEventDetail.General.end}
                </Text>
              </View>
            ) : (
              <View className="flex w-full" >
                <View
                  className="flex flex-row w-full h-12
             rounded-lg "
                >
                  <Text className="text-[#FFFF] font-light text-thin">
                    <MaterialCommunityIcons
                      className="text-align-center"
                      name="calendar-start"
                      size={20}
                      color="#FFFF"
                    ></MaterialCommunityIcons>{" "}
                    Start :{" "}
                  </Text>
                  <Text className="text-white text font-light text-thin">
                    {dataEventDetail.General.start} :{" "}
                  </Text>
                  <Text className="text-white font-light text-thin">
                    {dataEventDetail.General.start_Time} :{" "}
                    {dataEventDetail.General.end_Time}
                  </Text>
                </View> 
                <View
                  className="flex flex-row w-full
                  rounded-lg "
                >
                  <Text className="text-[#FFFF] font-light text-thin">
                    <MaterialCommunityIcons
                      className="text-align-center"
                      name="calendar-end"
                      size={20}
                      color="#FFFF"
                    ></MaterialCommunityIcons>{" "}
                    Ends :{" "}
                  </Text>
                  <Text className="text-white font-light text-thin">
                    {dataEventDetail.General.end} :{" "}
                  </Text>
                  <Text className="text-white font-light text-thin">
                    {dataEventDetail.General.start_Time} :{" "}
                    {dataEventDetail.General.end_Time}
                  </Text>
                </View>
              </View>
            )}
          </View>
          {auth.user.role == "student" && (
            <TouchableOpacity
              onPress={handleGenerateQR}
              className="w-full rounded-xl bg-[#DF013A] h-12 flex justify-center"
            >
              <Text className="text-white font-light text-base text-center p-3 flex-grow">
                Generate QR
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      {idQr && (
        <ModalGenerateQR
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          idQr={idQr}
        ></ModalGenerateQR>
      )}
    </SafeAreaView>
  );
};
