import Card from './ui/Card'
import Button from './ui/Button'

import { CartContext } from '../context/CartContext'
import { useContext } from 'react'

function ProductCard({ product }) {

  // const product = props.product;
  const cart = useContext(CartContext)
  const productQuantity = cart.getProductQuantity(product.id)

  // console.log(cart.items);



  return (
    <Card className="p-4 shadow-md">
      <h2 className="font-semibold text-lg">
        {product.title}
      </h2>

      <p className="text-gray-600">
        Price: {product.price}
      </p>

      {productQuantity > 0 ?
        <>
          <p className='mt-2 front-mediun'>

            In Cart : {productQuantity}
          </p>

          <button onClick={() => cart.deleteFromCart(product.id)}>Clear</button>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => cart.addOneToCart(product.id)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              +
            </button>

            <button
              onClick={() => cart.removeOneFromCart(product.id)}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              -
            </button>
          </div>
        </>
        :
        <Button className="mt-4" onClick={() => cart.addOneToCart(product.id)}>
          Add To Cart
        </Button>
      }
    </Card>
  )
}

export default ProductCard