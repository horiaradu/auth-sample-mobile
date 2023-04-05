import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '@env';
import Auth0 from 'react-native-auth0';

const auth0 = new Auth0({
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
});

export default auth0;
