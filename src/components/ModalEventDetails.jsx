import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react'
import { Modal, SafeAreaView, StatusBar, Text, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'
import { DataContext } from '../context/Provider';
import { getEventDetail } from '../https/GetFetchs';

export const EventDetails = ({modalDetails,setModalDetails,item}) => {
  const { selectedEventoDetails,handleSetSelectedEvent } = useContext(DataContext);
  const [indicatorState, setIndicatorState] = useState(false);
  const handleChargeDataEventDetail = async () => {
    try {
      setIndicatorState(true);
      const response = await getEventDetail(selectedEventoDetails);
      setIndicatorState(false);
      console.log(response.data);
    } catch (error) {
      console.log(error.response);
    }
  }
  useEffect(()=>{
    handleChargeDataEventDetail();
  },[]);
  return (
    <SafeAreaView className="flex-1 bg-[#111B21] justify-center items-center w-full">
      <StatusBar style="light"></StatusBar>
      <View className="flex-1  m-5 rounded-xl p-4 shadow-lg w-full">
        {/* <TouchableOpacity
            onPress={() => setModalDetails(false)}
            className="flex h-20 items-end"
          >
            <MaterialCommunityIcons
              name="close"
              size={30}
              color={"gray"}
            ></MaterialCommunityIcons>
          </TouchableOpacity> */}
        <View className="flex-1 h-20">
          <Text>Hola mundo</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
