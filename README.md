# GraphQL Lab - Day 1

A GraphQL server built with Apollo Server for managing users and todos with authentication.

## Features

- 🚀 **Apollo Server** - A popular GraphQL server
- 🗄️ **MongoDB** - Document database with Mongoose ODM
- 🔐 **JWT Authentication** - Secure token-based authentication
- 🔒 **Password Hashing** - bcryptjs for secure password storage
- 🔄 **Auto-reload** - Nodemon for development convenience
- 📡 **GraphQL Queries & Mutations** - Full CRUD operations for users and todos

## Tech Stack

- **Runtime**: Node.js
- **GraphQL Server**: Apollo Server v5.5.0
- **Database**: MongoDB + Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Security**: bcryptjs
- **Development**: Nodemon

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on default port 27017)
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd Day1
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables
   Create a `.env` file in the root directory:

```
JWT_SECRET=your_secret_key_here
MONGODB_URI=mongodb://127.0.0.1:27017/graphqlDB
```

4. Ensure MongoDB is running

```bash
# Default: MongoDB running on localhost:27017
```

## Running the Server

Start the development server:

```bash
npm start
```

The server will start on `http://localhost:4000` and automatically reload on file changes.

## Project Structure

```
Day1/
├── server.js           # Main server setup
├── schema.js           # GraphQL type definitions
├── resolvers.js        # GraphQL resolvers
├── _db.js             # Database initialization
├── models/
│   ├── users.js       # User model
│   └── todos.js       # Todo model
├── package.json       # Dependencies
└── README.md          # This file
```

## API Documentation

### Queries & Mutations

The GraphQL server provides queries and mutations for:

- **Users**: Create, read, update, delete user accounts
- **Todos**: Create, read, update, delete todo items with user associations

### Authentication

Protected endpoints require a valid JWT token in the request headers.

## Database Models

### User

- Email and password authentication
- Secure password hashing with bcryptjs
- JWT token generation for sessions

### Todo

- Associated with users
- Task management and status tracking

## Development

- **Auto-reload**: Changes are automatically detected and the server restarts
- **Error Handling**: Formatted error responses for debugging
- **Database Connection**: Automatic MongoDB connection with error handling

