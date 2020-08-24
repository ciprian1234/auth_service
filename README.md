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

#### Common steps:

- run: npm install
- create .env file with following environment variables:
  - PORT=4000
  - GOOGLE_CLIENT_ID="Your google client id"
  - GOOGLE_CLIENT_SECRET="Your google client secret"
  - REFRESH_TOKEN_SECRET="Your refresh token secret"
  - REFRESH_TOKEN_EXPIRATION="Expiration time for refreshToken expressed in ms, Ex: 1209600000 = 14 days"
  - ACCESS_TOKEN_SECRET="Your access token secret"
  - ACCESS_TOKEN_EXPIRATION="Expiration time for accessToken expressed in ms, Ex: 900000 = 15 minutes"

#### As a stand-alone webservice:

- run npm start
- implement isAuthenticated function in your application using the ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET from the AuthService.
- use isAuthenticated function wherever you want your route to be protected

#### As imported code:

- import and call function: runAuthService(process.env.PORT)
- import and use as middleware function: isAuthenticated in each route you want to protect

## TODO's:

- implement authentication with different roles: "user | admin | superUser"
- add multiple OAuth2 providers: Facebook, Github, Discord
- remove exposure to important data from db
