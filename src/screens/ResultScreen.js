import React from 'react';
import { View, Text, Image } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #fff;
`;

const ResultText = styled.Text`
  font-size: 22px;
  margin-top: 20px;
  text-align: center;
`;

const ResultImage = styled.Image`
  width: 200px;
  height: 200px;
  margin-top: 20px;
  border-radius: 10px;
`;

const ResultScreen = ({ route }) => {
  const { scannedData } = route.params;

  return (
    <Container>
      <ResultText>Resultado del Escaneo:</ResultText>
      <ResultImage source={{ uri: scannedData }} />
      <ResultText>Información Adicional Aquí</ResultText>
      {/* Agrega más texto o componentes según sea necesario */}
    </Container>
  );
};

export default ResultScreen;
