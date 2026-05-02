# SkillXchange Backend

Simple Skill Swap Platform Backend.

## Tech Stack
- Node.js
- Express
- MongoDB
- JWT Authentication

## Setup
1. `cd backend`
2. `npm install`
3. Create `.env` file with `PORT`, `MONGO_URI`, and `JWT_SECRET`.
4. `npm run dev`

## APIs
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update skills (offered/wanted)
- `GET /users/match` - Find matching users
- `POST /swap/request` - Send swap request
- `PUT /swap/:id/accept` - Accept request
- `PUT /swap/:id/reject` - Reject request
- `GET /swap/my` - Get my requests (sent/received)
