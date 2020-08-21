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

## Usage

- run: npm install
- create .env file with following environment variables:
  - PORT=4000
  - GOOGLE_CLIENT_ID="Your google client id"
  - GOOGLE_CLIENT_SECRET="Your google client secret"
  - REFRESH_TOKEN_SECRET="Your refresh token secret"
  - ACCESS_TOKEN_SECRET="Your access token secret"
  - ACCESS_TOKEN_EXPIRATION="7d"
- import and call function: runAuthService(process.env.PORT)
- import and use as middleware function: isAuthenticated in each route you want to protect
