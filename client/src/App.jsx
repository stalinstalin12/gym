// import Nav from "./components/nav"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import YourUploads from "./components/myproducts";
import ProductCategoryPage from "./components/productCategory";
import Wishlist from "./components/wishlist";
import Profile from "./components/yourProfile";
import UserProducts from "./components/admin/selllerproducts";
import Checkout from "./components/orderdetails";
import MyOrders from "./components/myOrders";
import ContactPage from "./components/contact";
import AllUsersOrdersPage from "./components/admin/allOrders";
import AllProductsPage from "./components/admin/allProducts";
import LoadingWrapper from "./components/loadingWrapper"; // Import the LoadingWrapper component
import UpdateProductForm from "./components/updateProduct";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <LoadingWrapper>
              <Home />
            </LoadingWrapper>
          }
        />
        <Route
          path="/product/:id"
          element={
            <LoadingWrapper>
              <ProductDetails />
            </LoadingWrapper>
          }
        />
        <Route
          path="/user/:id"
          element={
            <LoadingWrapper>
              <SingleUser />
            </LoadingWrapper>
          }
        />
        <Route
          path="/category/:category"
          element={
            <LoadingWrapper>
              <ProductCategoryPage />
            </LoadingWrapper>
          }
        />
        <Route
          path="/Signup"
          element={
            <LoadingWrapper>
              <Signup />
            </LoadingWrapper>
          }
        />
        <Route
          path="/Checkout"
          element={
            <LoadingWrapper>
              <Checkout />
            </LoadingWrapper>
          }
        />
        <Route
          path="/myOrders"
          element={
            <LoadingWrapper>
              <MyOrders />
            </LoadingWrapper>
          }
        />
        <Route path="/edit-product/:productId" element={
            <LoadingWrapper>
              <UpdateProductForm />
            </LoadingWrapper>
          } />

        <Route
          path="/Home"
          element={
            <LoadingWrapper>
              <Home />
            </LoadingWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <LoadingWrapper>
              <Profile />
            </LoadingWrapper>
          }
        />
        <Route
          path="/contact"
          element={
            <LoadingWrapper>
              <ContactPage />
            </LoadingWrapper>
          }
        />
        <Route
          path="/products/user/:id"
          element={
            <LoadingWrapper>
              <UserProducts />
            </LoadingWrapper>
          }
        />
        <Route
          path="/adminHome"
          element={
            <LoadingWrapper>
              <AdminHome />
            </LoadingWrapper>
          }
        />
        <Route
          path="/ViewUsers"
          element={
            <LoadingWrapper>
              <ViewUsers />
            </LoadingWrapper>
          }
        />
        <Route
          path="/yourUploads"
          element={
            <LoadingWrapper>
              <YourUploads />
            </LoadingWrapper>
          }
        />
        <Route
          path="/wishlist"
          element={
            <LoadingWrapper>
              <Wishlist />
            </LoadingWrapper>
          }
        />
        <Route
          path="/AllOrders"
          element={
            <LoadingWrapper>
              <AllUsersOrdersPage />
            </LoadingWrapper>
          }
        />
        <Route
          path="/sellerHome"
          element={
            <LoadingWrapper>
              <SellerHome />
            </LoadingWrapper>
          }
        />
        <Route
          path="/Signin"
          element={
            <LoadingWrapper>
              <Signin />
            </LoadingWrapper>
          }
        />
        <Route
          path="/Cart"
          element={
            <LoadingWrapper>
              <Cart />
            </LoadingWrapper>
          }
        />
        <Route
          path="/AllProducts"
          element={
            <LoadingWrapper>
              <AllProductsPage />
            </LoadingWrapper>
          }
        />
        <Route
          path="/addProduct"
          element={
            <LoadingWrapper>
              <AddProductForm />
            </LoadingWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
