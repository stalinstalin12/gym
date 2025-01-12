import { useEffect, useState } from "react";
import axios from "axios";
import NoData from "./noDataFound"; // Import NoData component
import SubNav from "./subNav";
// import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:4000";

const OrderDetailPage = () => {
  const [orders, setOrders] = useState([]); // Ensure initial state is an array
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({}); // Store product details

  const token = localStorage.getItem("authToken"); // Get the token from localStorage

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${baseUrl}/viewOrders`, {
          headers: { Authorization: `bearer ${token}` },
        });
        if (Array.isArray(response.data.orders)) {
          setOrders(response.data.orders); // Set orders from the response correctly
        }
        setLoading(false);
      } catch (err) {
       (
          err.response?.data?.message || err.message || "Something went wrong"
        );
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  useEffect(() => {
    const fetchProductDetails = async (productId) => {
      try {
        const response = await axios.get(`${baseUrl}/product/${productId}`);
        setProductDetails((prevDetails) => ({
          ...prevDetails,
          [productId]: response.data,
        }));
      } catch (err) {
        console.error("Failed to fetch product details", err);
      }
    };

    // Fetch product details for each product in the orders
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (!productDetails[product.productId._id]) {
          fetchProductDetails(product.productId._id);
        }
      });
    });
  }, [orders, productDetails]);

  if (loading) return <p>Loading...</p>;

  if (orders.length === 0) {
    return (
      <div>
        <SubNav />
        <NoData
          message="No Orders Found"
          subMessage="It seems like you haven't placed any orders yet. Start exploring and add items to your cart!"
        />
      </div>
    );
  }

  return (
    <div>
      <SubNav />
      <div className="container mx-auto p-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">Order ID: {order._id}</h2>
            {order.products.map((product, index) => {
              const productDetail = productDetails[product.productId._id];
              return (
                <div key={index} className="border rounded-lg p-4 mb-4">
                  <div className="flex mb-4">
                    {productDetail ? (
                      <>
                        <img
                          src={`${baseUrl}/${productDetail.product_images[1]}`}
                          alt={productDetail.title}
                          className="w-24 h-24 object-cover mr-4"
                        />
                        <div>
                          <h3 className="text-lg font-bold">
                            {productDetail.title}
                          </h3>
                          <p className="text-gray-600">
                            ₹ {productDetail.price} x {product.quantity}
                          </p>
                          <p className="text-gray-600">
                            Total: ₹ {productDetail.price * product.quantity}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p>Loading product details...</p>
                    )}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Delivery Address</h4>
                    <p>{order.address}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Shipping Updates</h4>
                    <p>Email: {order.userId.email}</p>
                    <p>Phone: {order.userId.phone}</p>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Status</h4>
                    <p>{order.status}</p>
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                        <div
                          style={{
                            width:
                              order.status === "Delivered" ? "100%" : "50%",
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Order placed</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetailPage;
