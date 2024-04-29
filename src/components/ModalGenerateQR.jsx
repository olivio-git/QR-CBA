import React, { useContext, useEffect, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { generateQrCode } from "../https/PostFetchs";
import { DataContext } from "../context/Provider";
import { TouchableOpacity } from "react-native";

export const ModalGenerateQR = ({ isVisible, setIsVisible, idQr }) => {
  const viewShotRef = useRef(null);

  const { dataEventDetail, auth, selectedEventoDetails } =
    useContext(DataContext);
  const [indicator, setIndicator] = useState(false);
  const [qrCode, setQrCode] = useState({
    data: "",
  });
  const saveAndShareImage = async () => {
    if (viewShotRef.current) {
      const uri = await viewShotRef.current.capture();
      const path = FileSystem.documentDirectory + "Spellen_Marco_2024.png";
      await FileSystem.moveAsync({
        from: uri,
        to: path,
      });
      await shareImage(path);
    }
  };
  const shareImage = async (uri) => {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      alert("No se puede compartir en este dispositivo");
      return;
    }

    try {
      await Sharing.shareAsync(uri);
    } catch (error) {
      alert("Error al compartir: " + error.message);
    }
  }; 
  useEffect(() => {
    // handleGenerateQR(); 
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
        <View className="flex-1 justify-center items-center w-full backdrop-blur-sm">
          <View className="bg-white w-[80%] p-8 rounded-lg">
            <Text className="text-center text-xl font-bold">Generar QR</Text>
            <Text className="text-center text-sm text-gray-500">
              Escanea este código QR para confirmar tu asistencia
            </Text>
            {/* <Image
                className="w-1/2 h-1/2 m-auto"
                // source={require("../assets/qr.png")}
                /> */}
            {indicator ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <View className="w-full flex justify-center items-center p-5" >
                <ViewShot className="p-5 bg-white" ref={viewShotRef}>
                  <QRCode
                    value={idQr}
                    logo={{ uri: "https://i.ibb.co/fFM4dmk/cba-bar.png" }}
                    logoSize={30}
                    logoMargin={2}
                    logoBackgroundColor="white"
                    size={200}
                    enableLinearGradient={true}
                    linearGradient={["rgb(213, 0, 50)", "rgb(0, 46, 95)"]}
                    ecl="H"
                  />
                </ViewShot>
                <TouchableOpacity onPress={saveAndShareImage}>
                  <Text className="text-center text-sm text-gray-500">
                    Compartir Código QR
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Text className="text-center text-sm text-gray-500">
              Escanea este código QR para confirmar tu asistencia
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
