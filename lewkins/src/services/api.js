// Mock data for demonstration - replace with real API endpoints
const mockProducts = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    price: 55000,
    category: "T-Shirts",
    image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg",
    description: "A comfortable and stylish white t-shirt made from 100% cotton.",
    colors: ["White", "Black", "Gray"],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: 2,
    name: "Denim Jacket",
    price: 128000,
    category: "Jackets",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    description: "A trendy denim jacket perfect for casual outings.",
    colors: ["Blue", "Black"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 3,
    name: "Summer Dress",
    price: 230000,
    category: "Dresses",
    image: "https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg",
    description: "A beautiful summer dress for warm weather.",
    colors: ["Red", "Blue", "Yellow"],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: 4,
    name: "Casual Jeans",
    price: 70000,
    category: "Jeans",
    image: "https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg",
    description: "Comfortable casual jeans for everyday wear.",
    colors: ["Blue", "Black"],
    sizes: ["28", "30", "32", "34", "36"]
  },
  {
    id: 5,
    name: "Black Sneakers",
    price: 400000,
    category: "Shoes",
    image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg",
    description: "Comfortable black sneakers with excellent support. Ideal for daily wear and light athletic activities.",
    colors: ["Black", "White", "Gray"],
    sizes: ["7", "8", "9", "10", "11", "12"]
  },
  {
    id: 6,
    name: "Leather Wallet",
    price: 420000,
    category: "Accessories",
    image: "https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg",
    description: "Premium leather wallet with multiple card slots and bill compartments. Compact yet spacious design.",
    colors: ["Brown", "Black"],
    sizes: ["One Size"]
  },
  {
    id: 7,
    name: "Wool Sweater",
    price: 699000,
    category: "Sweaters",
    image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
    description: "Cozy wool sweater perfect for cold weather. Soft texture and classic design that never goes out of style.",
    colors: ["Navy", "Gray", "Burgundy"],
    sizes: ["S", "M", "L", "XL"]
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function getProducts() {
  try {
    await delay(500); // Simulate network delay
    return mockProducts;
  } catch (error) {
    console.error('Error in getProducts:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function getProductById(id) {
  try {
    await delay(300); // Simulate network delay
    const product = mockProducts.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (error) {
    console.error('Error in getProductById:', error);
    throw error;
  }
}

export async function addProduct(product) {
  try {
    await delay(500);
    const newProduct = {
      ...product,
      id: Math.max(...mockProducts.map(p => p.id)) + 1
    };
    mockProducts.push(newProduct);
    return newProduct;
  } catch (error) {
    console.error('Error in addProduct:', error);
    throw new Error('Failed to add product');
  }
}

export async function updateProduct(id, updatedProduct) {
  try {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    mockProducts[index] = { ...mockProducts[index], ...updatedProduct };
    return mockProducts[index];
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await delay(500);
    const index = mockProducts.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    const deletedProduct = mockProducts.splice(index, 1)[0];
    return deletedProduct;
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}
