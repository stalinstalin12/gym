import { Link } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const addUser = async (event) => {
    event.preventDefault();
    console.log("reached here...");

    const nameRegex = /^[a-zA-Z]+([ '-][a-zA-Z]+)*$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^.{6,}$/;

    setErrors({ name: '', email: '', password: '' });

    // Validation
    if (!name && !email && !password) {
      setErrors({
        name: "name is required!",
        email: "email is required!",
        password: "password is required!"
      });
      return;
    }

    if (!name) {
      setErrors((prev) => ({ ...prev, name: "name is required!" }));
      return;
    } else if (!nameRegex.test(name)) {
      setErrors((prev) => ({ ...prev, name: "invalid name!" }));
      return;
    }

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "email is required!" }));
      return;
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: "invalid email!" }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: "password required!" }));
      return;
    } else if (!passwordRegex.test(password)) {
      setErrors((prev) => ({ ...prev, password: "password must contain 6 characters!" }));
      return;
    }

    const data = { name, email, password, isSeller };
    console.log("data:", data);

    try {
      // Replace the fetch call with axios
      const response = await axios.post("http://localhost:4000/users", data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    
      // Axios automatically parses the response body as JSON, so no need to do `response.json()`
      if (response.status === 201) { 
        toast.success("Your account has been created");
        navigate('/Signin');
      } else {
        toast.error(response.data.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 justify-center min-h-screen ">
      <ToastContainer />
      <div className="w-full max-w-sm text-center bg-gradient-to-l from-red-100 rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl text-red-600 font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={addUser}>
          <div className="mb-4 relative">
            <FontAwesomeIcon icon={faUser} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.name && <div id="name-err" className="text-red-500 text-sm mt-1">{errors.name}</div>}
          </div>
          <div className="mb-4 relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Your Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && <div id="email-err" className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
          <div className="mb-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && <div id="pass-err" className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>
          <div className="form-group checkbox-group flex items-center justify-center mb-4">
            <input
              type="checkbox"
              id="isSeller"
              checked={isSeller}
              onChange={() => setIsSeller(!isSeller)}
              className="mr-2"
            />
            <label htmlFor="isSeller" className="text-red-600 font-serif">Seller?</label>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500">
            Register
          </button>
          <br />
          <Link to="/Signin" className="text-red-500 hover:underline mt-4 inline-block">
            Already user?
          </Link>
        </form>
      </div>
    </div>
  );
}
