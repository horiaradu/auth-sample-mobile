# Demo Talk walkthrough

## Hosted login / sign up page

- username + password combination
- get JWT, store in state, make API calls

## Hosted login / sign up page + 2FA enabled

- various 2FA methods can be used (SMS, Authenticator, email)
- second step after sign up / login, another hosted page
- get JWT, store in state, make API calls

## Hosted login / sign up page + 2FA enabled + WebAuthn with FIDO Device Biometrics

- a convenience method for the 2FA: another hosted page, where the 2FA is the biometrics check (replaces the previous 2FA)
- get JWT, store in state, make API calls

## Hosted login / sign up page + 2FA enabled ~+ WebAuthn with FIDO Device Biometrics~ + Secure storage

- sign up / login with 2FA (classic)
- get JWT and store in Secure Storage, requiring a biometrics check to read from storage
- feels like you need biometrics, but in reality, you just need it for getting the token from secure storage
- if token is expired, try to refresh
- if can't refresh, force re-login

## Custom screens

- sign up / login with 2FA, with custom / native screens
- prompt user to enable biometrics
- if yes: store in secure storage
- if not, always need to login

# Key take aways

## Auth0 is used as a **real identity provider**

- no user data is stored in our systems
- all security is left in charge of Auth0
- client and server never really communicate (they communicate with Auth0)

## Take this with a grain of salt: No need to think about the security

- Auth0's job is to be secure. Trust them to do their job better than you
