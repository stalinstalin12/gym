import { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";

const AddProductForm = () => {
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
            "image/*": [".jpeg", ".png", ".jpg", ".gif" ,".webp"],
        },
        multiple: true, // Allow multiple file uploads
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
            // Submit the form data including the array of base64 images
            const response = await axios.post(
                "http://localhost:4000/product",
                formData,
                {
                    headers: { Authorization: `bearer ${token}` },
                }
            );

            if (response.status === 201) {
                setMessage("Product added successfully!");
                setFormData({
                    title: "",
                    product_images: [],
                    price: "",
                    category: "",
                    stock: "",
                    description: "",
                });
            } else {
                setMessage(response.data.message || "Failed to add product.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Product</h2>
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
                        <p>Drag & drop or click to upload images</p>
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
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    {loading ? "Submitting..." : "Add Product"}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
