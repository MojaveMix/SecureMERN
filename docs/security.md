# SecureMERN Security Foundation

This document outlines the security foundation implemented in V0.5 of SecureMERN. 
The generated Express backend is designed to be **secure-by-default** while remaining usable for local development.

## HTTP Security

* **Helmet**: Configured to set appropriate security headers by default (e.g., preventing XSS, clickjacking, MIME-sniffing).
* **Security Headers**: Standard headers are injected automatically, with features like Cross-Origin Resource Policy relaxed for generic local development, to be tightened in production.

## Network/API Security

* **CORS (Cross-Origin Resource Sharing)**: Instead of a permissive wildcard (`*`), CORS is restricted to the specific frontend origin configured in the `CLIENT_URL` environment variable.
* **Rate Limiting**: To prevent basic DoS/brute-force attacks, `express-rate-limit` restricts each IP to a configurable amount of requests within a time window (default 100 requests per 15 minutes).
* **Request Limits**: `express.json` request body sizes are capped (default `10kb`) to prevent payload exhaustion attacks.

## Input Security

* **Validation**: Input validation is established via a middleware using [Zod](https://zod.dev/). This ensures that only data adhering to rigid schemas enters the application logic. (Example implemented on the health endpoint).

## Error Security

* **Safe Production Error Messages**: A centralized error-handling middleware is used to mask stack traces and raw internal error strings in production (`NODE_ENV=production`). It defaults to returning a generic "Internal server error" to avoid leaking sensitive information like database credentials or internal filesystem paths.
* **404 Handling**: Unknown routes do not leak standard framework error pages; they return a consistent JSON payload indicating the route was not found.

## Configuration Security

* **Environment Variables**: A strict `env.js` boot-time validator checks for the existence of required configuration variables (`NODE_ENV`, `PORT`, `CLIENT_URL`). The server will fail to start and log a clear error if they are missing.
* **Secrets Management**: Variables and passwords are never hardcoded in the repository. They are supplied through `.env` which is ignored by `.gitignore`.

## Limitations

SecureMERN security defaults reduce common application risks but do not guarantee that an application is secure.

Developers must still perform security reviews, dependency updates, authorization checks, secure deployment, logging, monitoring and threat modeling.
