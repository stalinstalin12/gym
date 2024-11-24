import Nav from "./components/nav"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Signup from "./components/Signup";
import Signin from "./components/signin";
import Home from "./components/Home";


function App() {


  return (
    <>
   

    <Router> 
      <Nav/>
      <Routes>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/" element={<Signup />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Signin" element={<Signin />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
