import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card } from "react-native-elements";
import { ModalEventDetails } from "./ModalEventDetails";
import { useNavigation } from "@react-navigation/native";
import { DataContext } from "../context/Provider";

const CardElement = ({ item, setEventDetails }) => {
  const { handleSetSelectedEvent } = useContext(DataContext);
  const navigate = useNavigation();
  const handleSelectEventDetails = () => { 
    // setModalDetails(true);
    handleSetSelectedEvent(item.Evento.id);
    navigate.navigate("eventdetail");
  }
  return (
    <View className="rounded-lg shadow-lg overflow-hidden m-2">
      <TouchableOpacity
        onPress={handleSelectEventDetails}
        className="flex flex-row items-center "
      >
        <Image
          className="w-1/5 h-20 rounded-lg"
          source={{ uri: item.multimedia[0] }}
          resizeMode="cover"
          aspectRatio={1}
        />
        <View className="w-4/5 justify-start h-full ml-2 p-2">
          <Text
            className="text-white font-bold"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.Evento.title}
          </Text>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="text-gray-500"
          >
            {item.descripcion}
          </Text>
        </View>
      </TouchableOpacity>
      {/* <ModalEventDetails
        modalDetails={modalDetails}
        setModalDetails={setModalDetails} 
      ></ModalEventDetails> */}
    </View>
  );
};

export default CardElement;
