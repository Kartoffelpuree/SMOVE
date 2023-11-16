import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import ScanLabelScreen from '../screens/ScanLabelScreen';
import BoLScreen from '../screens/BoLScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SideMenu from '../components/SideMenu';
import SplashScreen from '../screens/SplashScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator
    initialRouteName="CustomSplashScreen"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#FFA500', // Naranja
      },
      headerTintColor: '#333', // Gris oscuro
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
  >
    <Stack.Screen name="BoLScreen" component={BoLScreen} options={{ title: 'BoL Selector' }} />
    <Stack.Screen name="CustomSplashScreen" component={SplashScreen} />
    <Stack.Screen name="ScanLabel" component={ScanLabelScreen} />
    <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
    {/* Agrega más pantallas según sea necesario */}
  </Stack.Navigator>
);

// const MainStackNavigator = () => (
//     <Drawer.Navigator initialRouteName="MainStack" drawerContent={(props) => <SideMenu {...props} />}>
//       <Drawer.Screen name="BoLScreen" component={BoLScreen} options={{ title: 'BoL Selector' }} />
//       <Drawer.Screen name="SettingsScreen" component={SettingsScreen} options={{ title: 'Settings' }} />
//       <Drawer.Screen name="ScanLabel" component={ScanLabelScreen} options={{ title: 'BoL Selector' }} />
//       <Drawer.Screen name="MainStack" component={MainStackNavigator} />
//     </Drawer.Navigator>
 

// );

export default AppNavigator;
