import './style.css';

import axios from 'axios';
import { useState,useEffect } from 'react';
import {toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import Carousel from './carousel';
import Footer from './footer';
import SellerNav from './sellerNav';

export default function Home(){
    const[products,setProducts]=useState([]);
    console.log(products)
    const [filteredProducts, setFilteredProducts] = useState([]);
    const[loading,setLoading]=useState(true);
    const [error,setError]=useState(null);
    const [cartItems, setCartItems] = useState([]);
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
           const productsNotAddedByUser=allProducts.filter((product)=>product.userId !==userId);

            setProducts(allProducts);
            setFilteredProducts(productsNotAddedByUser);
            setLoading(false);
          }
          catch(err){
            setError(err.response?.data?.message||err.message||"something went wrong");
            setLoading(false);
          }
        };
        fetchProducts();
    },[token,userId]);

    //add to cart

    const addToCart=async (productId)=>{
      try{
        
        if(!token){
          toast.error('Please login to add to cart');
          return;
        }

        const response=await axios.post(
          `${baseUrl}/addCart`,
          { productId },
          { headers: { Authorization: `bearer ${token}` } }
        );
        console.log('product added to cart', response.data);

        toast.success('Product added to cart successfully');
      setCartItems((prevItems) => [...prevItems, response.data.cart.items]);
      console.log(cartItems)
        

      }
      catch(error){
        toast.error(error.response?.data?.message || error.message || 'Error adding to cart');
      }
    }

    

    

    return(
        <>
      <SellerNav />

        <div className="container-fluid w-full bg-white">
         <ToastContainer />
      <Carousel />
      <div className="bg-yellow-100 border-2 border-yellow-500 text-yellow-700 p-4 rounded-md shadow-md  mx-auto mt-8 container">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg">Special Offer!</p>
          <p>Join now and get <span className="font-bold">50% off</span> on your first order.</p>
        </div>
        <div className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md font-semibold text-sm">
        Use Code: <span className="font-bold ">FLEX100 - <br /> To avail an instant discount of Rs 100</span>
      </div>
      </div>
    </div>

<div className="container-fluid mx-auto px-4 py-8">
      <div className="grid h-3/4 grid-cols-2 gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <div className="image-item  overflow-hidden shadow-lg">
          <img src="/images/gym5.jpg" alt="Image 1" className="hover:cursor-pointer w-full h-full object-cover" />
        </div>
        <div className="image-item  overflow-hidden shadow-lg">
          <img src="images/gymbg2.jpg" alt="Image 2" className="hover:cursor-pointer w-full h-full object-cover" />
        </div>
        <div className="image-item  overflow-hidden shadow-lg">
          <img src="images/supplement.jpg" alt="Image 3" className="hover:cursor-pointer w-full h-full object-cover" />
        </div>
        <div className="image-item  overflow-hidden shadow-lg">
          <img src="images/machine.jpg" alt="Image 4" className="hover:cursor-pointer w-full h-full object-cover" />
        </div>
      </div>
    </div>
      

      <div className="container mx-auto my-8 px-4">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Products</h3>
         {/* Loading State */}
         {loading && <p>Loading products...</p>}
          {/* Error State */}
          {error && <p className="text-red-500">{error}</p>}
        <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.isArray(filteredProducts) &&filteredProducts.map((product) => (
            
            <div key={product._id} className=" bg-white   drop-shadow-xl rounded-lg overflow-hidden" >
              <img src={`${baseUrl}/${product.image}`} alt={product.title} className="hover:cursor-pointer  w-full h-48 object-cover"onClick={()=>navigate(`/product/${product._id}`)} />
              <div className="p-4 ">
                <h4 className="text-lg font-bold capitalize ">{product.title}</h4>
                <p className="text-gray-900 font-semibold mt-2">₹ {product.price}</p>
                <h4 className="text-md font-semibold text-gray-700 mt-2 line-clamp-1">{product.description}</h4>

                <p className="text-gray-500 mt-2 capitalize">{product.category}</p>
                
               
                 
               <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  if (product.stock > 0) {
                    addToCart(product._id);
                  }
                }}
                className={`p-2 h-9 w-9 rounded-full ${
                  product.stock > 0 ? 'bg-black hover:bg-gray-700 active:bg-red-800' : 'bg-gray-400 cursor-not-allowed'
                }`}
                disabled={product.stock === 0 || product.stock == null}
              >
                <img src="./public/images/cart2.png" alt="" width={20} height={20} />
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
        
        <Footer />
      

        </>
    )
}