import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = 'http://localhost:4000';

export default function ProductDetails() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${baseUrl}/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto my-8 px-4 w-3/4 sm:flex-col">
      <h1 className="text-3xl font-bold  mb-4 text-center capitalize">{product.title}</h1>
      <div className="flex">
        <img src={`${baseUrl}/${product.image}`} alt={product.title} className="w-1/2 h-max object-cover mr-4" />
        <div className="w-0.5  bg-gray-300 ml-4"></div>
        <div className="mx-auto ml-12">
          <p className="text-gray-700 mb-2"><strong>Price:</strong> {product.price} Rs</p>
          <p className="text-gray-700 mb-2"><strong>Category:</strong> {product.category}</p>
          <p className="text-gray-700 mb-2"><strong>Description:</strong> {product.description}</p>
          <div className='text-black flex gap-3'>
                 
                 {product.stock ==0 ||product.stock==null ? (
                <p className="text-red-600 font-semibold ">Out Of Stock</p>
                 ):(<p className="text-green-600 font-semibold">In Stock</p>)}
                 </div>
                 </div>
      </div>
    </div>
  );
}
