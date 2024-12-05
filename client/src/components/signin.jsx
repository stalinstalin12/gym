import './Signup.css'
import { Link } from "react-router-dom";
import axios from 'axios'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';

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
        const { token,   user_type} = response.data.data;
        
        if(!response.data){
          toast.error('login failed');
        }
        
        else{
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId',response.data.data._id);
        localStorage.setItem('user_type',user_type);

        console.log(localStorage);


        toast.success("Login Successful");
        console.log("login successful");
        
        if(localStorage.user_type==='6738b6d920495c12314f4c4e'){
          navigate('/Home');
        }
        else if(localStorage.user_type==='6738b70b20495c12314f4c4f'){
          navigate('/sellerHome');
        }
        else if(localStorage.user_type==='674ddd8ada8e8225185e33b6'){
          navigate('/adminHome')
        }
        else{
          alert("unknown usertype")
        }
        
          
        
       } 
    } catch (err) {
        setErrors(err.response?.data?.error || 'Login Failed');
        toast.error('Login Failed');
    }
};

  return (
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin} >
          <div className="form-group">
            <input type="email" placeholder="Your Email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}  required />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}  required />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

         
          <button type="submit" className="register-button">Sign In</button>
          <br />
          <Link to="/Signup" className="LoginText "> New User?</Link>

        </form>
      </div>
    </div>
  );
}

export default Signin;
