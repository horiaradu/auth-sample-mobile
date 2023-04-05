import React from 'react';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { MainStackParams } from '../routers/main-stack-navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import auth0 from '../services/auth0';
import useCredentials from '../hooks/use-credentials';
import { call } from '../services/api';

export default function Home() {
  const theme = useTheme();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const { user } = useCredentials();

  const callApi = async () => {
    try {
      const data = await call();
      Toast.show({
        type: 'success',
        text1: 'API call success',
        text2: data,
      });
    } catch (error) {
      console.error(JSON.stringify(error));

      Toast.show({
        type: 'error',
        text1: 'API call error',
        text2: (error as any).message,
      });

      logout();
    }
  };

  const logout = async () => {
    await auth0.credentialsManager.clearCredentials();
    navigate('Login');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      {user && (
        <>
          <Avatar.Image size={48} source={{ uri: user.picture }} />
          <Text variant="titleLarge">Hi {user.nickname}</Text>

          <Button mode="contained" onPress={callApi}>
            Call API
          </Button>

          <Button onPress={logout}>Log out</Button>
        </>
      )}
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
