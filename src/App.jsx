import Signup from "./components/Signup/signup.jsx"
import Login from "./components/Login/login.jsx"
import Home from "./components/Home/home.jsx"
import Navbar from "./components/Navbar/navbar.jsx"
import Listings from "./components/Listings/listings.jsx"
import Details from "./components/Details/details.jsx"
import AddProperty from "./components/AddProperty/addProperty.jsx"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ProtectedRoute from "./components/protectedRoute.jsx"
import './App.css'
import EditProperty from "./components/EditProperty/editProperty.jsx"

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/listings" element={<Listings />} />
        <Route path="/add" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/edit-property/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />
        <Route path="/property/:id" element={<Details />} />
      </Routes>
    </BrowserRouter>

  )
}
export default App
