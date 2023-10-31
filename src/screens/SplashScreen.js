import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Image } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #3498db;
`;

const Logo = styled.Image`
  width: 90px;
  height: 50px;
  margin-bottom: 20px;
`;

const LoadingText = styled.Text`
  color: white;
  font-size: 18px;
`;

const SplashScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula una carga durante 2 segundos
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Navegar a la pantalla principal después de cargar
      navigation.replace('BoLScreen');
    }, 2000); //Tiempo de carga

    // Limpia el temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <Container>
      <Logo source={require('../images/asclog.png')} />
      <ActivityIndicator size="large" color="white" />
      <LoadingText>Cargando...</LoadingText>
    </Container>
  );
};

export default SplashScreen;
