import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Image, StyleSheet } from 'react-native';
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

const CustomSplashScreen = ({ navigation }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const simulateLoading = async () => {
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsLoaded(true);
    navigation.replace('BoLScreen');
  };

  useEffect(() => {
    simulateLoading();
  }, [navigation]);

  return (
    <Container>
      <Image
        style={{ flex: 1, alignSelf: 'stretch', width: undefined, height: undefined, resizeMode: 'contain' }}
        source={require('../images/ascload.gif')}
      />
      {!isLoaded && (
        <ActivityIndicator size="large" color="white" />
      )}
    </Container>
  );
};

export default CustomSplashScreen;