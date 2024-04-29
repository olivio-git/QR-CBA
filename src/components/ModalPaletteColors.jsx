import React from "react";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Text, View } from "react-native";
import { Modal } from "react-native";

const arrayColors = [
  { nombre: "Azul", color: "#003785" },
  { nombre: "Verde", color: "#98ff96" },
  { nombre: "Rojo", color: "#D50032" },
  { nombre: "Lila", color: "#b0c2f2" },
  { nombre: "Turquesa", color: "#96c4c4" },
];

const ModalPaletteColors = ({
  evento,
  handleModalSelectColorChange,
  modalPalette,
  setModalPalette,
}) => {

  const chunkArray = (array, chunkSize) => {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  };

  const colorsInRows = chunkArray(arrayColors, 3);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalPalette}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <TouchableWithoutFeedback onPress={()=>setModalPalette(false)}>
        <View className="flex-1 justify-center items-center w-full backdrop-blur-sm">
          <View className="bg-white w-[80%] p-8 rounded-lg "> 
            {colorsInRows.map((row, rowIndex) => (
              <View key={rowIndex} className="flex flex-row">
                {row.map((clg, index) => (
                  <TouchableOpacity
                     onPress={()=>handleModalSelectColorChange(clg.color)}
                    key={index}
                    className="w-16 h-16 rounded-full m-2 flex justify-center items-center"
                    style={{ backgroundColor: clg.color }}
                  >
                    <Text className="text-white font-light text-xs text-center">{clg.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalPaletteColors;
