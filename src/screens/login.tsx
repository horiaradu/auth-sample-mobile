import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import LoginButton from '../components/hosted-login-button';
import { useNavigation } from '@react-navigation/native';
import { MainStackParams } from '../routers/main-stack-navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Credentials } from 'react-native-auth0';

export default function Login() {
  const theme = useTheme();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const onSuccess = (credentials: Credentials) => {
    navigate('Home', { accessToken: credentials.accessToken });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <LoginButton onSuccess={onSuccess} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});
