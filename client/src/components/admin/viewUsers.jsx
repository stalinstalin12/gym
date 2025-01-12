import { useEffect, useState } from "react";
import AdminNav from "./adminNav"; // Ensure this component is styled and functional
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faSpinner, faEye, faBan, faUnlink } from "@fortawesome/free-solid-svg-icons";
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
  const [updating, setUpdating] = useState(null); // To track blocking/unblocking state
  const [blockUserId, setBlockUserId] = useState(null); // Tracks the user being blocked
  const [blockReason, setBlockReason] = useState(""); // Tracks the reason for blocking

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

  // Block User after submitting the reason
  const handleBlockUser = async () => {
    try {
      if (!blockReason.trim()) {
        toast.error("Please provide a reason for blocking the user.");
        return;
      }
      setUpdating(blockUserId); // Indicate the user being updated (blocked)
      await axios.patch(
        `http://localhost:4000/block/${blockUserId}`,
        { reason: blockReason }, // Send the reason in the request body
        {
          headers: {
            Authorization: `bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Update user state with the blocked status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === blockUserId ? { ...user, isBlocked: true } : user
        )
      );
     
      setBlockUserId(null); // Reset block user state
      setBlockReason(""); // Reset block reason
    } catch (err) {
      console.error("Error blocking user:", err);
      toast.error(err.response?.data?.message || "Failed to block user");
    } finally {
      setUpdating(null); // Reset updating state
    }
  };

  // Unblock User
  const unblockUser = async (id) => {
    try {
      setUpdating(id); // Indicate the user being updated (unblocked)
      await axios.patch(`http://localhost:4000/unblock/${id}`, {}, {
        headers: {
          Authorization: `bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Update user state with the unblocked status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isBlocked: false } : user
        )
      );
     
    } catch (err) {
      console.error("Error unblocking user:", err);
      toast.error(err.response?.data?.message || "Failed to unblock user");
    } finally {
      setUpdating(null); // Reset updating state
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

                {/* Block/Unblock Buttons */}
                <div className="mt-4">
                  {user.isBlocked ? (
                    <button
                      onClick={() => unblockUser(user._id)}
                      disabled={updating === user._id}
                      className={`px-4 py-2 rounded-lg text-white ${
                        updating === user._id
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-800"
                      }`}
                    >
                      {updating === user._id ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <FontAwesomeIcon icon={faUnlink} />
                      )}
                    </button>
                  ) : (
                    <>
                      {blockUserId === user._id ? (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Enter reason"
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                          />
                          <button
                            onClick={handleBlockUser}
                            className="px-4 py-2 mt-2 bg-red-600 hover:bg-red-800 text-white rounded-lg"
                          >
                            Submit Reason
                          </button>
                          <button
                            onClick={() => {
                              setBlockUserId(null);
                              setBlockReason("");
                            }}
                            className="px-4 py-2 mt-2 ml-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setBlockUserId(user._id)}
                          className={`px-4 py-2 rounded-lg text-white ${
                            updating === user._id
                              ? "bg-gray-400"
                              : "bg-red-600 hover:bg-red-800"
                          }`}
                        >
                          {updating === user._id ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <FontAwesomeIcon icon={faBan} />
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Delete User Button */}
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

                {/* View User Button */}
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

                {/* Block/Unblock Buttons */}
                <div className="mt-4">
                  {user.isBlocked ? (
                    <button
                      onClick={() => unblockUser(user._id)}
                      disabled={updating === user._id}
                      className={`px-4 py-2 rounded-lg text-white ${
                        updating === user._id
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-800"
                      }`}
                    >
                      {updating === user._id ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : (
                        <FontAwesomeIcon icon={faUnlink} />
                      )}
                    </button>
                  ) : (
                    <>
                      {blockUserId === user._id ? (
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Enter reason"
                            value={blockReason}
                            onChange={(e) => setBlockReason(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                          />
                          <button
                            onClick={handleBlockUser}
                            className="px-4 py-2 mt-2 bg-red-600 hover:bg-red-800 text-white rounded-lg"
                          >
                            Submit Reason
                          </button>
                          <button
                            onClick={() => {
                              setBlockUserId(null);
                              setBlockReason("");
                            }}
                            className="px-4 py-2 mt-2 ml-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setBlockUserId(user._id)}
                          className={`px-4 py-2 rounded-lg text-white ${
                            updating === user._id
                              ? "bg-gray-400"
                              : "bg-red-600 hover:bg-red-800"
                          }`}
                        >
                          {updating === user._id ? (
                            <FontAwesomeIcon icon={faSpinner} spin />
                          ) : (
                            <FontAwesomeIcon icon={faBan} />
                          )}
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Delete User Button */}
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

                {/* View User Button */}
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
