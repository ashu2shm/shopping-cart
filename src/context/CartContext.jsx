import { createContext, useState, useEffect, useContext } from "react";
import { databases } from "../Appwrite";
import { ID, Query } from "appwrite";
import { AuthContext } from "./AuthContext";
import { getProductData } from "../product/ProductStore";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cartProducts, setCartProducts] = useState([]);

  // 🔥 Load user cart
  useEffect(() => {
    if (!user) {
      setCartProducts([]);
      return;
    }

    const fetchCart = async () => {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal("userId", user.$id)]
      );

      setCartProducts(response.documents);
    };

    fetchCart();
  }, [user]);

  function getProductQuantity(id) {
    const quantity = cartProducts.find(
      (product) => product.productId === id
    )?.quantity;

    return quantity ?? 0;
  }

  async function addOneToCart(id) {
    if (!user) return alert("Login first");

    const existingItem = cartProducts.find(
      (item) => item.productId === id
    );

    if (existingItem) {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingItem.$id,
        { quantity: existingItem.quantity + 1 }
      );
    } else {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        {
          userId: user.$id,
          productId: id,
          quantity: 1,
        }
      );
    }

    // Refresh cart
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    setCartProducts(response.documents);
  }

  async function removeOneFromCart(id) {
    const existingItem = cartProducts.find(
      (item) => item.productId === id
    );

    if (!existingItem) return;

    if (existingItem.quantity === 1) {
      await deleteFromCart(id);
    } else {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingItem.$id,
        { quantity: existingItem.quantity - 1 }
      );
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal("userId", user.$id)]
    );

    setCartProducts(response.documents);
  }

  async function deleteFromCart(id) {
    const existingItem = cartProducts.find(
      (item) => item.productId === id
    );

    if (!existingItem) return;

    await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      existingItem.$id
    );

    setCartProducts((prev) =>
      prev.filter((item) => item.productId !== id)
    );
  }

  async function clearCart() {
    for (let item of cartProducts) {
      await databases.deleteDocument(
        DATABASE_ID,
        COLLECTION_ID,
        item.$id
      );
    }

    setCartProducts([]);
  }

  function getTotalCost() {
    let totalCost = 0;

    cartProducts.forEach((item) => {
      const product = getProductData(item.productId);
      if (product) {
        totalCost += product.price * item.quantity;
      }
    });

    return totalCost;
  }

  return (
    <CartContext.Provider
      value={{
        items: cartProducts,
        getProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        clearCart,
        getTotalCost,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}