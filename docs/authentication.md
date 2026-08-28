# Authentication System

SecureMERN provides a secure authentication foundation out-of-the-box (since V0.6).

## Overview

The authentication system is built using:
- **JWT (JSON Web Tokens)** for access and refresh tokens.
- **bcrypt** for securely hashing passwords before storing them in MySQL.
- **Sequelize** for database models (`User` and `RefreshToken`).
- **HTTP-Only Cookies** for secure storage of Refresh Tokens to prevent XSS attacks.
- **In-Memory Storage** (React state / closure variables via Axios) for Access Tokens.

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user. |
| POST | `/api/auth/login` | Login and receive `accessToken`. Sets `refreshToken` cookie. |
| POST | `/api/auth/refresh` | Use valid `refreshToken` cookie to get a new `accessToken`. |
| POST | `/api/auth/logout` | Revoke `refreshToken` and clear the cookie. |
| GET | `/api/auth/me` | Protected route. Returns current user profile (no password). |

## Token Strategy

1. **Access Token:** Sent in the `Authorization: Bearer <token>` header. Short-lived (default 15 minutes).
2. **Refresh Token:** Stored in an HttpOnly, Secure, SameSite=Strict cookie. Long-lived (default 7 days). It is revoked in the database upon logout or rotation.
3. **Database:** Refresh tokens are hashed in the database (`tokenHash`) ensuring that a DB leak doesn't compromise active sessions easily.

## Security Considerations

- **Secrets:** Always change `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` in `.env` before production.
- **Passwords:** Are NEVER returned in API responses.
- **Rate Limiting:** Auth endpoints (`/api/auth/*`) have strict rate limiting to prevent brute force attacks (20 requests per 15 minutes per IP).

## Frontend Implementation

React uses a centralized `AuthContext` to manage the user state. An Axios interceptor automatically detects `401 Unauthorized` responses and attempts to refresh the access token transparently before failing completely.
