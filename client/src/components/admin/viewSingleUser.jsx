import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const baseUrl = 'http://localhost:4000';

export default function SingleUser() {

    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${baseUrl}/user/${id}`);
                const userData = response.data.data[0];
                setUser(userData);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message || "Something went wrong");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const handleViewProducts = () => {
      // Navigate to the products page for the seller using the user._id
      navigate(`/products/user/${user._id}`);
  };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full">
                <div className="space-y-4">
                    <h2 className="text-xl font-bold mb-4 capitalize text-center">{user.name}</h2>

                    <p className="font-bold capitalize">
                        <strong>Name:</strong> <span className="text-green-800">{user.name}</span>
                    </p>
                    <p className="font-bold">
                        <strong>Email:</strong> <span className="text-green-800">{user.email}</span>
                    </p>
                    <p className="font-bold capitalize">
                        <strong>Role: </strong>
                        <span className="text-green-800">
                            {user.user_type === "6738b6d920495c12314f4c4e"
                                ? "Customer"
                                : user.user_type === "674ddd8ada8e8225185e33b6"
                                    ? "Admin"
                                    : "Seller"}
                        </span>
                    </p>

                    {/* Only show the "View Products" link if the user is a seller */}
                    {user.user_type !== "6738b6d920495c12314f4c4e" && user.user_type === "6738b70b20495c12314f4c4f" && (
                        <div className="mt-4 text-center">
                             <button
                                onClick={handleViewProducts}
                                className="text-blue-500 hover:underline"
                            >
                                View Products Uploaded by {user.name}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
