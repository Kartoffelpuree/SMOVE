import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Switch } from 'react-native';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const ConfScreen = () => {
  const [isDarkMode, setDarkMode] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // useEffect(() => {
  //   const loadFont = async () => {
  //     await Font.loadAsync({
  //       Caveat: require('../fonts/Caveat-Regular.ttf'),
  //       CaveatDark: require('../fonts/Caveat-Regular.ttf'),
  //     });

  //     // Intenta cargar la fuente de MaterialCommunityIcons
  //     try {
  //       await MaterialCommunityIcons.loadFont();
  //     } catch (error) {
  //       console.error('Error al cargar la fuente MaterialCommunityIcons:', error);
  //     }
  //     setFontLoaded(true);
  //   };

  //   loadFont();
  // }, []);

  // if (!fontLoaded) {
  //   return null;
  // }

  return (
    <View style={[styles.container, isDarkMode && styles.darkModeContainer]}>
      <Image source={require('../images/asclog.png')} style={styles.image} />
      <Text style={[styles.mainText, isDarkMode && styles.darkModeText]}>ToDos AID</Text>
      <View style={[styles.divider, isDarkMode && styles.darkModeDivider]} />
      <View style={styles.bottomContainer}>
        <Text style={[styles.btmText, isDarkMode && styles.darkModebtmText]}>Ver.Alpha 1.0</Text>
        <Text style={[styles.bottomText, isDarkMode && styles.darkModeText]}>Help & QA</Text>
        <Text style={[styles.bottomText, isDarkMode && styles.darkModeText]}>Contact Us</Text>
        <View style={styles.switchContainer}>
          <Text style={[styles.switchText, isDarkMode && styles.darkModeText]}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </View>
      <View style={styles.btmContainer}>
        <View style={[styles.dividerbtm, isDarkMode && styles.darkModeDivider]} />
        <Text style={[styles.allrigthsText, isDarkMode && styles.darkModeText]}>
          All Rigth Reserved by kartoffel und brokkoli pure®
        </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  mainText: {
    fontSize: 35,
    marginVertical: 10,
    color: '#7DD076',
    // fontFamily: 'Caveat',
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#599354', // Color de la línea divisoria
    marginVertical: 10,
  },
  dividerbtm: {
    height: 1,
    width: '90%',
    backgroundColor: '#599354', // Color de la línea divisoria
    marginVertical: 10,
  },
  bottomContainer: {
    width: '80%',
    alignItems: 'center',
    marginTop: 80,
  },
  btmContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  btmText: {
    fontSize: 25,
    marginVertical: 5,
    color: '#599354',
    // fontFamily: 'Caveat',
  },
  bottomText: {
    fontSize: 25,
    marginVertical: 10,
    color: '#7DD076',
    // fontFamily: 'Caveat',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  allrigthsText: {
    fontSize: 20,
    // fontFamily: 'Caveat',
    color: '#7DD076',
  },
  switchText: {
    fontSize: 25,
    marginRight: 10,
    // fontFamily: 'Caveat',
    color: '#7DD076',
  },
  darkModeContainer: {
    backgroundColor: '#333', // Cambiamos el color de fondo para el modo oscuro
  },
  darkModeText: {
    color: '#7DD076', // Cambiamos el color del texto para el modo oscuro
  },
  darkModeDivider: {
    backgroundColor: '#599354', // Cambiamos el color de la línea divisoria para el modo oscuro
  },
  darkModebtmText: {
    color: '#599354',
  },
});

export default ConfScreen;
