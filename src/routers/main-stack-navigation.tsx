import React, { useEffect } from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import Login from '../screens/login';
import Home from '../screens/home';
import { useAuth0 } from 'react-native-auth0';
import { useNavigation } from '@react-navigation/native';

export type MainStackParams = {
  Login: undefined;
  Home: { accessToken: string };
};

const Stack = createNativeStackNavigator<MainStackParams>();

export default function MainStackNavigator() {
  const { user, getCredentials } = useAuth0();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  useEffect(() => {
    console.log('user', user);
    user
      ? getCredentials().then((credentials) =>
          navigate('Home', { accessToken: credentials.accessToken }),
        )
      : navigate('Login');
  }, [getCredentials, navigate, user]);

  return (
    <Stack.Navigator
      initialRouteName={user ? 'Home' : 'Login'}
      screenOptions={{ headerBackVisible: false }}>
      <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen name={'Home'} component={Home} />
    </Stack.Navigator>
  );
}
