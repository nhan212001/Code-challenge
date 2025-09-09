# 📖 Scoreboard API Module Specification

This document specifies the API service module for handling the live scoreboard system.
It will be used by the backend engineering team to implement.

## 🎯 Requirements Recap

- Website shows top 10 users' scores.
- The scoreboard must update live.
- User can perform an action → increases their score.
- Completing an action dispatches an API call to update the score.
- Must prevent malicious users from increasing scores without authorisation.

## 🛠️ API Endpoints

### 1. Authentication

**POST /auth/login**

- Input: `{ username, password }`
- Output: `{ token, userId }`

Notes:

- Token is a JWT signed by the backend.
- Token must contain the userId claim.
- This token is required for all protected endpoints (increase score, start action).

### 2. Scoreboard

**GET /scores/top**

- Public, no authentication required.
- Output: top 10 users with `{ userId, username, score }`.
- This is mainly used for initial page load.

**WebSocket: /scores/subscribe**

- Clients connect via WebSocket to receive real-time scoreboard updates.
- Whenever a user’s score changes, the backend pushes the new top 10 list to all subscribed clients.

### 3. Action Validation and Score Updates

**POST /actions/start** (requires token)

- Purpose: prevent malicious score increases.
- Creates a new action session for a user.
- Output: `{ actionId }`

Rules:

- Each actionId is unique.
- Backend must store the actionId with status pending.
- actionId should expire if not used within a defined time (e.g., 1 minute).

**POST /scores/increase** (requires token)

- Input: `{ actionId }`

Backend validation:

- Check that the JWT token’s userId matches the user who owns the actionId.
- Ensure actionId exists and is still in pending state.
- Ensure actionId has not expired and has not been used before.

On success:

- Increase the user’s score.
- Mark the actionId as completed.
- Broadcast new scores via WebSocket.

On failure:

- Return an error (invalid action, expired action, or unauthorized user).

## 🔄 Flow of Execution

1. User → Backend: GET /scores/top
2. Backend → User: Return top 10 users
3. User → Backend: POST /auth/login (username, password)
4. Backend → User: JWT token with userId
5. User → Backend: POST /actions/start (Authorization: Bearer token)
6. Backend → User: actionId
7. User → Backend: POST /scores/increase (Authorization: Bearer token, actionId)
8. Backend → User: Score updated
9. Backend → WebSocket Server: Push updated scores
10. WebSocket Server → User: Live update (new top 10)

## 🔧 Comments for Improvement

### Role-Based Access Control (RBAC)

- Distinguish between normal users and admins.

### Admin APIs (future)

- DELETE /admin/users/:id → delete user.
- POST /admin/users/:id/ban → ban user.

### Security Enhancements

- Rate limiting per user: Prevents spamming by limiting how many score-increase requests a user can make per second.
- Audit logging of score changes: Records every score update for investigation and rollback if needed.
- ActionId expiration: Each ActionId must be valid only for a short time and usable once, prevents replay attacks where old ActionIds are reused to cheat.

### Scalability

- Cache top scores to reduce database load.
