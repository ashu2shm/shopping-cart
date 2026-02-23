const productList = [
  {
    id: "1",
    title: "Mobile",
    price: "15000",
  },
  {
    id: "2",
    title: "phone",
    price: "15000",
  },
  {
    id: "3",
    title: "Laptop",
    price: "15000",
  },
  {
    id: "4",
    title: "earphone",
    price: "15000",
  },
];

function getProductData(id) {
  let productData = productList.find((product) => product.id === id);

  if (productData) {
    return productData;
  } else return undefined;

  //   if (productData == undefined) {
  //     return undefined;
  //   }
  //   return productData;
}

export { productList, getProductData };
