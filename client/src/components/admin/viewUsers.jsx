import  { useEffect, useState } from "react";
import AdminNav from "./adminNav"; // Ensure this component is styled and functional
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash,faSpinner,faEye } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import {toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ViewUsers() {
    const navigate=useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(null);
   

    useEffect(() => {
            const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:4000/users", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `bearer ${localStorage.getItem("authToken")}`, // Adjust token handling as needed
                    },
                });
        
                // Axios directly provides the JSON response in response.data
                setUsers(response.data.data); // Assuming `data` contains the users
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch users");
                setLoading(false);
            }
        };
        

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-bold text-gray-700">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-bold text-red-500">{error}</div>
            </div>
        );
    }

    const deleteUser=async(id)=>{
        try{
            setDeleting(id);
            await axios.delete(`http://localhost:4000/user/${id}`,{
                headers: {
                    Authorization: `bearer ${localStorage.getItem("authToken")}`,
                  },
            });

            setUsers((prevUsers)=>prevUsers.filter((user)=>user._id!==id));
            toast.success("User deleted successfully");
        }
        catch(err){
            console.error("Error deleting user:", err);
            toast.error(err.response?.data?.message || "Failed to delete user");
        }
        finally {
            setDeleting(null); // Reset delete state
          }
    }

    return (
        <>
            <AdminNav />
            <ToastContainer />
            <div className="p-6 bg-gray-100 min-h-screen">
                <h2 className="text-3xl font-bold mb-6 text-center">USERS</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {users
                    .filter(user => user.user_type !== "674ddd8ada8e8225185e33b6")
                    .map((user) => (
                        <div 
                            key={user._id}
                            className=" bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition duration-200 text-center">
                            <h3 className="text-lg font-semibold capitalize text-black">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-600">
                                Role:{" "}
                                <span className="font-medium">
                                    {user.user_type === "6738b6d920495c12314f4c4e"
                                        ? "Customer"
                                        : user.user_type === "674ddd8ada8e8225185e33b6" 
                                        ? "Admin"
                                        : "Seller"}
                                </span>
                            </p>
                  <button
                onClick={() => deleteUser(user._id)}
                disabled={deleting === user._id} // Disable button if currently deleting this user
                className={`mt-4 px-4 py-2 rounded-lg text-white ${
                  deleting === user._id
                    ? "bg-gray-400"
                    : "bg-red-600 hover:bg-red-800"
                }`}
              >
                
                {deleting === user._id ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faTrash} />}
              </button>
              <button onClick={()=>navigate(`/user/${user._id}`)} className="px-4 py-2 mt-4 bg-green-700 hover:bg-green-900 text-white rounded-lg ml-3" > <FontAwesomeIcon icon={faEye} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
