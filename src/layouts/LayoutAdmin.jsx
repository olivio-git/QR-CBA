import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  BackHandler,
  Alert,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { loginKey } from "../config/configGlobal.json";
import * as SecureStore from "expo-secure-store";
import { useNavigation } from "@react-navigation/native";
import Constants from "expo-constants";
import { colors } from "../config/environments";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DataContext } from "../context/Provider";
import { ModalProfile } from "../components/ModalProfile";
import ReaderQR from "../components/ReaderQR";
import { responseData, validateSession } from "../https/PostFetchs";
import { StatusBar } from "expo-status-bar";
import { ColorSpace } from "react-native-reanimated";
import EventosPng from "../../assets/Eventos.png";
import QrButton from "../../assets/QrButton.png";
import { EventsManager } from "../components/EventsManager";
import { LayoutPodcast } from "./LayoutPodcast";

export const LayoutAdmin = () => {
  const { auth, setDataAuth } = useContext(DataContext);
  const [session, setSession] = useState({
    user: null,
  });
  const [activity, setACtivity] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuButtonActive, setMenuButtonActive] = useState("qr");
  const navigate = useNavigation();

  const getAuthLocalStorge = async () => {
    try {
      const token = await SecureStore.getItemAsync(loginKey);
      const result = await validateSession(token);
      setSession(token);
      if (auth) {
        setDataAuth(result.data.user);
        setACtivity(false);
        setRefreshing(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAuthLocalStorge();
  }, []);
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
              navigate.navigate("login");
            },
          },
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [navigate]);

  return (
    <SafeAreaView style={styles.container}>
      {/* <StatusBar style="light"></StatusBar> */}
      {activity ? (
        <ActivityIndicator
          size="large"
          color={colors.colorGreen}
          style={styles.indicator}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.header}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={getAuthLocalStorge}
              ></RefreshControl>
            }
          >
            <View style={styles.viewProfileImage}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  style={styles.image}
                  source={{ uri: auth.user._profileImage }}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialCommunityIcons
                  name="menu-down"
                  size={30}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.viewProfile}>
              <Text style={styles.textProfile}>
                {auth.user.nombres + " " + auth.user.apellidos}
                {/* {"a"} */}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.body}>
            <View>
              <TouchableOpacity>
                <View style={styles.containerMenu}>
                  <TouchableOpacity
                    style={
                      menuButtonActive == "qr"
                        ? styles.buttonContainerMenuActive
                        : styles.buttonContainerMenu
                    }
                    onPress={() => setMenuButtonActive("qr")}
                  >
                    {/* <Text
                      style={
                        menuButtonActive == "qr"
                          ? styles.menuButtonTextActiv
                          : styles.menuButtonTextDesactiv
                      }
                    >
                    </Text> */}
                    <MaterialCommunityIcons
                      name="qrcode-scan"
                      size={30}
                      color={menuButtonActive == "qr" ? "#FFFF" : "gray"}
                    />
                    {/* <Image
                          source={QrButton}
                          style={styles.menuButtonPng}
                        ></Image> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      menuButtonActive == "eventos"
                        ? styles.buttonContainerMenuActive
                        : styles.buttonContainerMenu
                    }
                    onPress={() => setMenuButtonActive("eventos")}
                  >
                    {/* <Text
                      style={
                        menuButtonActive == "eventos"
                          ? styles.menuButtonTextActiv
                          : styles.menuButtonTextDesactiv
                      }
                    >
                    </Text> */}
                    <MaterialCommunityIcons
                      name="calendar-month-outline"
                      size={30}
                      color={menuButtonActive == "eventos" ? "#FFFF" : "gray"}
                    />
                    {/* <Image
                          source={EventosPng}
                          style={styles.menuButtonPng}
                        ></Image> */}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      menuButtonActive == "podcast"
                        ? styles.buttonContainerMenuActive
                        : styles.buttonContainerMenu
                    }
                    onPress={() => setMenuButtonActive("podcast")}
                  >
                    {/* <Text
                      style={
                        menuButtonActive == "qr"
                          ? styles.menuButtonTextActiv
                          : styles.menuButtonTextDesactiv
                      }
                    >
                    </Text> */}
                    <MaterialCommunityIcons
                      name="google-podcast"
                      size={30}
                      color={menuButtonActive == "podcast" ? "#FFFF" : "gray"}
                    />
                    {/* <Image
                          source={QrButton}
                          style={styles.menuButtonPng}
                        ></Image> */}
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
            {menuButtonActive == "qr" && <ReaderQR></ReaderQR>}
            {menuButtonActive == "eventos" && <EventsManager></EventsManager>}
            {menuButtonActive == "podcast" && <LayoutPodcast></LayoutPodcast>}
          </View>
          {/* Modal profile aqui abajito */}
          <ModalProfile
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            session={auth.user}
          ></ModalProfile>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    // backgroundColor: "red",
    // borderColor: "red",
    backgroundColor: colors.bgBody,
    gap: 10,
  },
  viewProfileImage: {
    width: "20%",
    height: "100%",

    flexDirection: "row",
    alignItems: "center",
  },
  viewProfile: {
    width: "80%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 20,
  },
  textProfile: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.colorWhite,
  },
  body: {
    flex: 12,
    backgroundColor: colors.bgBody,
    // paddingHorizontal: 10,
  },
  footer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: colors.colorWhite,
    padding: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  iconContainer: {
    width: 100,
    height: 100,
    padding: 5, // Ajusta el padding según sea necesario
    borderRadius: 50, // Ajusta el borderRadius según el efecto deseado
    borderWidth: 1, // Ajusta el grosor del borde
    borderColor: colors.colorButtonRed,
    alignItems: "center", // Centra el ícono horizontalmente
    justifyContent: "center", // Centra el ícono verticalmente
    // backgroundColor:"green"
  },
  containerMenu: {
    display: "flex",
    gap: 50,
    backgroundColor: "#111B21",
    flexDirection: "row",
    justifyContent: "center",
    // paddingHorizontal: 10,
    paddingVertical: 12,
    borderBottomWidth: 1, // Especifica el ancho del borde inferior
    borderBottomColor: "gray", // Especifica el color del borde inferior
    // borderTopColor: "gray", // Especifica el color del borde inferior
    // borderTopWidth: 1,
  },
  buttonContainerMenu: {
    backgroundColor: "#293237",
    width: "20%", // Cada botón ocupará la mitad del ancho disponible
    justifyContent: "center", // Centra el botón verticalmente dentro de su contenedor
    alignItems: "center", // Centra el botón horizontalmente dentro de su contenedor
    height: 40,
    // borderWidth: 1,
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
    borderRadius: 12,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  buttonContainerMenuActive: {
    backgroundColor: "#293237",
    width: "20%", // Cada botón ocupará la mitad del ancho disponible
    justifyContent: "center", // Centra el botón verticalmente dentro de su contenedor
    alignItems: "center", // Centra el botón horizontalmente dentro de su contenedor
    height: 40,
    borderRadius: 12,
    // borderWidth: 1,
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  menuButtonPng: {
    width: 30,
    height: 30,
  },
  menuButtonTextDesactiv: {
    color: colors.bgBody,
  },
  menuButtonTextActiv: {
    color: colors.colorWhite,
  },
});
