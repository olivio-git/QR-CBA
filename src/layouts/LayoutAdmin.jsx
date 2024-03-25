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

export const LayoutAdmin = () => {
  const { auth, setDataAuth } = useContext(DataContext);
  const [session, setSession] = useState({
    user: null,
  });
  const [activity, setACtivity] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigation();

  const getAuthLocalStorge = async () => {
    setRefreshing(true);
    const response = await SecureStore.getItemAsync(loginKey);
    const transformJson = await JSON.parse(response);
    setSession(transformJson);
    if (response) {
      setDataAuth(transformJson);
      setACtivity(false);
      setRefreshing(false);
    }
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
              <RefreshControl refreshing={refreshing} onRefresh={getAuthLocalStorge}></RefreshControl>
            }
          >
            <View style={styles.viewProfileImage}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image
                  style={styles.image}
                  source={{ uri: session._profileImage }}
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
                {session.nombres + " " + session.apellidos}
                {/* {"a"} */}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.body}>
            <ReaderQR></ReaderQR>
          </View>  
          {/* Modal profile aqui abajito */}
          <ModalProfile
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            session={session}
          ></ModalProfile>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  header: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "red",
    borderColor: "red",
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
    flex: 10,
    backgroundColor: colors.bgBody,
    padding: 20,
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
});
