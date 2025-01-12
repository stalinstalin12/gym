import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faTags, faShoppingBag, faStore } from "@fortawesome/free-solid-svg-icons";
import SubNav from "../subNav";

const baseUrl = "http://localhost:4000";

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg font-semibold text-gray-600">Loading user details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-red-500 text-lg font-semibold">{error}</p>
            </div>
        );
    }

    const handleViewProducts = () => {
        navigate(`/products/user/${user._id}`);
    };

    // Determine user type for icon
    const userIcon = user.user_type === "6738b6d920495c12314f4c4e" ? (
        <FontAwesomeIcon icon={faUser} className="text-blue-600 text-3xl" />
    ) : user.user_type === "6738b70b20495c12314f4c4f" ? (
        <FontAwesomeIcon icon={faStore} className="text-green-600 text-3xl" />
    ) : (
        <FontAwesomeIcon icon={faUser} className="text-red-600 text-3xl" />
    );

    return (
        <>
            <SubNav />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="bg-white shadow-lg rounded-lg max-w-md w-full p-6">
                    <div className="text-center mb-6">
                        <div className="flex justify-center items-center w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4">
                            {userIcon}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 capitalize">
                            {user.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                            Viewing details for{" "}
                            <span className="text-blue-600 font-medium">
                                {user.email}
                            </span>
                        </p>
                    </div>
                    <div className="border-t pt-6 space-y-4">
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faUser}
                                className="text-gray-500 text-lg mr-3"
                            />
                            <span className="font-medium text-gray-600">Name:</span>
                            <span className="ml-auto text-gray-800 capitalize">{user.name}</span>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faEnvelope}
                                className="text-gray-500 text-lg mr-3"
                            />
                            <span className="font-medium text-gray-600">Email:</span>
                            <span className="ml-auto text-gray-800">{user.email}</span>
                        </div>
                        <div className="flex items-center">
                            <FontAwesomeIcon
                                icon={faTags}
                                className="text-gray-500 text-lg mr-3"
                            />
                            <span className="font-medium text-gray-600">Role:</span>
                            <span
                                className={`ml-auto capitalize ${
                                    user.user_type === "6738b6d920495c12314f4c4e"
                                        ? "text-blue-600"
                                        : user.user_type === "674ddd8ada8e8225185e33b6"
                                        ? "text-red-600"
                                        : "text-green-600"
                                }`}
                            >
                                {user.user_type === "6738b6d920495c12314f4c4e"
                                    ? "Customer"
                                    : user.user_type === "674ddd8ada8e8225185e33b6"
                                    ? "Admin"
                                    : "Seller"}
                            </span>
                        </div>
                        {user.user_type === "6738b70b20495c12314f4c4f" && (
                            <div className="mt-6">
                                <button
                                    onClick={handleViewProducts}
                                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                                >
                                    <FontAwesomeIcon
                                        icon={faShoppingBag}
                                        className="mr-2 text-lg"
                                    />
                                    View Products by {user.name}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
