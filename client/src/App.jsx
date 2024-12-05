// import Nav from "./components/nav"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/signin";
import Home from "./components/Home";
import SellerHome from "./components/sellerHome";
import AddProductForm from "./components/addProduct";
import Cart from "./components/cart";
import ProductDetails from "./components/singleProduct";
import AdminHome from "./components/admin/adminHome";
import ViewUsers from "./components/admin/viewUsers";
import SingleUser from "./components/admin/viewSingleUser";
import YourUploads from "./components/myproducts"
import ProductCategoryPage from "./components/productCategory";


function App() {


  return (
    <>

    <Router> 
      
      <Routes>
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/user/:id" element={<SingleUser />} />
      <Route path="/category/:category" element={<ProductCategoryPage />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/adminHome" element={<AdminHome />} />
        <Route path="/ViewUsers" element={<ViewUsers />} />
        <Route path="/yourUploads" element={<YourUploads />} />

       <Route path="/sellerHome" element={<SellerHome/>} />
        <Route path="/Signin" element={<Signin />} />
        <Route path="/Cart" element={<Cart />} />

        <Route path="/addProduct" element={<AddProductForm />} />

      </Routes>
    </Router>
    </>
  )
}

export default App
