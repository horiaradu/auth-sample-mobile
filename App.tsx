/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, { useState } from 'react';
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { useAuth0, Auth0Provider } from 'react-native-auth0';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

function LoginButton({
  onComplete,
}: {
  onComplete: (accessToken: string) => void;
}) {
  const { authorize, getCredentials } = useAuth0();

  const onPress = async () => {
    try {
      await authorize({
        scope: 'openid profile email',
        audience: 'http://localhost:3000',
      });
      const credentials = await getCredentials();
      onComplete(credentials.accessToken);
    } catch (e) {
      console.log(e);
    }
  };

  return <Button onPress={onPress} title="Log in" />;
}

function LogoutButton() {
  const { clearSession } = useAuth0();

  const onPress = async () => {
    try {
      await clearSession();
    } catch (e) {
      console.log(e);
    }
  };

  return <Button onPress={onPress} title="Log out" />;
}

function Profile() {
  const { user } = useAuth0();

  return (
    <>
      {user && <Text>Logged in as {user.name}</Text>}
      {!user && <Text>Not logged in</Text>}
    </>
  );
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <Auth0Provider
      domain={'dev-jadsiv7yg757c45i.us.auth0.com'}
      clientId={'lJDX6L7y7pdXk5x3F7GIu1HnmcYe52XZ'}>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Profile />
          <LoginButton onComplete={(token) => setAccessToken(token)} />
          <LogoutButton />

          <Button
            onPress={async () => {
              console.log('accessToken', accessToken);
              axios.get('http://localhost:3000', {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
            }}
            title="Log token"
          />
        </View>
      </SafeAreaView>
    </Auth0Provider>
  );
}

export default App;
