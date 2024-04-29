import React, { useContext, useState } from "react";
import {
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { colors } from "../config/environments";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import ModalDatetimePicker from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { DataContext } from "../context/Provider";
import ImagePicture from "../../assets/Picture.png";
import { useNavigation } from "@react-navigation/native";
import ModalPaletteColors from "./ModalPaletteColors";
import Checkbox from "expo-checkbox";
import { formatHours } from "../utils/functions";
import { createEvent, uploadFle } from "../https/PostFetchs";
import * as FileSystem from "expo-file-system";
import { Divider } from "react-native-elements";
import Toast from "react-native-toast-message";
import { useForm, Controller } from "react-hook-form";

export const CreateEvent = ({ modalVisibility, setModalVisibility }) => {
  const navigation = useNavigation();
  const { auth, setDataAuth } = useContext(DataContext);
  const [modalPalette, setModalPalette] = useState(false);
  const [changeAllDay, setChangeAllDay] = useState(false);
  const [evento, setEvento] = useState({
    evento: {
      title: "", //echo
      start: new Date().toISOString().split("T")[0], //echo
      end: new Date().toISOString().split("T")[0], //echo
      color: "#003785", //echo
      state: true, //echo
      tipo: "General", //echo
      start_Time: "00:00", //echo
      end_Time: "00:00", //echo
      allDay: true, //echo
      UsarioIdUsuario: auth.user._userId ? auth.user._userId : "", //echo
    },
    datos_Evento: {
      descripcion: "", //echo
      multimedia: "",
      categoria: "",
      EventoId: "",
    },
    consigna: {
      descripcion: "",
      cantidad_Referidos: 0,
      top: "",
      nota_Asignada: 0,
      estado: true,
    },
  });

  const [date, setDate] = useState(new Date()); //fechas
  const [showDateStart, setShowDateStart] = useState(false); //mostrar calendar
  const [showDateEnd, setShowDateEnd] = useState(false); //mostrar calendar
  const [showHoursStart, setShowHoursStart] = useState(false); //mostrar hours
  const [showHoursEnd, setShowHoursEnd] = useState(false); //mostrar hours
  const [imageData, setImageData] = useState("");
  const [permission, requestPermission] = ImagePicker.useCameraPermissions();
  const [height, setHeight] = useState(undefined);

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
      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setImageData(`data:image/jpeg;base64,${base64}`);
    }
  };

  //create evento
  const handleCreateEvento = async (fs) => {
    try {
      const response = await createEvent(fs);
      Toast.show({
        type: "success",
        text1: "Success! ¿✅ ",
        text2: `Creación exitosa!. 🙂`,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error intentenlo nuevamente!",
      });
    }
  };
  const uploadPhoto = async () => {
    try {
      const response = await uploadFle([imageData]);
      setEvento({
        ...evento,
        datos_Evento: {
          ...evento.datos_Evento,
          multimedia: response.data.results,
        },
      });
      const format = {
        evento: evento.evento,
        datos_Evento: {
          descripcion: evento.datos_Evento.descripcion,
          multimedia: response.data.results,
          categoria: evento.datos_Evento.categoria,
          EventoId: "",
        },
        consigna: evento.consigna,
      };
      await handleCreateEvento(format);
    } catch (error) {}
  };

  const takePhoto = async () => {
    //tomar foto
    if (permission.status !== "granted") {
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3.5, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      // Aquí puedes subir la imagen a Firebase Storage
      setImageData(result.assets[0].uri);
    }
  };
  const handleModalSelectColorChange = (value) => {
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        color: value,
      },
    });
    setModalPalette(false);
  };
  const onChangeDateStart = (event, selectedDate) => {
    const currentDate = event;
    setShowDateStart(false);
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        start: currentDate.toISOString().split("T")[0],
      },
    });
  };
  const onChangeDateEnd = (event, selectedDate) => {
    const currentDate = event;
    setShowDateEnd(false);
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        end: currentDate.toISOString().split("T")[0],
      },
    });
  };
  const onChangeHoursStart = (hour, selectedDate) => {
    const currentDate = hour;
    setShowHoursStart(false);
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        start_Time: `${hours}:${minutes}`,
      },
    });
  };
  const onChangeHoursEnd = (hour, selectedDate) => {
    const currentDate = hour;
    setShowHoursEnd(false);
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        end_Time: `${hours}:${minutes}`,
      },
    });
  };
  const handleChangeTextEvent = (value, property) => {
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        [property]: value,
      },
    });
  };
  const handleChangeTextDatosEvent = (value, property) => {
    setEvento({
      ...evento,
      datos_Evento: {
        ...evento.datos_Evento,
        [property]: value,
      },
    });
  };
  const handleChangeTextConsign = (value, property) => {
    setEvento({
      ...evento,
      consigna: {
        ...evento.consigna,
        [property]: value,
      },
    });
  };
  const handleChangeSelectAllDay = ()=>{
    setChangeAllDay(!changeAllDay)
    setEvento({
      ...evento,
      evento: {
        ...evento.evento,
        allDay: !evento.evento.allDay,
      },
    });
  }
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });
  return (
    <SafeAreaView className="flex-1 bg-[#111B21] justify-center items-center w-full">
      <StatusBar style="inverted"></StatusBar>
      <ScrollView className="flex-1 rounded-xl p-4 w-full">
        <View className="flex-1 py-4 h-50 items-center">
          <View className="flex flex-row justify-start bg-[#111B21] w-full items-center">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="flex items-center 
                bg-[#293237] p-3 rounded-l-xl w-16 justify-center"
            >
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="white"
              ></MaterialCommunityIcons>
            </TouchableOpacity>
            <Text
              className="ml-1 bg-[#293237] text-white font-light text-base text-center 
            p-3 rounded-r-xl flex-grow"
            >
              Create event
            </Text>
          </View>

          <View className="flex  p-2 flex-column justify-between w-full ">
            <Text className="flex-grow font-light text-2xl text-start text-white mt-1">
              Creation form
            </Text>
            <Text className="flex-grow font-light text-xs text-start text-white mt-1">
              Write the title
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  onChangeText={(text) => handleChangeTextEvent(text, "title")}
                  className="h-20 mt-1 rounded-lg flex-grow border-gray-300 bg-gray-300 pl-2"
                  placeholder="title"
                ></TextInput>
              )}
              name="title"
            ></Controller>
            {errors.firstName && <Text>This is required.</Text>}
            <Text className="flex-grow font-light text-xs text-start text-white mt-6">
              Write the description
            </Text>
            <TextInput
              onChangeText={(text) =>
                handleChangeTextDatosEvent(text, "descripcion")
              }
              className={`h-[${height}] mt-1 rounded-lg flex-grow border-gray-300 bg-gray-300 pl-2`}
              multiline
              placeholder="description"
              onContentSizeChange={(event) => {
                setHeight(event.nativeEvent.contentSize.height);
              }}
            />
            <View className="w-full flex-row w-full mt-6">
              <View className="w-[50%]">
                <Text className="flex-grow font-light text-xs text-start text-white mt-1">
                  Select start date
                </Text>
                <TouchableOpacity //select start date
                  onPress={() => setShowDateStart(true)}
                  className="w-full flex-row mt-1 h-12 border bg-gray-300 
            flex items-center justify-center rounded-xl"
                >
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    color="black"
                  />
                  <Text className="font-light text-xs text-start text-black">
                    {evento.evento.start}
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-[50%]">
                <Text className="flex-grow font-light text-xs text-start text-white mt-1">
                  Select end date
                </Text>
                <TouchableOpacity //select end date
                  onPress={() => setShowDateEnd(true)}
                  className="w-full flex-row mt-1 h-12 border bg-gray-300 
                flex items-center justify-center rounded-xl"
                >
                  <MaterialCommunityIcons
                    name="calendar"
                    size={24}
                    color="black"
                  />
                  <Text className="font-light text-xs text-start text-black">
                    {evento.evento.end}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text className="flex-grow font-light text-xs text-start text-white mt-6">
              Select to color
            </Text>
            <TouchableOpacity //select end date
              onPress={() => setModalPalette(true)}
              className="w-full flex-row mt-1 h-12 bg-gray-300 
                flex items-center justify-center rounded-xl"
            >
              <View className="w-[30%] flex items-center">
                <MaterialCommunityIcons
                  name="palette-outline"
                  size={24}
                  color="black"
                ></MaterialCommunityIcons>
              </View>
              <View
                className={`w-[70%] h-12 rounded-lg flex items-center justify-center`}
                style={{ backgroundColor: evento.evento.color }}
              >
                <Text className="font-light text-xs text-start text-white">
                  {evento.evento.color}
                </Text>
              </View>
            </TouchableOpacity>
            <Text className="flex-grow font-light text-xs text-start text-white mt-6">
              By default the schedule will be all day
            </Text>
            <Text className="flex-grow font-light text-xs text-start text-white mt-1">
              or Change schedule?
            </Text>
            <Checkbox
              value={changeAllDay}
              onValueChange={handleChangeSelectAllDay}
              className="bg-transparent border-[0.5px] w-6 h-6 "
            ></Checkbox>
            {changeAllDay ? (
              <View className="w-full flex-row w-full">
                <View className="w-[50%]">
                  <Text className="flex-grow font-light text-xs text-start text-white mt-1">
                    Select start hour
                  </Text>
                  <TouchableOpacity //select start Hours
                    onPress={() => setShowHoursStart(true)}
                    className="w-full flex-row mt-1 h-12 border bg-gray-300 
                  flex items-center justify-center rounded-xl shadow shadow-xl"
                  >
                    <MaterialCommunityIcons
                      name="clock-start"
                      size={24}
                      color="black"
                    />
                    <Text className="font-light text-xs text-start text-black">
                      {evento.evento.start_Time
                        ? formatHours(evento.evento.start_Time)
                        : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-[50%]">
                  <Text className="flex-grow font-light text-xs text-start text-white mt-1">
                    Select end our
                  </Text>
                  <TouchableOpacity //select end Hours
                    onPress={() => setShowHoursEnd(true)}
                    className="w-full flex-row mt-1 h-12 border bg-gray-300 
                  flex items-center justify-center rounded-xl"
                  >
                    <MaterialCommunityIcons
                      name="clock-end"
                      size={24}
                      color="black"
                    />
                    <Text className="font-light text-xs text-start text-black">
                      {evento.evento.end_Time
                        ? formatHours(evento.evento.end_Time)
                        : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            <View className="w-full flex-row w-full mt-6">
              <View className="w-[100%]">
                <Text className="flex-grow font-light text-xs text-start text-white mt-1">
                  Select image
                </Text>
                <TouchableOpacity //select image
                  onPress={selectImage}
                  className="w-full flex-row mt-1 h-12 border bg-gray-300 
                  flex items-center justify-center rounded-xl"
                >
                  <MaterialCommunityIcons name="image" size={24} color="gray" />
                  <Text className="font-light text-xs text-start text-black">
                    Find image
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="w-full flex-row w-full mt-6 justify-center">
              {imageData && (
                <Image
                  source={{ uri: imageData }}
                  style={{
                    width: "100%",
                    aspectRatio: 3 / 4,
                    resizeMode: "contain",
                  }}
                ></Image>
              )}
            </View>
            <Divider className="bg-gray-200 mt-10 mb-5"></Divider>
            <View className="flex  p-2 flex-column justify-between w-full ">
              <Text className="flex-grow font-light text-2xl text-start text-white mt-1">
                Consigna
              </Text>
              <Text className="flex-grow font-light text-xs text-start text-white mt-6">
                Write the description
              </Text>
              <TextInput
                className={`h-[${height}] mt-1 rounded-lg flex-grow border-gray-300 bg-gray-300 pl-2`}
                multiline
                onChangeText={(text) =>
                  handleChangeTextConsign(text, "descripcion")
                }
                placeholder="description"
                onContentSizeChange={(event) => {
                  setHeight(event.nativeEvent.contentSize.height);
                }}
              />
              <Text className="flex-grow font-light text-xs text-start text-white mt-6">
                Number of referrals
              </Text>
              <TextInput
                onChangeText={(text) =>
                  handleChangeTextConsign(text, "cantidad_Referidos")
                }
                className="h-12 mt-1 rounded-lg flex-grow border-gray-300 bg-gray-300 pl-2"
                placeholder="0"
              ></TextInput>
            </View>
            <View className="w-full flex-row w-full mt-6">
              <View className="w-[100%]">
                <TouchableOpacity //select image
                  onPress={uploadPhoto}
                  className="w-full flex-row mt-1 h-12 border bg-[#DF013A] 
                  flex items-center justify-center rounded-xl"
                >
                  {/* <MaterialCommunityIcons
                    name="content-save-all"
                    size={24}
                    color="gray"
                  /> */}
                  <Text className="font-light text-md text-start text-white">
                    Save event
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <ModalPaletteColors
              evento={evento}
              handleModalSelectColorChange={handleModalSelectColorChange}
              modalPalette={modalPalette}
              setModalPalette={setModalPalette}
            ></ModalPaletteColors>
            {/* Dates */}
            <ModalDatetimePicker
              isVisible={showDateStart}
              mode="date"
              onConfirm={onChangeDateStart}
              onCancel={() => setShowDateStart(false)}
            />
            <ModalDatetimePicker
              isVisible={showDateEnd}
              mode="date"
              onConfirm={onChangeDateEnd}
              onCancel={() => () => setShowDateEnd(false)}
            />
            {/* Hours */}
            <ModalDatetimePicker
              isVisible={showHoursStart}
              mode="time"
              is24Hour={false} // Esto es solo para Android, para iOS se usa el locale
              locale="en_GB" // Esto fuerza el formato de 12 horas en iOS
              onConfirm={onChangeHoursStart}
              onCancel={() => () => setShowDateEnd(false)}
            />
            <ModalDatetimePicker
              isVisible={showHoursEnd}
              mode="time"
              onConfirm={onChangeHoursEnd}
              onCancel={() => () => setShowDateEnd(false)}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
