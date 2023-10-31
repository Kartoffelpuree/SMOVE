import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation

const NotificationModal = ({ visible, onClose, bolNumber }) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const navigation = useNavigation(); // Obtén el objeto de navegación

  useEffect(() => {
    setModalVisible(visible);
  
    // Cerrar la notificación después de 2 segundos
    const timeout = setTimeout(() => {
      setModalVisible(false);
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    }, 3000);
  
    return () => clearTimeout(timeout);
  }, [visible, onClose]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        onClose();
      }}
    >
      <View style={styles.modalContainer}>
        <View style={styles.notificationContainer}>
          <Icon name="check-circle" size={32} color="#00ff00" style={styles.icon} />
          <Text style={styles.notificationText}>El BoL: {bolNumber} ha sido escaneado con éxito</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 18,
    color: '#333',
  },
});

export default NotificationModal;
