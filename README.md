# FoodxBites Backend API

A RESTful API backend for the FoodxBites food review platform, built with Node.js, Express, and PostgreSQL.

## Features

- User authentication and authorization
- Food management (CRUD operations)
- Review system
- Admin dashboard
- Search functionality
- Image upload support

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/WEB-DEV-CIC/food-review-postgres-backend.git
cd food-review-postgres-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:8000
DB_NAME=food_review_cql
JWT_SECRET="secret"
DATABASE_URL=postgresql://neondb_owner:<PASS>.eu-central-1.aws.neon.tech/neondb?sslmode=require
```

## Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE foodxbites;
```

2. Test database connection:
```bash
node test-connection.js
```

3. Seed initial data:
```bash
node seed.js
```

## Running the Application

Development mode:
```bash
npm run dev
```

## API Endpoints

### Authentication (v1)
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user profile

### Foods (v1)
- `GET /api/v1/foods` - Get all foods (public)
- `GET /api/v1/foods/:id` - Get food by ID (public)
- `POST /api/v1/foods` - Create new food (Admin only)
- `PUT /api/v1/foods/:id` - Update food (Admin only)
- `DELETE /api/v1/foods/:id` - Delete food (Admin only)

### Reviews (v1)
- `GET /api/v1/reviews` - Get all reviews
- `POST /api/v1/reviews` - Add a review
- `PUT /api/v1/reviews/:id` - Update a review
- `DELETE /api/v1/reviews/:id` - Delete a review

### Users (v1)
- `GET /api/v1/users` - Get all users (Admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user profile
- `DELETE /api/v1/users/:id` - Delete user (Admin only)

### Admin (v1)
- `GET /api/v1/admin/stats` - Get dashboard statistics
- `GET /api/v1/admin/users` - Get all users
- `GET /api/v1/admin/foods` - Get all foods with admin details

## Environment Variables


| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Node environment | development |
| PORT | Server port | 5000 |
| CLIENT_URL | Frontend URL | http://localhost:8000 |
| DB_NAME | Database name | food_review_cql |
| JWT_SECRET | JWT secret key | "secret" |
| DATABASE_URL | PostgreSQL connection URL | postgresql://neondb_owner:<PASS>.eu-central-1.aws.neon.tech/neondb?sslmode=require |

Note: Replace the DATABASE_URL with your own PostgreSQL connection string when deploying to production.

## Testing

1. Test database connection:
```bash
node test-connection.js
```

2. Test server:
```bash
node test-server.js
```

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- CORS configuration


