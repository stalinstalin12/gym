import { useEffect, useState } from "react";
import AdminNav from "./adminNav"; // Ensure this component is styled and functional
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSpinner, faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ViewUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]); // All users from API
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:4000/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${localStorage.getItem("authToken")}`, // Ensure token is passed
          },
        });

        setUsers(response.data.data); // Assuming response.data.data contains the user array
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle user deletion
  const deleteUser = async (id) => {
    try {
      setDeleting(id); // Indicate the user being deleted
      await axios.delete(`http://localhost:4000/user/${id}`, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Remove the deleted user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast.success("User deleted successfully");
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting(null); // Reset delete state
    }
  };

  // Filter users based on search query
  const filteredUsers = users
  .filter(
    (user) => user.user_type !== "674ddd8ada8e8225185e33b6" // Exclude Admin by user_type
  )
  .filter((user) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(lowerCaseQuery) ||
      user.email.toLowerCase().includes(lowerCaseQuery) ||
      (user.user_type === "6738b6d920495c12314f4c4e" &&
        "customer".includes(lowerCaseQuery)) || // Match role: Customer
      (user.user_type === "6738b70b20495c12314f4c4f" &&
        "seller".includes(lowerCaseQuery)) // Match role: Seller
    );
  });

  const customers = filteredUsers.filter(
    (user) => user.user_type === "6738b6d920495c12314f4c4e"
  ); // Filter Customers
  const sellers = filteredUsers.filter(
    (user) => user.user_type !== "6738b6d920495c12314f4c4e"
  ); // Filter Sellers

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-bold text-gray-700">Loading users...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg font-bold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <AdminNav />
      <ToastContainer />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-3xl font-bold mb-6 text-center">Users</h2>

        {/* Search Bar */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search users (e.g., 'Seller', 'Customer')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 w-1/2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Sellers Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Sellers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sellers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200 text-center"
              >
                <h3 className="text-lg font-semibold capitalize text-black">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <button
                  onClick={() => deleteUser(user._id)}
                  disabled={deleting === user._id}
                  className={`mt-4 px-4 py-2 rounded-lg text-white ${
                    deleting === user._id
                      ? "bg-gray-400"
                      : "bg-red-600 hover:bg-red-800"
                  }`}
                >
                  {deleting === user._id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                </button>
                <button
                  onClick={() => navigate(`/user/${user._id}`)}
                  className="px-4 py-2 mt-4 bg-green-700 hover:bg-green-900 text-white rounded-lg ml-3"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Customers Section */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Customers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {customers.map((user) => (
              <div
                key={user._id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200 text-center"
              >
                <h3 className="text-lg font-semibold capitalize text-black">{user.name}</h3>
                <p className="text-sm text-gray-600">{user.email}</p>
                <button
                  onClick={() => deleteUser(user._id)}
                  disabled={deleting === user._id}
                  className={`mt-4 px-4 py-2 rounded-lg text-white ${
                    deleting === user._id
                      ? "bg-gray-400"
                      : "bg-red-600 hover:bg-red-800"
                  }`}
                >
                  {deleting === user._id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                </button>
                <button
                  onClick={() => navigate(`/user/${user._id}`)}
                  className="px-4 py-2 mt-4 bg-green-700 hover:bg-green-900 text-white rounded-lg ml-3"
                >
                  <FontAwesomeIcon icon={faEye} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
