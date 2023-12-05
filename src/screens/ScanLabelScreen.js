// ScanLabelScreen.js

import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Notifications from 'expo-notifications';
import NotificationModal from '../components/NotificationModal'; // Ajusta la ruta según la ubicación de tu componente modal
import ErrorNotificationModal from '../components/ErrorNotificationModal';


const API_URL = 'http://192.168.1.10:3000';

const ScanLabelScreen = ({ route, navigation }) => {
  const [scannedBarCode, setScannedBarCode] = useState(null);
  const [scannedQRCode, setScannedQRCode] = useState(null);
  const [scannedModifiedCode, setScannedModifiedCode] = useState(null); // Agregado
  const [scannedModifiedQRCode, setScannedModifiedQRCode] = useState(null); // Agregado
  const [isScanHandled, setIsScanHandled] = useState(false);
  const [barcodePrinted, setBarcodePrinted] = useState(false);
  const [qrCodePrinted, setQrCodePrinted] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [visibleArea, setVisibleArea] = useState({ width: 0, height: 0 });
  const [bolNumber, setBolNumber] = useState(null);  // Declarar el estado bolNumber
  const [selectedBoL, setSelectedBoL] = useState(null);
  const [scansNeeded, setScansNeeded] = useState(0);
  const [remainingMessage, setRemainingMessage] = useState('');
  const [totalScans, setTotalScans] = useState(scansNeeded);
  const [scansRemaining, setScansRemaining] = useState(scansNeeded);
  const [scansCount, setScansCount] = useState(scansNeeded);
  const [currentScanIndex, setCurrentScanIndex] = useState(0);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);

  useEffect(() => {
    if (route.params && route.params.bolNumber) {

      setBolNumber(route.params.bolNumber);
      setSelectedBoL(route.params.bolNumber);
      // Ejemplo: obtén la cantidad de escaneos necesarios desde la pantalla anterior
      const numberOfScans = route.params.scansNeeded || 0;  // Actualiza a 'scansNeeded'
      setTotalScans(numberOfScans);
      setScansRemaining(numberOfScans);
    }
  }, [route.params]);


  // useEffect(() => {
  //   setRemainingMessage(`Escaneos Restantes: ${scansRemaining}`);
  // }, [scansRemaining, scansNeeded]);

  useEffect(() => {
    if (scannedBarCode && scannedQRCode && !isScanHandled) {
      handleScanResult(scannedModifiedCode, scannedModifiedQRCode);
      setIsScanHandled(true);
    }
  }, [scannedBarCode, scannedQRCode, isScanHandled]);

  useEffect(() => {
    //console.log('Valor actual de scansNeeded:', scansNeeded); // Imprimir el valor actual de scansNeeded
    setRemainingMessage(`Escaneos Restantes: ${scansRemaining}`);
    navigation.setOptions({
      title: 'Escaneos',
    });
  }, [scansRemaining, scansNeeded, navigation]);


  useEffect(() => {
    const handleScanCycle = async () => {
      for (let scanIndex = currentScanIndex; scanIndex < scansNeeded; scanIndex++) {
        try {
          // Llama a la función de escaneo
          await handleBarCodeScanner(/* Proporciona el tipo y los datos del código de barras o QR */);
        } catch (error) {
          console.error(`Error en el escaneo ${scanIndex + 1}: ${error.message}`);
          showErrorNotification();
          restartScan(); // Reinicia el escaneo en caso de error
          return; // Sale de la función si hay un error
        }
      }

      // Realiza acciones adicionales después de completar todos los escaneos
      await actualizarEstadoRealizado(selectedBoL);
      showSuccessNotification(bolNumber);
      restartScan(); // Reiniciar el escaneo

      // Actualiza el índice de escaneo actual
      setCurrentScanIndex(0);
    };

    // Verifica si es necesario iniciar el ciclo de escaneos
    if (currentScanIndex > 0) {
      handleScanCycle();
    }
  }, [currentScanIndex]);

  const showNotification = () => {
    setNotificationVisible(true);

    // Ocultar la notificación después de 2 segundos
    setTimeout(() => {
      setNotificationVisible(false);
      // Restaurar el mensaje por defecto si es necesario
      setNotificationMessage('');
      navigation.navigate('BoLScreen', {
        isUpdated: true,
      });
    }, 3000);
  };

  const showErrorNotification = () => {
    setErrorModalVisible(true);
    setTimeout(() => {
      setNotificationVisible(false);
    }, 2000);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (!isScanHandled) {
      if (type === BarCodeScanner.Constants.BarCodeType.code39 && !scannedBarCode && !barcodePrinted) {
        console.log(`Tipo de código: ${type}, Datos: ${data}`)

        // Verifica si el código tiene la letra 'P' al inicio
        if (!data.startsWith('P')) {
          console.log('Error: El código de barras no tiene la letra "P" al inicio. Reiniciando el escaneo...');
          //showErrorNotification();
          restartScan();
          return;
        }
        // Almacena el código de barras completo
        setScannedBarCode(data);

        // Elimina la primera letra 'P' y almacena el código modificado
        const modifiedCode = data.substring(1);
        // Almacenar el código modificado en el estado
        setScannedModifiedCode((prevModifiedCode) => {
          console.log('Código de barras sin P:', modifiedCode);
          return modifiedCode;
        });
        // Obtener el Part_Number correspondiente al BoL desde la base de datos
        const partNumberFromDatabase = await obtenerPartNumber(selectedBoL, data);

        if (partNumberFromDatabase !== null) {
          // Verificar si el Part_Number coincide con el código de barras escaneado
          if (partNumberFromDatabase !== modifiedCode) {
            console.log('Error de validación. El Part_Number no coincide con el código de barras escaneado.');
            showErrorNotification();
            restartScan();
            return;
          }
        } else {
          console.error('Error al obtener el Part_Number desde la base de datos.');
          showErrorNotification();
          restartScan();
          return;
        }
        setBarcodePrinted(true);
        setIsScanning(false);
      } else if (type === BarCodeScanner.Constants.BarCodeType.qr && !scannedQRCode && !qrCodePrinted) {
        console.log(`Tipo de código: ${type}, Datos: ${data}`);

        setScannedQRCode(data);
        // Almacena solo el segundo campo del código QR
        const qrCodeFields = data.split('|');
        const secondField = qrCodeFields[1].trim();
        setScannedModifiedQRCode((prevModifiedQRCode) => {
          console.log('Codigo QR 2do Valor:', secondField);
          return secondField;
        });
        // Obtener el Part_Number correspondiente al BoL desde la base de datos
        const partNumberFromDatabase = await obtenerPartNumber(selectedBoL, data);

        if (partNumberFromDatabase !== null) {
          // Verificar si el Part_Number coincide con el código QR escaneado
          if (partNumberFromDatabase !== secondField) {
            console.log('Error de validación. El Part_Number no coincide con el código QR escaneado.');
            showErrorNotification();
            restartScan();
            return;
          }
        } else {
          console.error('Error al obtener el Part_Number desde la base de datos.');
          showErrorNotification();
          restartScan();
          return;
        }
        setQrCodePrinted(true);
        setIsScanning(false);
      }
    }
  };

  const obtenerPartNumber = async (bolNumber) => {
    try {
      const response = await axios.get(`${API_URL}/obtenerPartNumber/${bolNumber}`);
      console.log('Respuesta del servidor al obtenerPartNumber:', response.data);

      if (response.data.partNumber) {
        return response.data.partNumber;
      } else {
        console.error('Part_Number no encontrado en la respuesta del servidor.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el Part_Number desde la base de datos:', error);

      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
      }

      return null;
    }
  };

  const actualizarEstadoRealizado = async (bolNumber) => {
    try {
      const response = await axios.post(`${API_URL}/actualizar`, {
        BoL1: selectedBoL,
        Escaner_Estatus: 'Realizado',
      });

    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  const handleScanResult = async (modifiedCode, secondField) => {
    if (modifiedCode !== null && secondField !== null) {
      if (modifiedCode === secondField) {
        setScansCount((prevCount) => {
          const newCount = prevCount + 1;
          const scansRemaining = Math.max(0, totalScans - newCount);

          console.log(`Escaneo exitoso. Escaneos restantes: ${scansRemaining}`);

          if (newCount >= totalScans) {
            console.log('Todos los escaneos completados. Realizar acciones adicionales...');

            showNotification(`El BoL: ${bolNumber} ha sido escaneado con éxito`); // ¡Añadido!
            setCurrentScanIndex(currentScanIndex + 1);

          } else {
            setScansRemaining(scansRemaining);
          }
          return newCount;
        });

        // Reinicia el escaneo para el siguiente
        restartScan();
      } else {
        // Mostrar notificación de error y otros pasos necesarios...
        console.log('Error de validación. Los códigos no coinciden.');
        showErrorNotification();
        restartScan();
      }
    } else {
      // Mostrar algún tipo de mensaje o manejar el caso en el que uno de los campos es null
      console.log('Error: Uno de los campos es null.');
      restartScan(); // Reiniciar el escaneo en caso de campos nulos
    }
  };

  //restartScan se encarga de realizar el reseteo de todo para poder volver a hacer un escaneo
  const restartScan = () => {
    setIsScanHandled(false);
    setScannedBarCode(null);
    setBarcodePrinted(false);
    setScannedQRCode(null);
    setQrCodePrinted(false);
    setScannedModifiedCode(null);
    setScannedModifiedQRCode(null);
    setIsScanning(true);
  };

  const startScanning = () => {
    restartScan();
  };

  // Muestra notificación de que resulto correcto el escaneo
  let notificationShown = false;

  const showSuccessNotification = async () => {
    const channelId = 'success-channel';

    // Configurar el canal de notificación
    await Notifications.setNotificationChannelAsync(channelId, {
      name: 'Success Channel',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250], // Patrón de vibración opcional
      lightColor: '#00ff00', // Color del LED opcional
    });

    const notificationContent = {
      title: 'Escaneo Exitoso',
      body: `El BoL: ${bolNumber} ha sido escaneado con éxito`,
      ios: {
        sound: true,
      },
      android: {
        channelId: channelId,
        color: '#00ff00',
        icon: 'check-circle',
        priority: Notifications.AndroidImportance.MAX,
        vibrate: true,
        data: {
          bolNumber,
        },
      },
    };

    await Notifications.scheduleNotificationAsync({
      content: notificationContent,
      trigger: null,
    });
  };


  const fadeAnim = new Animated.Value(0);
  useEffect(() => {
    // Función para iniciar la animación de parpadeo
    const startBlinking = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        { iterations: Infinity }
      ).start();
    };

    // Iniciar la animación cuando el componente se monta
    startBlinking();

    // Limpieza de la animación al desmontar el componente
    return () => {
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={styles.barCodeScanner}
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13, BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onLayout={(event) => {
          // Obtener dimensiones del área visible
          const { width, height } = event.nativeEvent.layout;
          setVisibleArea({ width, height });
        }}
      />
      {/* Otros componentes visuales para referencia */}
      <View style={styles.referenceContainer}>
        <View style={styles.referenceBorder} />
      </View>
      {/* Esquinas del área de escaneo */}
      <View style={styles.scanCorner} />
      <View style={[styles.scanCorner, { transform: [{ rotate: '90deg' }] }]} />
      <View style={[styles.scanCorner, { transform: [{ rotate: '180deg' }] }]} />
      <View style={[styles.scanCorner, { transform: [{ rotate: '270deg' }] }]} />

      <View style={styles.overlay}>
        {/* Indicador de escaneo si el escaneo está en progreso */}
        {isScanning && (
          <Animated.View style={[styles.scanIndicator, { opacity: fadeAnim }]}>
            <Text style={styles.scanIndicatorText}>Escaneando...</Text>
          </Animated.View>
        )}
        {/* Mostrar el contador de escaneos restantes */}
        {scansRemaining >= 0 && (
          <View style={styles.scanRemaining}>
            <Text style={styles.scanRemainingText}>{remainingMessage}</Text>
          </View>
        )}
        {/* Botón para reiniciar el escaneo */}
        <TouchableOpacity style={styles.scanButton} onPress={restartScan}>
          <Icon name="qrcode-scan" size={32} color="#ffffff" style={styles.scanButtonIcon} />
        </TouchableOpacity>
      </View>
      {/* Modal de error */}
      <ErrorNotificationModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        bolNumber={selectedBoL}  // Puedes ajustar esto según tu implementación
      />
      {/* Componente modal */}
      <NotificationModal
        visible={notificationVisible}
        closeModal={() => setNotificationVisible(false)}
        message={notificationMessage}
        bolNumber={selectedBoL}
      />
      {/* Resultados del escaneo */}
      {(scannedBarCode || scannedQRCode) && (
        <View style={styles.scanResult}>
          <Text style={styles.scanResultText}>Código de barras: {scannedModifiedCode}</Text>
          <Text style={styles.scanResultText}>Código QR: {scannedModifiedQRCode}</Text>
          {/* Mostrar el número de BoL#1 */}
          <Text style={styles.scanResultText}>BoL#1: {bolNumber}</Text>
        </View>
      )}
    </View>
  );
};
//Todo esto son estilos usados para ScanLabel
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanAnimation: {
    marginTop: 20,
    alignItems: 'center',
  },
  scanAnimationText: {
    fontSize: 16,
    color: 'white',
  },
  scanRemaining: {
    position: 'absolute',
    bottom: 150,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
  },
  scanRemainingText: {
    color: 'white',
    fontSize: 16,
  },
  overlay: {
    position: 'absolute',
    top: 110,
    left: 20,
    right: 20,
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
    borderRadius: 15,
  },
  overlayText: {
    fontSize: 18,
    color: 'white',
  },
  scanButton: {
    position: 'absolute',
    bottom: 10,
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 165, 0, 1)',
    borderRadius: 5,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
  },
  scanResult: {
    position: 'absolute',
    top: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  scanResultText: {
    color: 'white',
    fontSize: 16,
  },
  scanCorner: {
    position: 'absolute',
    width: 20, // Ajusta según el tamaño deseado
    height: 2, // Ajusta según el tamaño deseado
    backgroundColor: 'white',
  },
  scanIndicator: {
    position: 'absolute',
    bottom: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIndicatorText: {
    fontSize: 20,
    color: 'white',
    position: 'absolute',
    top: '80%',
  },
  scanRemaining: {
    position: 'absolute',
    bottom: 120, // Ajusta la posición según sea necesario
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    borderRadius: 5,
  },
  scanRemainingText: {
    color: 'white',
    fontSize: 16,
  },
  referenceContainer: {
    position: 'absolute',
    top: '50%', // Centra verticalmente
    left: '50%', // Centra horizontalmente
    width: 200,
    height: 200,
    marginLeft: -100, // Ajusta el margen izquierdo para centrar horizontalmente
    marginTop: -100, // Ajusta el margen superior para centrar verticalmente
  },
  referenceBorder: {
    flex: 1,
    borderColor: 'white', // Color del borde de referencia
    borderWidth: 2, // Ancho del borde de referencia
    borderRadius: 5,
  },
  barCodeScanner: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    margin: 5,
  },
  notificationModal: {
    position: 'absolute',
    top: '50%', // Ajusta la posición vertical según sea necesario
    left: '50%', // Ajusta la posición horizontal según sea necesario
    backgroundColor: 'green', // Color de fondo del modal
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    zIndex: 999, // Ajusta según sea necesario para superponer el modal sobre otros elementos
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ScanLabelScreen;