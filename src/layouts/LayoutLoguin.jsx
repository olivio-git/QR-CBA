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
  Pressable,
  ScrollView,
  BackHandler,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Back from "../../assets/background.png";
import Ligth from "../../assets/light.png";
import CBA from "../../assets/CBA.png";
import RNPickerSelect from "react-native-picker-select";
import { userLoginPost, validateSession } from "../https/PostFetchs";
import { loginKey } from "../config/configGlobal.json";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../config/environments";
import { DataContext } from "../context/Provider";
import { useFonts, Inter_900Black } from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ModalSelectType } from "../components/ModalSelectType";

export const LayoutLoguin = () => {
  const { setDataAuth, handleValidateSession } = useContext(DataContext);
  const navigate = useNavigation();
  const [key, setKey] = useState();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [selectValue, setSelectValue] = useState({
    valueSelected: "Seleccione tipo de usuario",
  });
  const [modalSelect, setModalSelect] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [activity, setACtivity] = useState(false);
  //http://localhost:3001/appi/datosevento
  const handleLogin = async () => {
    try {
      setACtivity(true);
      await SecureStore.deleteItemAsync(loginKey);
      if (selectValue.valueSelected != "Seleccione tipo de usuario") {
        //si se selecciono un tipo de usuario
        const response = await userLoginPost(
          {
            email: user.email,
            password: user.password,
          },
          selectValue.valueSelected
        ); //mandamos la request
        setACtivity(false); //desactivamos el boton de carga
        setSelectValue({
          //limpiamos el select
          ...selectValue,
          valueSelected: "Seleccione tipo de usuario",
        });
        setUser({
          //limpiamos los inputs
          ...user,
          email: "",
          password: "",
        });
        if (response.data.token) {
          await SecureStore.setItemAsync(loginKey, response.data.token); //guardamos el token en el local storage
          setDataAuth(response.data); //guardamos los datos del usuario en el contexto
          navigate.navigate("admin");
        } else if (response.data.userData) {
          // Suponiendo que el token se obtiene de alguna manera, por ejemplo, response.data.token
          const token = "tu_token_aqui"; // Reemplaza "tu_token_aqui" con la forma en que obtienes el token
         
          // Agrega el token al objeto userData
          const userDataWithToken = {
             ...response.data.userData,
             token: response.data.accessToken, // Asegúrate de que el nombre de la propiedad sea el correcto
          };
         
          // Guarda el objeto con el token en SecureStore
          await SecureStore.setItemAsync(
             loginKey,
             JSON.stringify(userDataWithToken)
          );
         
          // Guarda los datos del usuario en el contexto
          setDataAuth(userDataWithToken);
         
          // Navega a la pantalla de estudiante
          navigate.navigate("student");
         }
        Toast.show({
          //mostramos un mensaje de exito
          type: "success",
          text1: "Inicio de sesión exitoso!",
          text2: "Bienvenido! 👋",
        });
      } else {
        setACtivity(false); // desactivamos el boton de carga
        Toast.show({
          //mostramos un mensaje de error
          type: "error",
          text1: "Ocurrió un error!",
          text2: "Seleccione el tipo de usuario ⚠️",
        });
      }
    } catch (error) {
      setACtivity(false);
      Toast.show({
        type: "error",
        text1: "Ocurrió un error!",
        text2: "Verifique sus datos e intentelo nuevamente",
      });
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
    const response = await handleValidateSession();
    try {
      if (response == "admin") {
        navigate.navigate("admin");
      } else if (response == "student") {
        navigate.navigate("student");
      } else {
        navigate.navigate("login");
      }
    } catch (error) {
    }
  };

  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  useEffect(() => {
    validationSession();
  }, []);
  useEffect(() => {
    const backAction = () => {
      Alert.alert("Close Application", "¿Are you sure you want to log out?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            BackHandler.exitApp();
          },
        },
      ]);
      return true; // Indica que la acción ha sido manejada
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  return (
    <ImageBackground source={Back} className="flex-1 bg-cover justify-end">
      <StatusBar style="light"></StatusBar>
      <ScrollView>
        <View style={styles.container}>
          <Animated.View
            entering={FadeIn.delay(200).duration(1000).springify()}
            style={styles.topSection}
          >
            <Animated.Image
              className=""
              source={Ligth}
              style={styles.topSection.imageOne}
            ></Animated.Image>
            <Image
              className="h-[160] w-[65]"
              source={Ligth}
              style={styles.topSection.imageTwo}
            ></Image>
          </Animated.View>
          <View className="flex w-full items-center mt-32">
            <Image source={CBA} className="w-16 h-16"></Image>
          </View>
          <Animated.View
            entering={FadeInUp.delay(200).duration(1000).springify()}
            className="flex-1 justify-center items-center"
          >
            {activity ? (
              <ActivityIndicator
                size="large"
                color={colors.colorGreen}
                style={styles.indicator}
              />
            ) : (
              <View className="w-full  items-center p-4 gap-8">
                <TouchableOpacity
                  onPress={() => setModalSelect(!modalSelect)}
                  className="flex flex-row justify-between w-[100%] px-4 items-center h-12 rounded-xl
                 border border-gray-300 bg-gray-300"
                >
                  <Text className="text-gray-500">
                    {selectValue.valueSelected}
                  </Text>
                  <MaterialCommunityIcons
                    name="menu-down"
                    size={30}
                    color="gray"
                  />
                  <ModalSelectType
                    modalSelect={modalSelect}
                    setModalSelect={setModalSelect}
                    selectValue={selectValue}
                    setSelectValue={setSelectValue}
                  ></ModalSelectType>
                </TouchableOpacity>
                <TextInput
                  className="w-[100%] p-4 h-12 rounded-xl border border-gray-300 bg-gray-300"
                  placeholder={
                    selectValue.valueSelected === "Student" ? "Codigo" : "Email"
                  }
                  placeholderTextColor="gray"
                  value={user.email}
                  onChangeText={(text) => handleChange("email", text)}
                />
                <View className="w-full px-4  flex flex-row justify-between rounded-xl items-center border bg-gray-300  border-gray-300">
                  <TextInput
                    className="h-12 w-[90%] pr-4"
                    placeholder="Password"
                    placeholderTextColor="gray"
                    onChangeText={(text) => handleChange("password", text)}
                    secureTextEntry={!isPasswordVisible}
                    value={user.password}
                  />
                  <Pressable onPress={handlePasswordVisibility}>
                    <MaterialCommunityIcons
                      name={!isPasswordVisible ? "eye-off" : "eye"}
                      size={22}
                      color="gray"
                    />
                  </Pressable>
                </View>
                <TouchableOpacity
                  onPress={handleLogin}
                  className="w-full h-12 border bg-[#002E5F] flex items-center justify-center rounded-xl"
                >
                  <Text className="text-white">LOGIN</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topSection: {
    flex: 1,
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    gap: 20,
    imageOne: {},
    imageTwo: {},
  },
  bottomSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  customPickerStyles: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 4,
      color: "black",
      paddingRight: 30, // Asegura que el texto nunca esté detrás del ícono
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: "gray",
      borderRadius: 4,
      color: "black",
      paddingRight: 30, // Asegura que el texto nunca esté detrás del ícono
    },
  },
});
