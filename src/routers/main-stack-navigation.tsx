import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/login';
import Home from '../screens/home';
import MFA from '../screens/mfa';

export type MainStackParams = {
  Login: undefined;
  Home: undefined;
  MFA: { mfaToken: string };
};

const Stack = createNativeStackNavigator<MainStackParams>();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{ headerBackVisible: false }}>
      <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen name={'Home'} component={Home} />
      <Stack.Screen name={'MFA'} component={MFA} />
    </Stack.Navigator>
  );
}
