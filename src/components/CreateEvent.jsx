import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../config/environments";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import ModalDatetimePicker from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { DataContext } from "../context/Provider";
import ImagePicture from "../../assets/Picture.png";
import { useNavigation } from "@react-navigation/native";
export const CreateEvent = ({ modalVisibility, setModalVisibility }) => {
  const navigate = useNavigation();
  const { auth, setDataAuth } = useContext(DataContext);

  const [evento, setEvento] = useState({
    title:"",
    start:"",
    end:"",
    color:"",
    state:"",
    tipo:"",
    start_Time:"",
    end_Time:"",
    allDay:"",
    UsarioIdUsuario:"",
    descripcion:"",
    multimedia:"",
    categoria:"",
    EventoId:""
  });
  
  const [date, setDate] = useState(new Date()); //fechas
  const [show, setShow] = useState(false); //mostrar calendar

  const [imageData, setImageData] = useState("");
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();

  const selectImage = async () => {
    if (permission.status !== "granted") {
      return;
    } 
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    }); 
    if (!result.cancelled) { 
      setImageData(result.assets[0].uri);
    }

    console.log(imageData);
  };

  const takePhoto = async () => { //tomar foto
    if (permission.status !== "granted") {
      return;
    } 
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    }); 
    console.log(result);

    if (!result.cancelled) {
      // Aquí puedes subir la imagen a Firebase Storage
      setImageData(result.assets[0].uri);
    } 
  };


  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="inverted"></StatusBar>
      <TouchableOpacity>
        <Text style={{color:"white"}} onPress={()=>navigate.goBack()} >Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={selectImage}>
        {imageData ? (
          <Image
            source={{uri:imageData}}
            style={{ width: 100, height: 100, backgroundColor: "transparent" }}
          ></Image>
        ) : (
          <Image
            source={ImagePicture}
            style={{ width: 100, height: 100, backgroundColor: "transparent" }}
          ></Image>
        )}
      </TouchableOpacity>
      <View style={styles.modalViewBodyCamp}>
        <View style={{width:"80%"}} >
          <TextInput style={styles.input} placeholder="Título del evento" />
        </View>
        <View style={{width:"80%"}} >
          <TextInput style={styles.input} placeholder="Fecha de inicio" />
        </View>
        <View style={{width:"80%"}} >
          <TextInput style={styles.input} placeholder="Fecha de fin" />
        </View>
        <View style={{width:"80%"}} >
          <TextInput style={styles.input} placeholder="Color del evento" />
        </View>
        <View style={{width:"80%"}} >
        <Picker style={styles.picker}>
          <Picker.Item label="Estado 1" value="estado1" />
          <Picker.Item label="Estado 2" value="estado2" />
          {/* Agrega más estados según sea necesario */}
        </Picker>
        </View>
        <ModalDatetimePicker
          isVisible={show}
          mode="date"
          onConfirm={onChange}
          onCancel={() => setShow(false)}
        />
        <Picker style={styles.picker}>
          <Picker.Item label="Tipo 1" value="tipo1" />
          <Picker.Item label="Tipo 2" value="tipo2" />
          {/* Agrega más tipos según sea necesario */}
        </Picker>
        <TextInput style={styles.input} placeholder="Hora de inicio" />
        <TextInput style={styles.input} placeholder="Hora de fin" />
        <Picker style={styles.picker}>
          <Picker.Item label="Todo el día" value={true} />
          <Picker.Item label="No todo el día" value={false} />
        </Picker>
        <TextInput style={styles.input} placeholder="ID de usuario" />
        {/* <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Crear Evento</Text>
        </TouchableOpacity>
        <TouchableOpacity title="Tomar Foto" onPress={takePhoto}>
          <Text style={styles.createButtonText}>Tomar</Text>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBody,
    alignItems:"center"
  },
  header: {
    flex: 1,
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "red",
    borderColor: "red",
    backgroundColor: colors.bgBody,
    gap: 10,
  },
  modalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.bgBody,
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
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.colorGreen,
  },
  modalViewBodyCamp: {
    flex: 1,
    alignItems:"flex-start",
    padding: 20,
    backgroundColor: colors.bgBody,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width:"100%"
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderColor: "gray",
    // borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  picker: {
    height: 40,
    width: "100%",
    borderColor: colors.colorGray,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: colors.colorTitlBlue,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  createButtonText: {
    color: colors.colorWhite,
    fontSize: 16,
    fontWeight: "bold",
  },
});
