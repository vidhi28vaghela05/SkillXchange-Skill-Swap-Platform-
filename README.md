# SkillXchange - Skill Swap Platform

A minimal functional prototype for users to list skills they offer and skills they want, and see matching users.

## Project Structure
- `backend/`: Node.js + Express + MongoDB
- `frontend/`: React + Vite + Tailwind CSS + Framer Motion

## Getting Started

### 1. Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file (see `backend/README.md`)
4. Seed sample data: `node seed.js`
5. Start server: `npm run dev`

### 2. Frontend Setup
1. `cd frontend`
2. `npm install`
3. Start development server: `npm run dev`

## Core Matching Logic
The system finds a match if:
- User A offers skill X and wants skill Y
- User B offers skill Y and wants skill X

## API Documentation
See `SkillXchange.postman_collection.json` for all available endpoints.
