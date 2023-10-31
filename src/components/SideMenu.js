// SideMenu.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SideMenu = ({ navigation }) => {
  const navigateToScreen = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainText}>ToDos AID</Text>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('BoLScreen')}>
        <Text>BoL Selector</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigateToScreen('SettingsScreen')}>
        <Text>Settings</Text>
      </TouchableOpacity>
      {/* Agrega más elementos de menú según tus necesidades */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  mainText: {
    fontSize: 35,
    marginVertical: 10,
    color: '#7DD076',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default SideMenu;
