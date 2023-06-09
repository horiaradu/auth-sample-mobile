import React, { useState } from 'react';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainStackParams } from '../routers/main-stack-navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth0 from '../services/auth0';
import { AUTH0_AUDIENCE, AUTH0_REALM } from '@env';
import { SaveCredentialsParams } from 'react-native-auth0';

export default function Login() {
  const theme = useTheme();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const credentials = await auth0.auth.passwordRealm({
        username,
        password,
        realm: AUTH0_REALM,
        scope: 'openid profile email offline_access',
        audience: AUTH0_AUDIENCE,
      });

      console.log('successful login', credentials);
      await auth0.credentialsManager.saveCredentials(
        credentials as SaveCredentialsParams,
      );

      navigate('Home');
    } catch (e) {
      const error = e as any;
      if (error.name === 'mfa_required') {
        navigate('MFA', { mfaToken: error.json.mfa_token });
      } else {
        console.error(JSON.stringify(e));
      }
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <TextInput label="Email" value={username} onChangeText={setUsername} />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button mode="contained" onPress={login}>
        Login
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    gap: 10,
  },
});
