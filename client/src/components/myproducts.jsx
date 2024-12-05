import './style.css';

import axios from 'axios';
import { useState,useEffect } from 'react';
import {toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

import Footer from './footer';
import SellerNav from './sellerNav';

export default function YourUploads(){
    const[products,setProducts]=useState([]);
    console.log(products)
    const [userProducts, setUserProducts] = useState([]);
    const[loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const baseUrl = 'http://localhost:4000'; 
    const navigate=useNavigate();
    const token =localStorage.getItem('authToken');
    const userId=localStorage.getItem('userId')

    

//fetch products

    useEffect(()=>{
      
        const fetchProducts=async()=>{
          if(!token){
            toast.error('Please login to continue');
            return;
          }

          try{
            const response=await axios.get(`${baseUrl}/products`,{
              headers: {
                Authorization: `Bearer ${token}`, 
              },
            });
            console.log(response.data);
            
           const allProducts=response.data.data;
           const userOwnedProducts=allProducts.filter((product)=>product.userId===userId)

            setUserProducts(userOwnedProducts);
            setProducts(allProducts);
            setLoading(false);
          }
          catch(err){
            setError(err.response?.data?.message||err.message||"something went wrong");
            setLoading(false);
          }
        };
        fetchProducts();
    },[token,userId]);

   

    

    

    

    return(
        <>
      <SellerNav />
        <ToastContainer />
        <div className="container-fluid w-full">
         
      

      <div className="container mx-auto my-8 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Products</h3>
         {/* Loading State */}
         {loading && <p>Loading products...</p>}
          {/* Error State */}
          {error && <p className="text-red-500">{error}</p>}
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(userProducts) &&userProducts.map((product) => (
            
            <div key={product._id} className=" bg-white shadow-md rounded-lg overflow-hidden" >
              <img src={`${baseUrl}/${product.image}`} alt={product.title} className="hover:cursor-pointer w-full h-48 object-cover"onClick={()=>navigate(`/product/${product._id}`)} />
              <div className="p-4 ">
                <h4 className="text-lg font-bold capitalize ">{product.title}</h4>
                <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>

                <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                
               
                 
               
                    </div>
              </div>
          
          ))}
        </div>
      </div>

      

      
        </div>
        
        <Footer />
      

        </>
    )
}