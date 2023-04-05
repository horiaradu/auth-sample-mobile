import React, { useState } from 'react';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainStackParams } from '../routers/main-stack-navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import auth0 from '../services/auth0';
import { SaveCredentialsParams } from 'react-native-auth0';

export default function MFA() {
  const theme = useTheme();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const route = useRoute<RouteProp<MainStackParams, 'MFA'>>();
  const { mfaToken } = route.params;

  const [code, setCode] = useState('');

  const login = async () => {
    try {
      const credentials = await auth0.auth.loginWithOTP({
        mfaToken,
        otp: code,
      });

      console.log('successful login', credentials);
      await auth0.credentialsManager.saveCredentials(
        credentials as SaveCredentialsParams,
      );

      navigate('Home');
    } catch (e) {
      console.error(JSON.stringify(e));
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />

      <TextInput
        label="Code"
        value={code}
        onChangeText={setCode}
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
