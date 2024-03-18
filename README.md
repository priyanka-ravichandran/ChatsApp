# ChatsApp

"Your go-to chat app for daily use: Send messages and share images effortlessly, keeping you connected with ease!"


## How to run locally

### Backend


1. Have MongoDB running and create a cluster called `
2. Have Redis running
3. Copy .env.example to .env and fill in GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (you will have to register a [GitHub OAuth app](https://docs.github.com/en/free-pro-team@latest/developers/apps/creating-an-oauth-app) and set the callback url to: http://localhost:3001/auth/github/callback)
4. Run `yarn` to install deps
5. Run `yarn watch` to compile TypeScript
6. Run `yarn dev` to start server
7. Run `yarn seed` to add dummy data to db

### Frontend

1. Run `npm i` to install dependency

```
2. Run `npm run start` to start Expo
