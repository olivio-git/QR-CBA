import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { colors } from "../config/environments";
import { getEvents } from "../https/GetFetchs";
import { DataContext } from "../context/Provider";
import EventButton from "../../assets/CrearEvento.png";
import CardElement from "./CardElement";
import { ModalCreateEvent } from "./CreateEvent";
import {
  useNavigation,
  useNavigationState,
  useRoute,
} from "@react-navigation/native";
import { Divider } from "react-native-elements";

export const EventsManager = () => {
  const route = useRoute();
  const navigate = useNavigation();
  const { auth, dataEvents, handleChargeDataEvents } = useContext(DataContext);
  const handleNavigate = () => {
    navigate.navigate("event");
  };
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    handleChargeDataEvents();
  }, []);

  return (
    <View style={styles.container}>
      {dataEvents.indicator ? (
        <ActivityIndicator
          size="large"
          color={colors.colorGreen}
          style={styles.indicator}
        />
      ) : (
        <View style={styles.containerFlat}>
          <FlatList
            data={dataEvents.data}
            contentContainerStyle={{ flexGrow: 1 }}
            horizontal={false}
            style={{ width: "100%" }}
            keyExtractor={(item) => item.EventoId}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleChargeDataEvents}
              ></RefreshControl>
            }
            renderItem={({ item }) => {
              return (
                <>
                  <CardElement item={item}></CardElement>
                  <Divider className="w-full bg-gray-200"></Divider>
                </>
              );
            }}
          />
        </View>
      )}
      {route.name == "admin" && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleNavigate}
        >
          <Image source={EventButton} style={styles.floatingButtonIcon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgBody,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  containerFlat: {
    flex: 1,
    width: "100%",
  },
  eventCard: {
    backgroundColor: colors.bgCard,
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: "100%",
    shadowColor: "rgb(255,255,255,0,8)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textColor,
  },
  indicator: {
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 12,
  },
  buttonContainerMenu: {
    backgroundColor: colors.colorGreen,
    width: "45%", // Cada botón ocupará la mitad del ancho disponible
    justifyContent: "center", // Centra el botón verticalmente dentro de su contenedor
    alignItems: "center", // Centra el botón horizontalmente dentro de su contenedor
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    // paddingHorizontal: 10,
    textButton: {
      color: colors.colorWhite,
    },
    menuButtonPng: {
      width: 20,
      height: 20,
    },
  },
  containerMenu: {
    display: "flex",
    gap: 10,
    flexDirection: "column", // Alinea los elementos hijos horizontalmente
    justifyContent: "flex-end", // Asegura que los botones estén distribuidos uniformemente a lo largo del eje principal
    alignItems: "flex-end",
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "transparent",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingButtonIcon: {
    width: 50,
    height: 50,
    tintColor: colors.colorGreen,
  },
});
