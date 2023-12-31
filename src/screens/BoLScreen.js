// BoLScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
//import DropDownPicker from 'react-native-dropdown-picker';

const API_URL = 'http://192.168.1.10:3000';

const BoLScreen = () => {
  const [selectedBoL, setSelectedBoL] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [availableBoLs, setAvailableBoLs] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [scansForSelectedBoL, setScansForSelectedBoL] = useState(0);
  const [scansCount, setScansCount] = useState(0);
  const [scansRemaining, setScansRemaining] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('focus', () => {
      // Refrescar los componentes de la fecha y BoL
      fetchData(date.toISOString().split('T')[0]);
      // Resetear la fecha del datapicker
      setDate(new Date());
    });
  }, [navigation]);

  const handleNavigateToScanLabelScreen = () => {
    // Navegar a la pantalla ScanLabelScreen
    navigation.navigate('ScanLabel');
  };

  const handleEscanearPress = () => {
    // Verificar que se ha seleccionado un BoL#1 antes de navegar
    if (selectedBoL) {
      console.log(`Contador enviado a ScanLabelScreen: ${scansForSelectedBoL}`);
      // Navegar a ScanLabelScreen y pasar el número de BoL#1 como parámetro
      navigation.navigate('ScanLabel', { bolNumber: selectedBoL, scansNeeded: scansForSelectedBoL });
    } else {
      // Mostrar un mensaje o realizar alguna acción si no se ha seleccionado BoL#1
      console.warn('Por favor, selecciona un BoL#1 antes de escanear.');
    }
  };

  const fetchData = async (fechaSeleccionada) => {
    try {
      // Obtener BoL#1 y sus respectivos recuentos
      const response = await axios.get(`${API_URL}/consulta/${fechaSeleccionada}`);
      const boL1Counts = {};

      if (response && response.data) {
        response.data.forEach((item) => {
          const boL1 = item['BoL#1'];
          const escanerEstatus = item['Escaner_Estatus']; // Agregado para obtener el estado del escáner
          boL1Counts[boL1] = { count: (boL1Counts[boL1]?.count || 0) + 1, Escaner_Estatus: escanerEstatus };
        });

        // Actualizar el estado de availableBoLs con la información de recuentos y estado del escáner
        const uniqueBoLs = Object.keys(boL1Counts);
        const boLsWithCounts = uniqueBoLs.map((boL) => ({
          boL,
          count: boL1Counts[boL].count,
          Escaner_Estatus: boL1Counts[boL].Escaner_Estatus,
        }));
        setAvailableBoLs(boLsWithCounts);

        // Calcular el total de escaneos
        const total = Object.values(boL1Counts).reduce((acc, count) => acc + count.count, 0);
        setTotalScans(total);
      }
    } catch (error) {
      console.error('Error al obtener BoL#1:', error.message);
    }
  };

  const fetchScansForSelectedBoL = (selectedBoL) => {
    // Obtener la cantidad de escaneos para el BoL seleccionado
    const selectedBoLData = availableBoLs.find((boL) => boL.boL === selectedBoL);
    console.log('selectedBoLData:', selectedBoLData); // Agregado para depuración
    const scansCount = selectedBoLData ? selectedBoLData.count : 0;
    setScansForSelectedBoL(scansCount);
  };

  const filteredBoLs = availableBoLs.filter((boL) => boL.Escaner_Estatus !== 'Realizado');
  console.log('filteredBoLs:', filteredBoLs); // Agregado para depuración

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleBoLChange = (itemValue, itemIndex) => {
    setSelectedBoL(itemValue);
    toggleModal();

    // Consultar la cantidad de escaneos para el BoL seleccionado
    fetchScansForSelectedBoL(itemValue);
  };

  useEffect(() => {
    fetchData(date.toISOString().split('T')[0]);
  }, [date]);

  const handleDatePickerConfirm = (fechaSeleccionada) => {
    setDatePickerVisible(false);

    if (fechaSeleccionada) {
      const newDate = new Date(fechaSeleccionada);
      setDate(newDate);
      fetchData(newDate.toISOString().split('T')[0]);
    }
  };

  const handleDateChange = () => {
    setDatePickerVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Fila 1 */}
      <View style={styles.row}>
        <View style={styles.cell}>
          <Text style={styles.label}>BoL:</Text>
          {/* <DropDownPicker
            items={filteredBoLs.map((boL, index) => ({
              label: boL.boL,
              value: boL.boL,
              key: index,
            }))}
            placeholder="Seleccione BoL"
            containerStyle={{ height: 40 }}
            onChangeItem={item => handleBoLChange(item.value)}
            value={selectedBoL}
            zIndex={5000}
            maxHeight={150}
          /> */}
          <RNPickerSelect
            placeholder={{ label: 'Seleccione BoL', value: null }}
            onValueChange={handleBoLChange}
            items={filteredBoLs.map((boL, index) => ({
              label: boL.boL,
              value: boL.boL,
              key: index,
            }))}
            style={pickerSelectStyles}
            value={selectedBoL}
            listHeight={150}
            
          />

        </View>
        <View style={styles.cell}>
          <Text style={styles.label}>Fecha:</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleDateChange}
          >
            <Text style={styles.buttonText}>{date.toISOString().split('T')[0]}</Text>
          </TouchableOpacity>
          {/* Selector de fecha modal */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDatePickerConfirm}
            onCancel={() => setDatePickerVisible(false)}
            format="MM-DD-YYYY"
          />
        </View>
      </View>
      {/* Fila 3 */}
      <View style={styles.row2}>
        <Text style={styles.footerText}>{`Escaneos para ${selectedBoL || 'seleccione BoL'}: ${scansForSelectedBoL}`}</Text>
      </View>
      {/* Fila 4 */}
      <View style={styles.row2}>
        {/* Botón para escanear */}
        <TouchableOpacity style={styles.button2} onPress={handleEscanearPress}>
          <Text style={styles.buttonText}>Escanear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
  },
  placeholder: {
    color: 'gray',
  },
  listContainer: {
    flex: 1,
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 10,
    marginRight: 10,
    padding: 20,
    backgroundColor: '#FEAD00',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  row2: {
    alignItems: 'center',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    marginRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },

  button: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  button2: {
    marginTop: 5,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default BoLScreen;
