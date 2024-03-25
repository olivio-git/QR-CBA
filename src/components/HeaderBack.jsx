import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import IconBack from "../../assets/Back.png";

export const HeaderBack = () => {
  return (
    <View style={styles.header}>
      <TouchableOpacity>
        <Image source={IconBack} style={styles.backArrow}></Image>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    backgroundColor: "#FFFF",
    alignContent: "center",
    justifyContent: "center",
    // marginTop:Constants.statusBarHeight //Para evitar usar SafeAreaView al separar la barra
  },
  backArrow:{
    width:20,
    height:20
  }
});
