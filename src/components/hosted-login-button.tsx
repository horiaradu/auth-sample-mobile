import React from 'react';
import { AUTH0_AUDIENCE } from '@env';
import { Credentials, useAuth0 } from 'react-native-auth0';
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';

type Props = {
  onSuccess?: (credentials: Credentials) => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export default function HostedLoginButton({ onSuccess, onCancel }: Props) {
  const { authorize, getCredentials } = useAuth0();

  const onPress = async () => {
    try {
      await authorize({
        scope: 'openid profile email offline_access',
        audience: AUTH0_AUDIENCE,
      });
      const credentials = await getCredentials();
      console.log('credentials', credentials);

      if (credentials) {
        Toast.show({
          type: 'success',
          text1: 'Obtained credentials.',
          text2: JSON.stringify(credentials),
        });

        onSuccess && (await onSuccess(credentials));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign up / login cancelled',
        });

        onCancel && (await onCancel());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button mode="contained" onPress={onPress}>
      Login / Sign up
    </Button>
  );
}
