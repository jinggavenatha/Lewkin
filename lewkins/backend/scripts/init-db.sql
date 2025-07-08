-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE lewkins_db;

-- Connect to lewkins_db and run the following:

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    colors TEXT[], -- Array of colors
    sizes TEXT[], -- Array of sizes
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Insert sample data
INSERT INTO products (name, price, category, description, image, colors, sizes, stock) VALUES
('Classic White T-Shirt', 25.99, 'T-Shirts', 'A comfortable and stylish white t-shirt made from 100% cotton.', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg', ARRAY['White', 'Black', 'Gray'], ARRAY['XS', 'S', 'M', 'L', 'XL'], 50),
('Denim Jacket', 79.99, 'Jackets', 'A trendy denim jacket perfect for casual outings.', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', ARRAY['Blue', 'Black'], ARRAY['S', 'M', 'L', 'XL'], 25),
('Summer Dress', 45.99, 'Dresses', 'A beautiful summer dress for warm weather.', 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg', ARRAY['Red', 'Blue', 'Yellow'], ARRAY['XS', 'S', 'M', 'L'], 30),
('Casual Jeans', 59.99, 'Jeans', 'Comfortable casual jeans for everyday wear.', 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg', ARRAY['Blue', 'Black'], ARRAY['28', '30', '32', '34', '36'], 40),
('Black Sneakers', 79.99, 'Shoes', 'Comfortable black sneakers with excellent support. Ideal for daily wear and light athletic activities.', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg', ARRAY['Black', 'White', 'Gray'], ARRAY['7', '8', '9', '10', '11', '12'], 60),
('Leather Wallet', 45.99, 'Accessories', 'Premium leather wallet with multiple card slots and bill compartments. Compact yet spacious design.', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg', ARRAY['Brown', 'Black'], ARRAY['One Size'], 100),
('Wool Sweater', 69.99, 'Sweaters', 'Cozy wool sweater perfect for cold weather. Soft texture and classic design that never goes out of style.', 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg', ARRAY['Navy', 'Gray', 'Burgundy'], ARRAY['S', 'M', 'L', 'XL'], 35);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 