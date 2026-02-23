import React from 'react'
import { CartContext } from '../context/CartContext'
import { useContext } from 'react'
import { getProductData } from '../product/ProductStore'



function CartProduct(props) {
    const cart = useContext(CartContext);
    const id = props.id;
    const quantity = props.quantity;
    const productData = getProductData(id);



   return (
  <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md  bg-[#dedede]transition">

    {/* Left Section - Image + Details */}
    <div className="flex items-center gap-4">

      {/* Product Image */}
      <img
        src={productData.image}
        alt={productData.title}
        className="w-20 h-20 object-cover rounded-lg border"
      />

      {/* Product Info */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          {productData.title}
        </h3>

        <p className="text-sm text-gray-500">
          Price: ₹{productData.price}
        </p>

        <p className="text-sm text-gray-600 mt-1">
          Quantity: <span className="font-medium">{quantity}</span>
        </p>
      </div>
    </div>

    {/* Right Section - Subtotal + Remove */}
    <div className="text-right">
      <p className="text-lg font-bold text-gray-900">
        ₹{(quantity * productData.price).toFixed(2)}
      </p>

      <button
        onClick={() => cart.deleteFromCart(id)}
        className="text-red-500 text-sm mt-2 hover:underline"
      >
        Remove
      </button>
    </div>

  </div>
);
}

export default CartProduct
