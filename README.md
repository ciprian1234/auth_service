# Auth Service

Authentification service with nodejs using jwt and oauth2:

- express
- passport
- jsonwebtoken

## AuthService exposes following HTTP paths:

- /auth/google - login with google provider
- /auth/google/callback - path which google provider will callback if google user is succesfully authenticated
- /me - get user profile, only if user is authenticated
- /logout - invalidate user access token

### TODO:

- add DB
- export functionalities like isAuthorized to other projects
