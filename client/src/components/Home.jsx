import './style.css';
import axios from 'axios';
import { useState,useEffect } from 'react'
export default function Home(){
    const[products,setProducts]=useState([]);
    const[loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    useEffect(()=>{
      
        const fetchProducts=async()=>{
          try{
            const response=await axios.get('http://localhost:4000/products');
            setProducts(response.data.products);
            setLoading(false);
          }
          catch(err){
            setError(err.response?.data?.message||err.message||"something went wrong");
            setLoading(false);
          }
        };
        fetchProducts();
    },[]);
    return(
        <>
        <div className="container-fluid w-full">
        <section className=" head-bg bg-cover bg-center h-64 flex items-center justify-center text-white " >
        <h2 className="text-4xl font-bold bg-black  p-4 rounded">Welcome to Flex Fitness</h2>
      </section>


      <div className="container mx-auto my-8 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h3>
         {/* Loading State */}
         {loading && <p>Loading products...</p>}
          
          {/* Error State */}
          {error && <p className="text-red-500">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(products) &&products.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <img src={product.image} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h4 className="text-lg font-semibold">{product.title}</h4>
                <p className="text-gray-600">{product.price}Rs</p>
                <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
        </>
    )
}