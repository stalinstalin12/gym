import './style.css';
import axios from 'axios';
import { useState,useEffect } from 'react'
export default function Home(){
    const[products,setProducts]=useState([]);
    const[loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const baseUrl = 'http://localhost:4000';  

    useEffect(()=>{
      
        const fetchProducts=async()=>{
          try{
            const response=await axios.get(`${baseUrl}/products`);
            console.log(response.data);
            
           
            
            setProducts(response.data.data);
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
        <section className=" head-bg bg-cover bg-center h-96 flex items-center justify-center text-white " >
        <h2 className="text-2xl mr-11 font-bold text-zinc-300  p-4 ">FLEX FITNESS <br />Where Strength Meets Convenience</h2>
      </section>


      <div className="container mx-auto my-8 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h3>
         {/* Loading State */}
         {loading && <p>Loading products...</p>}
          
          {/* Error State */}
          {error && <p className="text-red-500">{error}</p>}
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.isArray(products) &&products.map((product) => (
            
            <div key={product._id} className=" bg-white shadow-md rounded-lg overflow-hidden">
              <img src={`${baseUrl}/${product.image}`} alt={product.title} className="w-full h-48 object-cover" />
              <div className="p-4 ">
                <h4 className="text-lg font-semibold">{product.title}</h4>
                <p className="text-gray-900">{product.price}Rs</p>
                <p className="text-gray-500">{product.category}</p>
                <div className="flex justify-between align-middle">
                <button className=" p-2 h-9 w-9 rounded-full bg-black hover:bg-gray-700 active:bg-red-800 active:outline-double" >
                  <img src="./public/images/cart2.png" alt="" width={20} height={20}/>
                </button>
                <button className="p-2 bg-black hover:bg-gray-600 rounded-full w-9 h-9 active:bg-red-800 active:outline-double" >
                      <img src="./public/images/wishlist.png" alt="" width={20} height={20}/>
                    </button>
                    </div>
              </div>
            </div>
          ))}
        </div>
      </div>
        </div>
        
        
      

        </>
    )
}