import React from "react";
import { productList } from "../product/ProductStore";
import ProductCard from "../components/ProductCard";

function Carts() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔥 Hero Section */}
      <div className="">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Explore All Products
          </h1>
          
        </div>
      </div>

      {/* 🔥 Product Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {productList.length === 0 ? (
          <div className="text-center text-gray-500 text-xl">
            No products available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Carts;