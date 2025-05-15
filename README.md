# AudioStock Server

This is the backend server for the AudioStock inventory management system.

## Features

- RESTful API for managing audio equipment inventory
- SQLite database for data storage
- Express.js server

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

3. The server will run on port 5123 by default.

## API Endpoints

- `/api/stores` - Manage stores
- `/api/categories` - Manage categories
- `/api/item-types` - Manage item types
- `/api/inventory` - Manage inventory items
- `/api/transfers` - Manage transfers between stores
- `/api/issues` - Manage item issues and returns

## Database

The application uses SQLite for data storage. The database file is located at `data/database.sqlite`.
