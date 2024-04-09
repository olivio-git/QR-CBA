import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Divider } from "react-native-elements";
import Picker from "react-native-picker-select";

export const ModalSelectType = ({
  modalSelect,
  setModalSelect,
  selectValue,
  setSelectValue,
}) => {
  const handleSelectAndClose = (value) => {
    console.log(value);
    setSelectValue({
      ...selectValue,
      valueSelected: value,
    });
    setModalSelect(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalSelect}
      onRequestClose={() => {
        setModalSelect(false);
      }}
    >
      <TouchableWithoutFeedback onPress={() => setModalSelect(false)}>
        <View className="flex-1 justify-center items-center mt-56 w-full">
          <View className="divide-y divide-gray-200 divide-y-[0.5px] m-5 bg-white rounded-xl p-4 shadow-lg shadow-gray-500/25 w-3/5">
            {/* <TouchableOpacity
              onPress={() => setModalSelect(false)}
              className="flex w-full items-end"
            >
              <MaterialCommunityIcons name="close" size={30} color="gray" />
            </TouchableOpacity> */}
            {/* <Divider className="bg-gray-200"></Divider> */}
            <TouchableOpacity
              onPress={() => handleSelectAndClose("Student")}
              className="w-full p-4"
            >
              <Text className="text-center">Student</Text>
            </TouchableOpacity>
            {/* <Divider className="bg-gray-200"></Divider> */}
            <TouchableOpacity
              onPress={() => handleSelectAndClose("Teacher")}
              className="w-full p-4"
            >
              <Text className="text-center">Teacher</Text>
            </TouchableOpacity>
            {/* <Divider className="bg-gray-200"></Divider> */}
            <TouchableOpacity
              onPress={() => handleSelectAndClose("Admin")}
              className="w-full p-4"
            >
              <Text className="text-center">Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalSelect(false)}
              className="flex w-full items-center p-4"
            ><Text className="flex text-red-400">Cancelar</Text>
              {/* <MaterialCommunityIcons name="close" size={30} color="gray" /> */}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
