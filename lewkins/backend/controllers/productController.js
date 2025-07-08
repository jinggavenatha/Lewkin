import Product from '../models/Product.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getById(id);
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.getByCategory(category);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error in getProductsByCategory:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create new product
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    // Basic validation
    if (!productData.name || !productData.price || !productData.category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required'
      });
    }

    const newProduct = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    
    const updatedProduct = await Product.update(id, productData);
    
    res.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.delete(id);
    
    res.json({
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    const status = error.message.includes('not found') ? 404 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
};

// Search products
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const products = await Product.search(q);
    
    res.json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error('Error in searchProducts:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 