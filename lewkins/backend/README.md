# Lewkins Backend API

Backend API for Lewkins ecommerce application built with Node.js, Express, and PostgreSQL.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

1. Create PostgreSQL database:

```sql
CREATE DATABASE lewkins_db;
```

2. Run the init script:

```bash
psql -U postgres -d lewkins_db -f scripts/init-db.sql
```

### 3. Environment Configuration

1. Copy `config.env` and update with your PostgreSQL credentials:

```
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=lewkins_db
DB_HOST=localhost
DB_PORT=5432
NODE_ENV=development
PORT=5000
```

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start

# Run both frontend and backend
npm run dev:both
```

## API Endpoints

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `GET /api/products/search?q=query` - Search products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Health Check

- `GET /health` - Server health status
- `GET /api/test` - API connection test

## Database Schema

### Products Table

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    colors TEXT[],
    sizes TEXT[],
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Response Format

```json
{
  "success": true,
  "data": [...],
  "message": "Optional message",
  "count": 10
}
```

## Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error description"
}
```
