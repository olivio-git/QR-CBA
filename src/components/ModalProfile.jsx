import React, { useState } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../config/environments";
import { useNavigation } from "@react-navigation/native";
import { loginKey } from "../config/configGlobal.json";
import * as SecureStore from "expo-secure-store";
import { AntDesign } from "@expo/vector-icons";
import { ModalImageProfile } from "./ModalImageProfile";

export const ModalProfile = ({ modalVisible, setModalVisible, session }) => {
  const [modalVisibility, setModalVisibility] = useState(false);
  const navigate = useNavigation();
  const removeSession = async () => {
    SecureStore.deleteItemAsync(loginKey);
    navigate.navigate("login");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.headerModal}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <AntDesign
                name="closecircle"
                size={24}
                color={colors.colorTitlBlue}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalViewBodyCamp}>
            <View>
              <TouchableOpacity onPress={() => setModalVisibility(true)}>
                <Image
                  style={styles.image}
                  source={{ uri: session._profileImage }}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{session.nombres}</Text>
            <Text style={styles.userEmail}>{session.correo}</Text>
            <TouchableOpacity onPress={removeSession}>
              <Text style={styles.modalText}>¡Cerrar sesión!</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalViewBodyMenu}></View>
        </View>
      </View>
      <ModalImageProfile
        modalVisibility={modalVisibility}
        setModalVisibility={setModalVisibility}
        image={session._profileImage}
      ></ModalImageProfile>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
  },
  modalView: {
    flex: 1,
    backgroundColor: colors.colorWhite,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalViewBodyMenu: {
    flex: 2,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    color: colors.colorTitlBlue,
  },
  headerModal: {
    alignItems: "flex-end",
    backgroundColor: colors.colorWhite,
    padding: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modalViewBodyCamp: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: colors.colorWhite,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: colors.colorTitlBlue,
  },
  userEmail: {
    fontSize: 18,
    color: colors.colorTitlBlue,
  },
});
