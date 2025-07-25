import React from 'react';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="flex flex-col border rounded-lg shadow-md p-6 bg-white">
  
      <h2 className="text-lg font-bold mb-2 text-center">
        {product.productName}
      </h2>


      <div className="mb-4 w-[150px] h-[150px] mx-auto flex items-center justify-center bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt="product"
          className="w-full h-full object-contain"
        />
      </div>


      <p className="text-md text-center mb-4">
        Price: <span className="font-bold">{product.price}</span>
      </p>


      <button
        onClick={() => onAddToCart(product)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-auto"
      >
        Add to Cart
      </button>
    </div>
  );
}
