import { Link } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

function Signin() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrors({ email: '', password: '' });

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required!' }));
      return;
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email address!' }));
      return;
    }

    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required!' }));
      return;
    } else if (password.length < 6) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 6 characters!' }));
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      console.log(response);
      const { token, user_type } = response.data.data;

      if (!response.data) {
        toast.error('Login failed');
      } else {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', response.data.data._id);
        localStorage.setItem('user_type', user_type);

        console.log(localStorage);

        toast.success("Login Successful");
        console.log("login successful");

        if (localStorage.user_type === '6738b6d920495c12314f4c4e') {
          navigate('/Home');
        } else if (localStorage.user_type === '6738b70b20495c12314f4c4f') {
          navigate('/sellerHome');
        } else if (localStorage.user_type === '674ddd8ada8e8225185e33b6') {
          navigate('/adminHome');
        } else {
          alert("unknown usertype");
        }
      }
    } catch (err) {
      setErrors(err.response?.data?.error || 'Login Failed');
      toast.error('Login Failed');
    }
  };

  return (
    <div className="flex flex-col items-center p-8 justify-center min-h-screen ">
      <ToastContainer />
      <div className="w-full max-w-sm text-center bg-gradient-to-l from-red-100 rounded-lg shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl text-red-600 font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4 relative">
            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Your Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4 relative">
            <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sign In
          </button>
          <br />
          <Link to="/Signup" className="text-red-500 hover:underline mt-4 inline-block">
            New User?
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signin;
