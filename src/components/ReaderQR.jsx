import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { colors } from "../config/environments";
import QRGIF from "../../assets/QR.gif"
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
// import { PinchGestureHandler, Animated } from 'react-native-gesture-handler';


export default function ReaderQR() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [camera, setCamera] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    alert(`Scanneo completo ${data}`);
    const response = await axios.post(
      `http://192.168.0.14:3001/appi/users/qr/reader/`,
      { type, data }
    );
    console.log(data);
  };

  const renderCamera = () => {
    return (
      <View
        style={{
          width: "100%",
          aspectRatio: 1,
          overflow: "hidden",
          // borderRadius: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,

          // marginBottom: 5,
          borderWidth: 1,
          borderColor: scanned ? "#33C398" : "red",
        }}
      >
        <Camera
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <Animated.View
      entering={FadeInUp.delay(200).duration(1000).springify()}
      style={styles.container}
    >
      {/* <LinearGradient colors={["#093637", "#44A08D"]} style={styles.gradient}> */}
      <Text style={styles.paragraph}>QR scanner </Text>
      {camera ? (
        <Pressable onPress={() => setCamera(!camera)} style={styles.cameraIcon}>
          <Feather name="camera-off" size={35} color={colors.colorButtonRed} />
          <Text style={{ color: "white" }}>Turn off camera</Text>
        </Pressable>
      ) : (
        <Pressable onPress={() => setCamera(!camera)} style={styles.cameraIcon}>
          <Feather name="camera" size={35} color={colors.colorGreen} />
          <Text style={{ color: "white" }}>Turn on camera</Text>
        </Pressable>
      )}

      {camera
        ? renderCamera()
        : null
          // <View>
          //   <Image source={QRGIF} style={styles.cameraContainerQr}></Image>
          // </View>
      }
      {camera ? (
        <Pressable
          style={({ pressed }) => [
            {
              backgroundColor: scanned
                ? colors.colorGreen
                : colors.colorButtonRed,
              padding: 10,
              width: "100%", 
              borderBottomRightRadius: 12,
              borderBottomLeftRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={() => setScanned(!scanned)}
        >
          <Text style={styles.buttonText}>
            {scanned ? "Start" : "Scanning"}{" "}
            {/* <MaterialCommunityIcons
              name="qrcode-scan"
              size={20}
              color={colors.colorBodyDirty}
            /> */}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgBody,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.colorWhite,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
    color: "gray",
  },
  cameraIcon: {
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    width: "100%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 20,
    marginBottom: 5,
    borderWidth:1, 
  },
  cameraContainerQr: {
    width: 290,
    height: 290,
    borderRadius: 55,
    overlayColor: "transparent",
  },
  camera: {
    flex: 1,
  },
  viewDontCamera: {
    flex: 1,
  },
  button: {
    backgroundColor: "#df013a",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.colorWhite,
    padding: 5,
  },
  iconContainer: {
    width: 100,
    height: 100,
    padding: 5, // Ajusta el padding según sea necesario
    borderRadius: 50, // Ajusta el borderRadius según el efecto deseado
    borderWidth: 1, // Ajusta el grosor del borde
    borderColor: colors.colorTitlBlue,
    alignItems: "center", // Centra el ícono horizontalmente
    justifyContent: "center", // Centra el ícono verticalmente
    // backgroundColor:"green"
  },
});



