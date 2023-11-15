import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #FFFFFF;
`;

const LoadingText = styled.Text`
  color: white;
  font-size: 18px;
`;

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const simulateLoading = async () => {
      // Simula una carga durante 3 segundos
      await new Promise(resolve => setTimeout(resolve, 3000));

      setIsLoading(false);

      // Navegar a la pantalla principal después de cargar
      navigation.replace('BoLScreen');
    };

    simulateLoading();
  }, [navigation]);

  return (
    <Container>
      <Video
        source={require('../videos/ascload.mp4')}
        style={{ flex: 1, alignSelf: 'stretch', width: undefined, height: undefined }}
        resizeMode="contain"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(status) => {
          // No necesitas cambiar de pantalla aquí, lo haremos después de la simulación de carga
          if (!status.isPlaying) {
            simulateLoading(); // Puedes llamar a simulateLoading directamente al final del video
          }
        }}
      />
    </Container>
  );
};

export default SplashScreen;
