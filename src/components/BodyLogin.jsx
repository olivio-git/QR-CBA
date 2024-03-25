import React from 'react'
import { StyleSheet } from 'react-native';

export const BodyLogin = () => {
  return (
    <View style={styles.body}>
      <Text>Hola</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 12,
    backgroundColor: "yellow",
  },
});