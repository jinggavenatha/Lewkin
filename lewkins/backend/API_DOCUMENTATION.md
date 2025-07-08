# API Documentation

## Base URL

```
http://localhost:5001/api
```

## Endpoints

### Health Check

**GET** `/test`

Test backend connection.

**Response:**

```json
{
  "success": true,
  "message": "Backend connected successfully!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Products

#### Get All Products

**GET** `/products`

Retrieve all products from the database.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 29.99,
      "category": "T-Shirts",
      "description": "Product description",
      "sizes": ["S", "M", "L"],
      "colors": ["Red", "Blue"],
      "image": "https://example.com/image.jpg",
      "stock": 100,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get Product by ID

**GET** `/products/:id`

Retrieve a single product by ID.

**Parameters:**

- `id` (number) - Product ID

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 29.99,
    "category": "T-Shirts",
    "description": "Product description",
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"],
    "image": "https://example.com/image.jpg",
    "stock": 100,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Product not found"
}
```

#### Get Products by Category

**GET** `/products/category/:category`

Retrieve products filtered by category.

**Parameters:**

- `category` (string) - Product category

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "price": 29.99,
      "category": "T-Shirts",
      "description": "Product description",
      "sizes": ["S", "M", "L"],
      "colors": ["Red", "Blue"],
      "image": "https://example.com/image.jpg",
      "stock": 100
    }
  ]
}
```

#### Search Products

**GET** `/products/search?q={query}`

Search products by name or description.

**Query Parameters:**

- `q` (string) - Search query

**Example:**

```
GET /products/search?q=shirt
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Cotton T-Shirt",
      "price": 29.99,
      "category": "T-Shirts",
      "description": "Comfortable cotton shirt",
      "sizes": ["S", "M", "L"],
      "colors": ["Red", "Blue"],
      "image": "https://example.com/image.jpg",
      "stock": 100
    }
  ]
}
```

#### Create Product

**POST** `/products`

Create a new product.

**Request Body:**

```json
{
  "name": "Product Name",
  "price": 29.99,
  "category": "T-Shirts",
  "description": "Product description",
  "sizes": ["S", "M", "L"],
  "colors": ["Red", "Blue"],
  "image": "https://example.com/image.jpg",
  "stock": 100
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Product Name",
    "price": 29.99,
    "category": "T-Shirts",
    "description": "Product description",
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"],
    "image": "https://example.com/image.jpg",
    "stock": 100,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Validation Errors (400):**

```json
{
  "success": false,
  "message": "Validation error: name is required"
}
```

#### Update Product

**PUT** `/products/:id`

Update an existing product.

**Parameters:**

- `id` (number) - Product ID

**Request Body:**

```json
{
  "name": "Updated Product Name",
  "price": 39.99,
  "category": "T-Shirts",
  "description": "Updated description",
  "sizes": ["S", "M", "L", "XL"],
  "colors": ["Red", "Blue", "Green"],
  "image": "https://example.com/updated-image.jpg",
  "stock": 150
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Updated Product Name",
    "price": 39.99,
    "category": "T-Shirts",
    "description": "Updated description",
    "sizes": ["S", "M", "L", "XL"],
    "colors": ["Red", "Blue", "Green"],
    "image": "https://example.com/updated-image.jpg",
    "stock": 150,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T01:00:00.000Z"
  }
}
```

#### Delete Product

**DELETE** `/products/:id`

Delete a product by ID.

**Parameters:**

- `id` (number) - Product ID

**Response:**

```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

**Error Response (404):**

```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## Data Types

### Product Object

```typescript
{
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  sizes: string[];
  colors: string[];
  image: string;
  stock: number;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}
```

### Standard Response Format

All API responses follow this format:

**Success Response:**

```json
{
  "success": true,
  "data": any, // Response data
  "message": "Optional success message"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Error Codes

| Status Code | Description                    |
| ----------- | ------------------------------ |
| 200         | Success                        |
| 201         | Created                        |
| 400         | Bad Request / Validation Error |
| 404         | Not Found                      |
| 500         | Internal Server Error          |

---

## Examples

### Using curl

**Get all products:**

```bash
curl -X GET http://localhost:5001/api/products
```

**Create a product:**

```bash
curl -X POST http://localhost:5001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cotton T-Shirt",
    "price": 29.99,
    "category": "T-Shirts",
    "description": "Comfortable cotton shirt",
    "sizes": ["S", "M", "L"],
    "colors": ["Red", "Blue"],
    "image": "https://example.com/shirt.jpg",
    "stock": 100
  }'
```

**Update a product:**

```bash
curl -X PUT http://localhost:5001/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Cotton T-Shirt",
    "price": 39.99
  }'
```

**Delete a product:**

```bash
curl -X DELETE http://localhost:5001/api/products/1
```

### Using JavaScript/Fetch

**Get all products:**

```javascript
const response = await fetch("http://localhost:5001/api/products");
const data = await response.json();
console.log(data.data); // Array of products
```

**Create a product:**

```javascript
const response = await fetch("http://localhost:5001/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "Cotton T-Shirt",
    price: 29.99,
    category: "T-Shirts",
    description: "Comfortable cotton shirt",
    sizes: ["S", "M", "L"],
    colors: ["Red", "Blue"],
    image: "https://example.com/shirt.jpg",
    stock: 100,
  }),
});
const data = await response.json();
console.log(data.data); // Created product
```
