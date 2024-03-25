import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Pressable } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../config/environments";

export default function ReaderQR() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);

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
    console.log(response.data);
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
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
    <View style={styles.container}>
      {/* <LinearGradient colors={["#093637", "#44A08D"]} style={styles.gradient}> */}
      <Text style={styles.title}>Activity Spaces</Text>
      <Text style={styles.paragraph}>QR scanner </Text>
      {renderCamera()} 
      <Pressable
        style={({ pressed }) => [
          {
            backgroundColor: scanned
              ? colors.colorGreen
              : colors.colorButtonRed,
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={() => setScanned(false)}
      >
        <Text style={styles.buttonText}>
          {scanned ? "Start to job" : "Scanning"}{" "}
          <MaterialCommunityIcons
            name="qrcode-scan"
            size={20}
            color={colors.colorWhite}
          />
        </Text>
      </Pressable> 
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgBody,
    paddingHorizontal: 1,
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
    marginBottom: 40,
    color: "gray",
  },
  cameraContainer: {
    width: "90%",
    aspectRatio: 1,
    overflow: "hidden",
    borderRadius: 20,
    marginBottom: 40,
  },
  camera: {
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
