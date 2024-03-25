import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../config/environments";

export const ModalImageProfile = ({
  modalVisibility,
  image,
  setModalVisibility,
}) => {
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisibility}
      onRequestClose={()=>{
        setModalVisibility(false)
      }}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisibility(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={{ uri: image }} style={styles.image}></Image>
          </View>
        </View>
      </TouchableOpacity>
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
    backgroundColor: "black",
    borderRadius: 5,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "50%",
  },
  button:{
    width: "100%",
    height:"100%"
  }
});
