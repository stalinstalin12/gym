import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const UpdateProductForm = () => {
    const { productId } = useParams(); // Get productId from URL params
    const [formData, setFormData] = useState({
        title: "",
        product_images: [],
        price: "",
        category: "",
        stock: "",
        description: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        // Fetch the product details when the component mounts
        const fetchProductDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`http://localhost:4000/product/${productId}`, {
                    headers: { Authorization: `bearer ${token}` },
                });
                setFormData(response.data);
            } catch (error) {
                console.error("Error fetching product details:", error);
                setMessage("Failed to fetch product details. Please try again.");
            }
        };

        fetchProductDetails();
    }, [productId]);

    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                setFormData((prevData) => ({
                    ...prevData,
                    product_images: [...prevData.product_images, reader.result],
                }));
            };
            reader.readAsDataURL(file);
        });
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".png", ".jpg", ".gif", ".webp"],
        },
        multiple: true,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const token = localStorage.getItem("authToken");
        if (!token) {
            setMessage("User is not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.put(
                `http://localhost:4000/products/${productId}`,
                formData,
                {
                    headers: { Authorization: `bearer ${token}` },
                }
            );

            if (response.status === 200) {
                setMessage("Product updated successfully!");
            } else {
                setMessage(response.data.message || "Failed to update product.");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Update Product</h2>
            {message && (
                <div
                    className={`mb-4 p-2 rounded ${
                        message.includes("successfully")
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {message}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                {/* Title */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Product Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>

                {/* Image Upload */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Product Images</label>
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed p-6 text-center cursor-pointer"
                    >
                        <input {...getInputProps()} />
                        <p>Drag & drop or click to upload new images</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        {formData.product_images.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Preview ${index}`}
                                className="w-16 h-16 object-cover"
                            />
                        ))}
                    </div>
                </div>

                {/* Other Fields */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Select category</option>
                        <option value="strength training equipment">Strength Training Equipment</option>
                        <option value="cardio">Cardio Equipment</option>
                        <option value="accessories">Accessories</option>
                        <option value="yoga and flexibility">Yoga and Flexibility Tools</option>
                        <option value="nutrition and hydration">Nutrition and Hydration</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-red-600 text-white p-2 rounded"
                >
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProductForm;
