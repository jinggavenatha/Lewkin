# Lewkins Backend API

Flask backend dengan in-memory storage buat CRUD products.

## Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server jalan di `http://localhost:5000`

## API Endpoints

### Products CRUD

| Method   | URL                  | Description          |
| -------- | -------------------- | -------------------- |
| `GET`    | `/api/products`      | Ambil semua products |
| `GET`    | `/api/products/<id>` | Ambil product by ID  |
| `POST`   | `/api/products`      | Tambah product baru  |
| `PUT`    | `/api/products/<id>` | Update product       |
| `DELETE` | `/api/products/<id>` | Hapus product        |
| `GET`    | `/api/health`        | Health check         |

### Request Body untuk POST/PUT

```json
{
  "name": "Product Name",
  "price": 99.99,
  "category": "Category",
  "image": "https://example.com/image.jpg",
  "description": "Product description",
  "colors": ["Red", "Blue"],
  "sizes": ["S", "M", "L"]
}
```

## Testing

```bash
# Get all products
curl http://localhost:5000/api/products

# Get product by ID
curl http://localhost:5000/api/products/1

# Add new product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":50,"category":"Test","description":"Test desc"}'

# Update product
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name","price":60}'

# Delete product
curl -X DELETE http://localhost:5000/api/products/1
```

## Notes

- Data stored in-memory, hilang pas server restart
- CORS enabled buat frontend React
- Port 5000 (default Flask)
- Debug mode ON
