import {Link } from "react-router-dom";
import "./Signup.css";
import { useState } from 'react';
import axios from 'axios';
import {toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom"; 

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const[isSeller,setIsSeller]=useState();
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const navigate =useNavigate();

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

    const data = { name, email, password,isSeller };
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
    <div className="signup-container">
      <ToastContainer />
      <div className="signup-card">
        <h2>Sign up</h2>
        <form onSubmit={addUser}>
          <div className="form-group">
            <input type="text" placeholder="Your Name" required value={name}
          onChange={(e) => setName(e.target.value)}/>
          {errors.name && <div id="name-err" style={{ color: 'red' }}>{errors.name}</div>}
      

          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required value={email}
          onChange={(e) => setEmail(e.target.value)} />

          {errors.email && <div id="email-err" style={{ color: 'red' }}>{errors.email}</div>}

          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" required value={password}
          onChange={(e) => setPassword(e.target.value)}/>
          {errors.password && <div id="pass-err" style={{ color: 'red' }}>{errors.password}</div>}
          </div>
          <div className="form-group checkbox-group">
            <input type="checkbox" id="isSeller" checked={isSeller} onChange={()=>setIsSeller(!isSeller)} />
            <label htmlFor="isSeller"style={{color: 'red '}}>Seller?</label>
          </div>
          <button type="submit" className="register-button">Register</button><br />
          
            <Link to="/Signin" className="LoginText"> Already user?</Link>
        </form>
      </div>
    </div>
  );
}



