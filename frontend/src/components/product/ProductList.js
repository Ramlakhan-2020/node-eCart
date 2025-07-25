import React, { useContext, useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { userCart } from '../context/CardContext';

export default function ProductList() {
  const [products, setProducts] = useState([]);  

  const getProducts = async() =>{
        try {
            const response = await fetch("https://node-ecart-2.onrender.com/api/products/");
            const data =  await response.json();
            setProducts(data);
        } catch (error) {
            console.error("product api is not working");
        }
  }
  useEffect(()=>{
    getProducts();
  },[])

  

  const handleAddToCart = async(item) => {
    const  { _id, quantity} = item;
    
    try {
      const cartData = await fetch("https://node-ecart-2.onrender.com/api/cart/additem",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({productId:_id , quantity: quantity})
      })
      const data = await cartData.json();
      console.log(data,'data');

    } catch (error) {
       Error("Something went wrong. while adding cartItem");
    }
  };

  return (
    <div className=" bg-white p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </div>
  );
}
