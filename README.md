# Food Review Backend

A Node.js backend application with PostgreSQL database for managing food reviews.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd food-review-postgres-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the environment variables**
   Create a `.env` file in the root directory with the following variables:

```
PORT=3001
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=food_review_db
JWT_SECRET=your_jwt_secret_key
```

4. **Database Setup**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE food_review_cql;

# Connect to the database
\c food_review_cql

# Run the database schema (located in db/schema.sql)
psql -U postgres -d food_review_cql -f db/schema.sql
```

## Running the Application

1. **Start the server**

```bash
npm start
```

The server will start on http://localhost:3002 (or the PORT specified in .env)

2. **Development mode**

```bash
npm run dev
```

Runs the server with nodemon for auto-reloading during development.

## API Endpoints

### Foods

- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food by ID
- `POST /api/foods` - Create new food
- `PUT /api/foods/:id` - Update food
- `DELETE /api/foods/:id` - Delete food
- `GET /api/foods/:id/reviews` - Get food reviews
- `POST /api/foods/:id/reviews` - Submit a review for food

### Authentication required endpoints

Some endpoints require JWT authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

## Error Handling

The API returns appropriate HTTP status codes:

- 200: Success
- 201: Successfully created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 500: Server error

## Database Schema

The application uses the following main tables:

- foods
- reviews
- users
- regions
- ingredients
- taste_profiles
- food_ingredients (junction table)
- food_taste_profiles (junction table)

## Contributing

1. Create a new branch for your feature
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

MIT
