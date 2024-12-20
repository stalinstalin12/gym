import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false); // Toggle for edit mode
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
  });
  const [upgradeData, setUpgradeData] = useState({
    companyName: '',
    license: '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [upgradeSuccessMessage, setUpgradeSuccessMessage] = useState(null);

  const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage

  useEffect(() => {
    if (token) {
      // Fetch user profile when the component mounts
      axios
        .get('http://localhost:4000/userprofile', {
          headers: {
            Authorization: `bearer ${token}`, // Attach the token in the Authorization header
          },
        })
        .then((response) => {
          setUserData(response.data.data); // Assuming response contains `data` field with user profile
          setFormData({
            name: response.data.data.name,
            email: response.data.data.email,
            address: response.data.data.address || '', // Default to an empty string if address is not provided
            password: '', // Keep password empty by default
          });
        })
        .catch((err) => {
          setError(err.response ? err.response.data.message : 'Something went wrong');
        });
    } else {
      setError('No token found. Please log in.');
    }
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpgradeInputChange = (e) => {
    const { name, value } = e.target;
    setUpgradeData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = () => {
    if (token) {
      axios
        .put(
          'http://localhost:4000/updateUser',
          { ...formData },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setSuccessMessage('Profile updated successfully');
          setError(null);
          setUserData(response.data.data); // Update userData with new data
          setEditMode(false); // Exit edit mode
        })
        .catch((err) => {
          setError(err.response ? err.response.data.message : 'Something went wrong');
        });
    }
  };

  const handleUpgradeRequest = () => {
    if (token) {
      axios
        .post(
          'http://localhost:4000/requestUpgrade',
          { ...upgradeData },
          {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setUpgradeSuccessMessage('Upgrade request submitted successfully');
          setError(null);
          console.log(response);
        })
        .catch((err) => {
          setError(err.response ? err.response.data.message : 'Something went wrong');
        });
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-500 text-white p-4 rounded">
          <h2>{error}</h2>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-gray-200 p-4 rounded">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 text-center">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        {editMode ? 'Edit Profile' : 'Your Profile'}
      </h1>

      {successMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">{successMessage}</div>
      )}

      {upgradeSuccessMessage && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">{upgradeSuccessMessage}</div>
      )}

      <div className="flex flex-col space-y-4">
        <div className="flex justify-between gap-6">
          <label className="block font-medium text-gray-600">Name :</label>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          ) : (
            <div className="text-gray-800 font-semibold">{userData.name}</div>
          )}
        </div>

        <div className="flex justify-between gap-6">
          <label className="block font-medium text-gray-600">Email :</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          ) : (
            <div className="text-gray-800">{userData.email}</div>
          )}
        </div>

        <div className="flex justify-between gap-6">
          <label className="block font-medium text-gray-600">Address :</label>
          {editMode ? (
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          ) : (
            <div className="text-gray-800">{userData.address || 'N/A'}</div>
          )}
        </div>

        <div className="flex justify-between gap-6">
          <label className="block font-medium text-gray-600">User Type :</label>
          <div className="text-gray-800">
            {userData.user_type === '6738b70b20495c12314f4c4f' ? 'Seller' : 'Customer'}
          </div>
        </div>

        {userData.user_type !== '6738b70b20495c12314f4c4f' && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Request Upgrade to Seller</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between gap-6">
                <label className="block font-medium text-gray-600">Company Name :</label>
                <input
                  type="text"
                  name="companyName"
                  value={upgradeData.companyName}
                  onChange={handleUpgradeInputChange}
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex justify-between gap-6">
                <label className="block font-medium text-gray-600">License :</label>
                <input
                  type="text"
                  name="license"
                  value={upgradeData.license}
                  onChange={handleUpgradeInputChange}
                  className="border p-2 rounded"
                />
              </div>

              <button
                onClick={handleUpgradeRequest}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Request Upgrade
              </button>
            </div>
          </div>
        )}
      </div>

      {editMode ? (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default Profile;
