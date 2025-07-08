import pool from '../config/database.js';

class Product {
  
  // Get all products
  static async getAll() {
    try {
      const result = await pool.query(`
        SELECT id, name, price, category, description, image, colors, sizes, stock, created_at 
        FROM products 
        ORDER BY created_at DESC
      `);
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  // Get product by ID
  static async getById(id) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error fetching product: ${error.message}`);
    }
  }

  // Get products by category
  static async getByCategory(category) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE category ILIKE $1 ORDER BY created_at DESC',
        [`%${category}%`]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching products by category: ${error.message}`);
    }
  }

  // Create new product
  static async create(productData) {
    const { name, price, category, description, image, colors, sizes, stock } = productData;
    
    try {
      const result = await pool.query(`
        INSERT INTO products (name, price, category, description, image, colors, sizes, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, [name, price, category, description, image, colors, sizes, stock || 0]);
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  // Update product
  static async update(id, productData) {
    const { name, price, category, description, image, colors, sizes, stock } = productData;
    
    try {
      const result = await pool.query(`
        UPDATE products 
        SET name = $1, price = $2, category = $3, description = $4, 
            image = $5, colors = $6, sizes = $7, stock = $8, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        RETURNING *
      `, [name, price, category, description, image, colors, sizes, stock, id]);
      
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  // Delete product
  static async delete(id) {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING *',
        [id]
      );
      
      if (result.rows.length === 0) {
        throw new Error('Product not found');
      }
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  // Search products
  static async search(query) {
    try {
      const result = await pool.query(`
        SELECT * FROM products 
        WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
        ORDER BY created_at DESC
      `, [`%${query}%`]);
      
      return result.rows;
    } catch (error) {
      throw new Error(`Error searching products: ${error.message}`);
    }
  }
}

export default Product; 