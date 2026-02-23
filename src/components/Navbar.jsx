import Container from "./ui/Container";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import CartProduct from "./cartProduct";
import { Link } from "react-router-dom";
import { databases } from "../Appwrite";
import { ID } from "appwrite";
import { FaShoppingCart, FaUser } from "react-icons/fa";

function Navbar() {
  const cart = useContext(CartContext);
  const { user, logout } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  const productsCount = cart.items.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  //  PAYMENT FUNCTION
  const handlePayment = async () => {
    try {
      if (!user) {
        alert("Please login for purchase!");
        return;
      }

      const totalAmount = cart.getTotalCost();

      if (totalAmount <= 0) {
        alert("Cart is empty");
        return;
      }

      const response = await fetch("http://localhost:8000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const order = await response.json();

      const options = {
        key: "rzp_test_SJIzyPsCEbV4JX",
        amount: order.amount,
        currency: "INR",
        name: "Ecommerce Store",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (response) {
          try {
            const verifyRes = await fetch(
              "http://localhost:8000/verify-payment",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
              }
            );

            const data = await verifyRes.json();

            const TRANSACTION_COLLECTION =
              import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID;

            if (data.success) {

              // 🔥 Save SUCCESS transaction
              await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                TRANSACTION_COLLECTION,
                ID.unique(),
                {
                  userId: user.$id,
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  amount: totalAmount,
                  status: "success",
                }
              );

              await cart.clearCart();
              alert("Payment Successful ✅");
              setShow(false);

            } else {

              // 🔥 Save FAILED transaction
              await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                TRANSACTION_COLLECTION,
                ID.unique(),
                {
                  userId: user.$id,
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id || "N/A",
                  amount: totalAmount,
                  status: "failed",
                }
              );

              alert("Payment Failed ❌");
            }

          } catch (error) {
            console.error(error);
            alert("Error verifying payment");
          }
        },


        modal: {
          ondismiss: async function () {
            try {
              await databases.createDocument(
                import.meta.env.VITE_APPWRITE_DATABASE_ID,
                import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID,
                ID.unique(),
                {
                  userId: user.$id,
                  orderId: order.id,
                  paymentId: "N/A",
                  amount: totalAmount,
                  status: "cancelled",
                }
              );

              alert("Payment Cancelled ❌");
            } catch (error) {
              console.error("Cancel transaction save error:", error);
            }
          },
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <nav className=" text-white">
        <Container>
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center py-4">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
            <div className="gap-4 flex justify-center items-center"> {user ? (
              <>
                {/* <FaUser /> */}
                <span>{user.name}</span>
                <button className="text-red-500" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="text-green-600" to="/login">Login </Link>
                <Link className="text-blue-150" to="/signup">Signup</Link>
              </>)}


              <button
                onClick={() => setShow(true)}
                className="relative p-2"
              >
                <FaShoppingCart size={26} />

                {productsCount > 0 && (
                  <sup
                    className=" absolute -top-2 -right-2  bg-red-500 text-white text-xs font-bold rounded-full 
                   min-w-[18px]  h-[18px] flex items-center  justify-center"
                  >
                    {productsCount}
                  </sup>
                )}
              </button></div>
          </div>
        </Container>
      </nav>

      <Modal isOpen={show} onClose={() => setShow(false)}>

        <div className="w-full max-w-4xl mx-auto rounded-2xl  p-8">

          {/* Header */}
          <div className="flex justify-between items-center border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              🛒 Your Shopping Cart
            </h2>


          </div>

          {productsCount > 0 ? (
            <>
              {/* Cart Items */}
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                {cart.items.map((item) => (
                  <div
                    key={item.$id}
                    className=""
                  >
                    <CartProduct
                      id={item.productId}
                      quantity={item.quantity}
                    />
                  </div>
                ))}
              </div>

              {/* Summary Section */}
              <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                <div className="text-md font-semibold text-gray-700">
                  Total Items: {productsCount}
                </div>

                <div className="text-xl font-bold text-gray-900">
                  ₹{cart.getTotalCost().toFixed(2)}
                </div>

                <button
                  onClick={handlePayment}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Checkout
                </button>

              </div>
            </>
          ) : (
            /* Empty Cart */
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                Your cart is empty 🛍️
              </p>
              <button
                onClick={() => setShow(false)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>

      </Modal>
    </>
  );
}

export default Navbar;