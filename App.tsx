/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';

import { Auth0Provider } from 'react-native-auth0';
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from '@env';

import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/routers/main-stack-navigation';

function App(): JSX.Element {
  // const theme = useTheme();

  return (
    <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
      <NavigationContainer>
        <MainStackNavigator />
        {/* <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}>
          <StatusBar
            barStyle={theme.dark ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.background}
          />
          <Profile />
          <HostedLoginButton
            onSuccess={async (credentials) => {
              await Keychain.setGenericPassword(
                'authsample-username',
                JSON.stringify(credentials),
                {
                  accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
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
              });
              if (!result) {
                console.log('No credentials stored');
                return;
              }

              const accessToken = JSON.parse(result.password).accessToken;

              console.log(API_URL);
              const response = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              console.log(response.data);
            }}>
            Log token
          </Button>
        </SafeAreaView> */}
      </NavigationContainer>
    </Auth0Provider>
  );
}

export default App;
