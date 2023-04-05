import { API_URL } from '@env';
import axios, { AxiosError } from 'axios';
import { SaveCredentialsParams } from 'react-native-auth0';
import auth0 from './auth0';

export async function call(retry = true): Promise<string> {
  const result = await auth0.credentialsManager.requireLocalAuthentication();
  console.log(result);

  const isValid = await auth0.credentialsManager.hasValidCredentials();
  let credentials = await auth0.credentialsManager.getCredentials();

  console.log('isValid', isValid);
  console.log('credentials', credentials);

  if (!isValid && credentials?.refreshToken) {
    credentials = await refreshTokens(credentials.refreshToken);
    return retry ? call(false) : Promise.reject(401);
  }

  try {
    const response = await axios.get<string>(API_URL, {
      headers: { Authorization: `Bearer ${credentials?.accessToken}` },
    });
    return response.data;
  } catch (error) {
    if (
      error instanceof AxiosError &&
      error.status === 401 &&
      credentials.refreshToken
    ) {
      console.error(JSON.stringify(error));
      await refreshTokens(credentials.refreshToken);
      return retry ? call(false) : Promise.reject(401);
    }

    throw error;
  }
}

async function refreshTokens(refreshToken: string) {
  console.log('refreshing token...');

  const credentials = await auth0.auth.refreshToken({
    refreshToken: refreshToken,
    scope: 'openid profile email offline_access',
  });

  console.log('obtained new credentials', credentials);

  await auth0.credentialsManager.saveCredentials(
    credentials as SaveCredentialsParams,
  );

  console.log('saved new credentials');

  return credentials;
}
