import { useState, useEffect,useRef } from "react";
import axios from "axios";
import AdminNav from "./AdminNav"; // Import the AdminNav component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const baseUrl = 'http://localhost:4000';

const AdminHome = () => {
  const upgradeReqSection = useRef(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [upgradeRequests, setUpgradeRequests] = useState([]);
  const [todayOrderSum, setTodayOrderSum] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpgradeRequests, setShowUpgradeRequests] = useState(false); 
  const[approveError,setApproveError]=useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await axios.get(`${baseUrl}/viewAllOrders`, {
          headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` }
        });
        const productsResponse = await axios.get(`${baseUrl}/products`, {
          headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` }
        });
        const userResponse = await axios.get(`${baseUrl}/users`, {
          headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` }
        });
        const upgradeRequestsResponse = await axios.get(`${baseUrl}/upgradeRequests`, {
          headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` }
        });

        setOrders(ordersResponse.data.data);
        setProducts(productsResponse.data.data);
        setUsers(userResponse.data.data);
        setUpgradeRequests(upgradeRequestsResponse.data.data);

        const startOfDay = new Date(); 
        startOfDay.setHours(0, 0, 0, 0); 
        const endOfDay = new Date(); 
        endOfDay.setHours(23, 59, 59, 999); 
        const todayOrders = ordersResponse.data.data.filter(order => { 
          const orderDate = new Date(order.createdAt); 
          return orderDate >= startOfDay && orderDate <= endOfDay; 
        });
        const totalSum = todayOrders.reduce((sum, order) => sum + order.total, 0); 
        setTodayOrderSum(totalSum);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShowUpgradeRequests = () => {
    setShowUpgradeRequests(!showUpgradeRequests);
  };

  // const handleScrollToUpgrade = () => {
  //   if (upgradeReqSection.current) {
  //     upgradeReqSection.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };
  const handleApproveRequest = async (requestId) => { 
    try { 
      await axios.put(`${baseUrl}/approveUpgrade/${requestId}`,
         {}, { headers: { Authorization: `bearer ${localStorage.getItem("authToken")}` }
         }); 
  setUpgradeRequests(prevRequests => prevRequests.filter(request => request._id !== requestId)); 
  setApproveError(null); } 
  catch (err) { 
    setApproveError(err.response?.data?.message || err.message || "Something went wrong"); 
    console.log(approveError)
  } 
};

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen">
      <AdminNav /> {/* Integrate the AdminNav component */}
      
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Statistic Cards */}
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Total Products</h3>
            <p className="text-2xl">{products.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-2xl">{orders.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-2xl">{users.length}</p>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Upgrade Requests</h3>
            <div className="flex gap-6 items-center">
            <p className="text-2xl">{upgradeRequests.length}</p>
            <button 
              onClick={handleShowUpgradeRequests} 
              
              className="mt-2  text-white bg-green-600 py-1 px-3 rounded hover:bg-green-800">
              <FontAwesomeIcon icon={faEye} />
            </button></div>
          </div>
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-semibold">Money</h3>
            <p className="text-2xl">₹ {todayOrderSum}</p> 
            <p className="text-green-500">Total orders placed today</p> 
          </div>
        </div>

        {showUpgradeRequests && (
          <div ref={upgradeReqSection} className="mt-8 bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Upgrade Requests</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">User Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Company Name</th>
                  <th className="py-2">License</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {upgradeRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="py-2">{request.userId.name}</td>
                    <td className="py-2">{request.userId.email}</td>
                    <td className="py-2">{request.companyName}</td>
                    <td className="py-2">{request.license}</td>
                    <td className="py-2">{request.status}</td>
                    <td className="py-2"> 
                      <button onClick={() => handleApproveRequest(request._id)} 
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700" > Approve </button> 
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Sales Overview */}
        <div className="mt-8 bg-white p-6 shadow rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
          {/* Chart Placeholder */}
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sales Overview Chart</span>
          </div>
        </div>

        {/* Sales by Country */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Sales by Country</h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Country</th>
                  <th className="py-2">Sales</th>
                  <th className="py-2">Value</th>
                  <th className="py-2">Bounce</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">United States</td>
                  <td className="py-2">2,500</td>
                  <td className="py-2">$230,900</td>
                  <td className="py-2">29.9%</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
          <div className="bg-white p-6 shadow rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Promotional Section</h3>
            <p className="text-gray-600">Get started with Flex. Theres nothing I really wanted to do in life that I wasnt able to get good at.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;
