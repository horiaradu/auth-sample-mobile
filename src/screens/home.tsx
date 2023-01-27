import React, { useState } from 'react';
import { useAuth0 } from 'react-native-auth0';
import { Avatar, Button, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import LogoutButton from '../components/logout-button';
import { MainStackParams } from '../routers/main-stack-navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '@env';
import Toast from 'react-native-toast-message';

export default function Home() {
  const theme = useTheme();
  const { user, getCredentials, clearSession } = useAuth0();
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const route = useRoute<RouteProp<MainStackParams, 'Home'>>();
  const [accessToken, setAccessToken] = useState(route.params.accessToken);

  const callApi = async () => {
    try {
      const response = await axios.get<string>(API_URL, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      Toast.show({
        type: 'success',
        text1: 'API call success',
        text2: response.data,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'API call error',
        text2: (error as any).message,
      });
    }
  };

  const getNewCredentials = async ({ retry = true } = {}) => {
    try {
      const credentials = await getCredentials();
      if (credentials) {
        Toast.show({
          type: 'success',
          text1: 'Get new credentials success',
          text2: credentials.accessToken,
        });
        setAccessToken(credentials.accessToken);
      } else {
        onTokenExpired({ retry });
      }
    } catch (error) {
      console.error(error);
      onTokenExpired({ retry });
    }
  };

  const onTokenExpired = async ({ retry = true }) => {
    Toast.show({
      type: 'error',
      text1: 'Get new credentials error',
      text2: 'No new token',
    });

    if (retry) {
      await getNewCredentials({ retry: false });
    } else {
      // This forces the user to login again when retrying to get new credentials.
      // This is required if only 2FA is enabled, since anyone can paste the authenticateor token / SMS.
      // If biometrics (via Auth0) is enabled, this is not required, since only the user's face works.

      // TODO test this and put this behind an if: biometrics enabled or something
      // TODO next step: secure storage manually for token with biometrics
      await clearSession();
      navigate('Login');
    }
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

          <Text variant="bodyMedium">Access token: {accessToken}</Text>

          <Button mode="contained" onPress={callApi}>
            Call API
          </Button>

          <Button mode="contained" onPress={() => getNewCredentials()}>
            Get new credentials
          </Button>

          <LogoutButton onSuccess={() => navigate('Login')} />
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
