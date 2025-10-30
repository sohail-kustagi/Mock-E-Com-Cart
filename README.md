
  # E-commerce User Flow Design

  ## Tech Stack

  - Frontend: React 18, Vite, TypeScript, Radix UI primitives
  - Backend: Node.js, Express, MongoDB, JWT authentication, Winston logging
  - Tooling: Jest, Supertest, Docker Compose, Nodemon

  ## Repository Layout

  ```
  ├── backend/              # Express API, Mongo models, tests, seeding script
  ├── src/                  # React application source (Vite)
  ├── docker-compose.yml    # API + MongoDB container setup
  ├── index.html            # Vite entry point
  └── package.json          # Frontend package manifest
  ```

  ## Prerequisites

  - Node.js 18+ and npm 9+
  - MongoDB 6.x running locally, or Docker if you prefer containers

  ## MongoDB Setup

  ### Local installation (Linux/macOS)

  1. Install MongoDB Community Edition. On Debian/Ubuntu:
    ```bash
    sudo apt update
    sudo apt install -y mongodb-org
    ```
    Refer to https://www.mongodb.com/docs/manual/administration/install-community/ for other platforms.
  2. Start the service and enable it at boot:
    ```bash
    sudo systemctl enable --now mongod
    ```
  3. Confirm it is running:
    ```bash
    sudo systemctl status mongod
    # or
    mongo --eval 'db.runCommand({ ping: 1 })'
    ```
  4. (Optional) Create an application user inside `mock-cart`:
    ```bash
    mongosh
    use mock-cart
    db.createUser({ user: 'mockcart', pwd: 'strong-password', roles: ['readWrite'] })
    ```
    Update your `MONGODB_URI` to `mongodb://mockcart:strong-password@localhost:27017/mock-cart` if you enable authentication.

  ### MongoDB Atlas

  - Alternatively, create a free cluster on MongoDB Atlas, add an IP allowlist entry for your machine, and obtain the connection string.
  - Paste the Atlas URI into `MONGODB_URI` (remember to URL-encode special characters in the password).

  ## Environment Variables

  ### Backend (`backend/.env`)

  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/mock-cart
  MONGODB_DB_NAME=mock-cart
  JWT_SECRET=replace-me
  LOG_LEVEL=info
  ```

  - `PORT` is optional; defaults to `5000`.
  - `LOG_LEVEL` controls Winston log verbosity (`error`, `warn`, `info`, etc.).

  ### Frontend (`.env` in the repo root)

  ```
  VITE_API_BASE_URL=http://localhost:5000
  ```

  Point this at the backend URL you are running (local or remote).

  ## Local Development

  ### 1. Install dependencies

  ```bash
  # Frontend (project root)
  npm install

  # Backend
  cd backend
  npm install
  ```

  ### 2. Start the backend API

  ```bash
  cd backend
  npm run dev
  ```

  The API listens on `http://localhost:5000` by default. Logs are written to `backend/logs/app.log` in addition to stdout.

  ### 3. Start the frontend

  ```bash
  # In a new terminal from the repo root
  npm run dev
  ```

  Vite serves the React app on `http://localhost:5173` with live reload (port may vary; check the terminal output).

  ## Database Seeding

  After configuring `backend/.env`, you can load sample products:

  ```bash
  cd backend
  npm run seed:products
  ```

  The script clears the `products` collection before inserting the sample data.

  ## Testing

  Backend tests use Jest with an in-memory MongoDB instance:

  ```bash
  cd backend
  npm test
  ```

  Use `npm run test:watch` for watch mode during development.

  ## Docker Workflow

  The repo includes a `docker-compose.yml` to run the API alongside MongoDB:

  ```bash
  docker compose up --build
  ```

  - Builds the backend image and starts MongoDB.
  - API is exposed on `http://localhost:5000`.
  - MongoDB is exposed on `mongodb://localhost:27017` with data persisted in the `mongo-data` volume.

  Stop and remove containers with `docker compose down` (add `-v` to also remove the named volume).

  ## Production Build

  Build the frontend for deployment:

  ```bash
  npm run build
  ```

  The production-ready assets are emitted to `dist/`. Serve them with any static file host and point the frontend `VITE_API_BASE_URL` to your deployed backend.
  