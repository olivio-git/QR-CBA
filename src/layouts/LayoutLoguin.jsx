import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Ligth from "../../assets/light.png";
import { userLoginPost } from "../https/PostFetchs";
import { loginKey } from "../config/configGlobal.json";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../config/environments";
import { DataContext } from "../context/Provider";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";

export const LayoutLoguin = () => {
  const { setDataAuth } = useContext(DataContext);
  const navigate = useNavigation();
  const [key, setKey] = useState();
  const [user, setUser] = useState({
    correo: "",
    password: "",
  });
  const [activity, setACtivity] = useState(false);
  //http://localhost:3001/appi/datosevento
  const handleLogin = async () => {
    try {
      setACtivity(true);
      await SecureStore.deleteItemAsync(loginKey);
      const response = await userLoginPost(user);
      await SecureStore.setItemAsync(loginKey, JSON.stringify(response.data));
      setACtivity(false);
      setDataAuth(response.data);
      if (response.data.rol == "Admin") {
        navigate.navigate("admin");
      } else {
        navigate.navigate("student");
      }
    } catch (error) { 
      Alert.alert(
        "Error de inicio de sesión",
        "Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo.",
        [{ text: "OK", onPress: () => setACtivity(false) }],
        { cancelable: false }
      ); 
    }
  };
  const handleChange = (property, value) => {
    //cargar los datos de los inputs
    setUser({
      ...user,
      [property]: value,
    });
  };
  const validationSession = async () => {
    const response = await SecureStore.getItemAsync(loginKey);
    if (response) {
      const userData = await JSON.parse(response);
      setACtivity(false);
      if (userData.rol === "Admin") {
        navigate.navigate("admin");
      } else {
        navigate.navigate("student");
      }
    }
  };
  useEffect(() => {
    validationSession();
  }, []);
  return (
    <SafeAreaView style={activity ? styles.containerSpin : styles.container}>
      {activity ? (
        <ActivityIndicator
          size="large"
          color={colors.colorGreen}
          style={styles.indicator}
        />
      ) : (
        <>
          <View style={styles.body}>
            <Image source={Ligth}></Image>
            <Text style={styles.title}>ACTIVITY SPACES</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="gray"
              value={key}
              onChangeText={(text) => handleChange("correo", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="gray"
              onChangeText={(text) => handleChange("password", text)}
              secureTextEntry
            />
            <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>LOGIN</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerTextCB}>CBA Tarija - 2024</Text>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerSpin: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgBody,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover", // Asegura que la imagen de fondo cubra todo el espacio disponible
    justifyContent: "center",
  },
  body: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bgBody,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: colors.colorTitlBlue,
    // fontFamily: "",
  },
  input: {
    width: "90%",
    height: 40,
    backgroundColor: "#FFFFFF",
    borderColor: "gray",
    // borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  loginButton: {
    width: "90%",
    height: 40,
    backgroundColor: colors.colorButtonRed,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#08171C",
  },
  footerTextCB: {
    color: "#E2DFDA",
    fontSize: 10,
  },
  indicator: {
    padding: 12,
    backgroundColor: "transparent",
    borderRadius: 12,
  },
});
