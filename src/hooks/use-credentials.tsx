import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { Credentials, UserInfo } from 'react-native-auth0';
import { MainStackParams } from '../routers/main-stack-navigation';
import { call } from '../services/api';
import auth0 from '../services/auth0';

export default function useCredentials() {
  const { navigate } =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const onMount = useCallback(async () => {
    console.log('onMount...');
    // const result = await auth0.credentialsManager.requireLocalAuthentication();
    // console.log(result);

    // const isValid = await auth0.credentialsManager.hasValidCredentials();
    // console.log('isValid', isValid);
    // if (!isValid) {
    //   navigate('Login');
    //   return;
    // }

    try {
      const c = await auth0.credentialsManager.getCredentials();
      setCredentials(c);
      console.log('credentials', c);

      const u = await auth0.auth.userInfo({ token: c.accessToken });
      setUser(u);
      console.log('user', u);
    } catch (e) {
      console.error(e);
      navigate('Login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    onMount();
  }, [onMount]);

  return { user, credentials };
}
