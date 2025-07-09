import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPortal } from "react-dom";
import { useStore } from "../context/StoreContext";
import GlareHover from "../../reactbits/GlareHover/GlareHover";
import { formatRupiah } from "../utils/formatRupiah";
import FadeContent from "../../reactbits/FadeContent/FadeContent";
import { toast } from "react-toastify";

// Modal component for product selection
function ProductSelectionModal({ product, isOpen, onClose, onConfirm }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Silakan pilih ukuran');
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Silakan pilih warna');
      return;
    }
    
    onConfirm({
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Pilih Opsi Produk</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center space-x-3 mb-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <h4 className="font-medium">{product.name}</h4>
              <p className="text-lg font-semibold text-gray-900">
                {formatRupiah(product.price)}
              </p>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Ukuran</label>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-2 px-3 border rounded text-sm font-medium transition-all
                      ${selectedSize === size 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-500'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Warna</label>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`
                      py-2 px-3 border rounded-full text-sm font-medium transition-all
                      ${selectedColor === color 
                        ? 'border-gray-900 bg-gray-900 text-white' 
                        : 'border-gray-300 bg-white text-gray-900 hover:border-gray-500'
                      }
                    `}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Jumlah</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({ product, delay = 0 }) {
  const { dispatch } = useStore();
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addToWishlist = () => {
    dispatch({ type: "WISHLIST_ADD_ITEM", payload: product });
    toast.success(`${product.name} berhasil ditambahkan ke wishlist!`);
  };

  const handleAddToCart = () => {
    // Check if product has size or color options
    const hasOptions = (product.sizes && product.sizes.length > 0) || 
                      (product.colors && product.colors.length > 0);
    
    if (hasOptions) {
      setShowModal(true);
    } else {
      // Add directly if no options
      dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity: 1 } });
      toast.success("Produk berhasil ditambahkan ke keranjang!");
    }
  };

  const handleModalConfirm = (productWithOptions) => {
    dispatch({ type: "CART_ADD_ITEM", payload: productWithOptions });
    toast.success("Produk berhasil ditambahkan ke keranjang!");
  };

  return (
    <>
      <FadeContent
        blur={true}
        duration={1000}
        easing="ease-out"
        initialOpacity={0}
        delay={delay}
      >
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
          <Link to={`/products/${product.id}`} className="block">
            <div style={{ position: "relative" }}>
              <GlareHover
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                width="100%"
                height="100%"
                background="transparent"
                borderRadius="0"
                borderColor="transparent"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </GlareHover>
            </div>
          </Link>

          <div className="p-6 flex flex-col justify-between flex-grow">
            <Link to={`/products/${product.id}`} className="block mb-4 group">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-700 transition-colors duration-200">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm group-hover:text-gray-800 transition-colors duration-200">
                {product.description}
              </p>
            </Link>

            <Link to={`/products/${product.id}`} className="block mb-4">
              <div className="flex justify-between items-center hover:bg-gray-50 p-2 -m-2 rounded transition-colors duration-200">
                <span className="text-2xl font-bold">
                  {formatRupiah(product.price)}
                </span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </Link>

            {/* Bottom buttons section */}
            <div className="flex justify-between items-center mt-auto">
              <Link
                to={`/products/${product.id}`}
                className="text-xs text-purple-600 hover:underline"
              >
                View Details
              </Link>
              <button
                onClick={handleAddToCart}
                className="bg-black text-white text-xs px-4 py-2 rounded hover:bg-gray-800 transition flex items-center"
              >
                <i className="fas fa-shopping-cart mr-2"></i>Add to Cart
              </button>
            </div>

            {/* Color tags + wishlist */}
            {/* <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                {product.colors &&
                  product.colors.map((color, index) => (
                    <span
                      key={index}
                      className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                    >
                      {color}
                    </span>
                  ))}
              </div>
              <button
                onClick={addToWishlist}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                aria-label="Add to Wishlist"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div> */}
          </div>
        </div>
      </FadeContent>

      {/* Product Selection Modal */}
      {showModal && createPortal(
        <ProductSelectionModal
          product={product}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={handleModalConfirm}
        />,
        document.body
      )}
    </>
  );
}
