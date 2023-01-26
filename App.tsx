/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import axios from 'axios';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

import { useAuth0, Auth0Provider, Credentials } from 'react-native-auth0';
import { AUTH0_AUDIENCE, AUTH0_DOMAIN, AUTH0_CLIENT_ID, API_URL } from '@env';

import * as Keychain from 'react-native-keychain';

import { Button, Text, useTheme } from 'react-native-paper';

function LoginButton({
  onComplete,
}: {
  onComplete: (credentials: Credentials) => void | Promise<void>;
}) {
  const { authorize, getCredentials } = useAuth0();

  const onPress = async () => {
    try {
      await authorize({
        scope: 'openid profile email offline_access',
        audience: AUTH0_AUDIENCE,
      });
      const credentials = await getCredentials();

      console.log(credentials);
      await onComplete(credentials);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button mode="contained" onPress={onPress}>
      Log in
    </Button>
  );
}

function LogoutButton({
  onComplete,
}: {
  onComplete: () => void | Promise<void>;
}) {
  const { clearSession } = useAuth0();

  const onPress = async () => {
    try {
      await clearSession();
      await onComplete();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button mode="contained" onPress={onPress}>
      Log out
    </Button>
  );
}

function Profile() {
  const { user } = useAuth0();

  return (
    <>
      {user && (
        <Text variant="titleLarge">Logged in as {JSON.stringify(user)}</Text>
      )}
      {!user && <Text variant="titleLarge">Not logged in</Text>}
    </>
  );
}

function App(): JSX.Element {
  const theme = useTheme();

  const backgroundStyle = { backgroundColor: theme.colors.background };

  return (
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={theme.dark ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}>
          <Profile />
          <LoginButton
            onComplete={async (credentials) => {
              await Keychain.setGenericPassword(
                'authsample-username',
                JSON.stringify(credentials),
                {
                  accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
                  accessible:
                    Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                  authenticationType:
                    Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
                },
              );
            }}
          />
          <LogoutButton
            onComplete={async () => {
              await Keychain.resetGenericPassword();
            }}
          />

          <Button
            mode="contained"
            onPress={async () => {
              const result = await Keychain.getGenericPassword({
                accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
                accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
                authenticationType:
                  Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
              });
              if (!result) {
                console.log('No credentials stored');
                return;
              }

              const accessToken = JSON.parse(result.password).accessToken;

              axios.get(API_URL, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
            }}>
            Log token
          </Button>
        </View>
      </SafeAreaView>
    </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
});

export default App;
