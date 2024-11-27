import Nav from "./components/nav"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/signin";
import Home from "./components/Home";
import SellerHome from "./components/sellerHome";
import AddProductForm from "./components/addProduct";


function App() {


  return (
    <>
   

    <Router> 
      <Nav/>
      <Routes>

        <Route path="/Signup" element={<Signup />} />
        <Route path="/" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
       <Route path="/sellerHome" element={<SellerHome/>} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/addProduct" element={<AddProductForm />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
