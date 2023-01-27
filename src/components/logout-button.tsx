import React from 'react';
import { useAuth0 } from 'react-native-auth0';
import { Button } from 'react-native-paper';

type Props = {
  onSuccess?: () => void | Promise<void>;
};

export default function LogoutButton({ onSuccess }: Props) {
  const { clearSession } = useAuth0();

  const onPress = async () => {
    try {
      await clearSession();
      onSuccess && (await onSuccess());
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
