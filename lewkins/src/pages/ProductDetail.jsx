import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductDetail } from '../services/api';
import { useStore } from '../context/StoreContext';
import { formatRupiah } from '../utils/formatRupiah';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { id } = useParams();
  const { dispatch } = useStore();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductDetail(id);
        const data = response.datas || response;
        
        // Transform backend data to frontend format
        const transformedProduct = {
          id: data.id,
          name: data.name,
          description: data.description,
          category: data.category_name,
          seller: data.seller_name,
          image: data.images?.[0]?.image_url || 'https://via.placeholder.com/400',
          variants: data.variants || [],
          images: data.images || [],
          // Extract unique colors and sizes from variants
          colors: [...new Set(data.variants?.map(v => v.color).filter(Boolean) || [])],
          sizes: [...new Set(data.variants?.map(v => v.size).filter(Boolean) || [])],
          // Use minimum price from variants
          price: data.variants?.length > 0 
            ? Math.min(...data.variants.map(v => parseFloat(v.price)).filter(p => p > 0)) 
            : 0
        };
        
        setProduct(transformedProduct);
        if (transformedProduct.sizes && transformedProduct.sizes.length > 0) setSelectedSize(transformedProduct.sizes[0]);
        if (transformedProduct.colors && transformedProduct.colors.length > 0) setSelectedColor(transformedProduct.colors[0]);
        
        // Set initial variant if available
        if (transformedProduct.variants && transformedProduct.variants.length > 0) {
          setSelectedVariant(transformedProduct.variants[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Update selected variant when size or color changes
  useEffect(() => {
    if (product && product.variants && selectedSize && selectedColor) {
      const variant = product.variants.find(v => 
        v.size === selectedSize && v.color === selectedColor
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedSize, selectedColor, product]);

  const addToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Silakan pilih ukuran');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Silakan pilih warna');
      return;
    }
    if (!selectedVariant) {
      toast.error('Varian produk tidak tersedia');
      return;
    }
    if (selectedVariant.stock < quantity) {
      toast.error(`Stok tidak mencukupi. Tersisa ${selectedVariant.stock} item`);
      return;
    }
    
    dispatch({
      type: 'CART_ADD_ITEM',
      payload: { 
        ...product, 
        variant_id: selectedVariant.id,
        size: selectedSize, 
        color: selectedColor, 
        quantity,
        price: parseFloat(selectedVariant.price)
      },
    });
    toast.success('Produk berhasil ditambahkan ke keranjang!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl">Memuat produk...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-xl">Produk tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden rounded-lg">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-900 mb-4">
              {selectedVariant && selectedVariant.price 
                ? formatRupiah(parseFloat(selectedVariant.price))
                : product.price > 0
                ? formatRupiah(product.price)
                : "Select variant for price"
              }
            </p>
            {selectedVariant && (
              <p className="text-sm text-gray-600 mb-2">
                Stock: {selectedVariant.stock} available
              </p>
            )}
            {product.category && (
              <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {product.category}
              </span>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <label className="block text-lg font-semibold mb-3">Ukuran</label>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      relative py-3 px-4 border-2 rounded-lg font-medium text-center transition-all duration-200 hover:border-gray-900
                      ${selectedSize === size 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {size}
                    {selectedSize === size && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <label className="block text-lg font-semibold mb-3">Warna</label>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      relative py-2 px-4 border-2 rounded-full font-medium text-sm transition-all duration-200 hover:border-gray-900 min-w-[80px]
                      ${selectedColor === color 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
                      }
                    `}
                  >
                    {color}
                    {selectedColor === color && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div>
            <label className="block text-lg font-semibold mb-3">Jumlah</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(selectedVariant?.stock || 10, quantity + 1))}
                className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={addToCart} 
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-black transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
}
