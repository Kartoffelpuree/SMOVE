import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const ErrorNotificationModal = ({ visible, onClose, bolNumber }) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const navigation = useNavigation();

  useEffect(() => {
    setModalVisible(visible);

    // Cerrar la notificación después de 3 segundos
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
        <View style={styles.errorNotificationContainer}>
          <Icon name="alert-circle" size={32} color="#ff0000" style={styles.icon} />
          <Text style={styles.errorNotificationText}>Error: Verifica el Lot No. o el Part Number del BoL: {bolNumber}</Text>
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
  errorNotificationContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 10,
  },
  errorNotificationText: {
    fontSize: 18,
    color: '#ff0000',
  },
});

export default ErrorNotificationModal;
