import { useNavigate, Link } from 'react-router-dom'

import "./navbar.css"

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null"
  console.log(isAuthenticated);
  const role = localStorage.getItem("role");
  const user = localStorage.getItem("user");
 
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    alert("Logout Successfully")
    window.location.href("/login")
    navigate("/login")
  }
  console.log(user)
  console.log(token)

  return (
    <nav className='navbar'>
      <div className='nav-logo'>
        <h1>Rental <span>Hub</span></h1>
      </div>
      <ul className='nav-links'>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/listings">Browse Homes</Link></li>
        {token && role === "owner" && (<li><Link to="/add">List Your Property</Link></li>)}
        {token && role === "owner" && (<li><Link to="/my-properties">My Properties</Link></li>)}
      </ul>
      {token ? (<button  className='login-btn' onClick={handleLogout}>Logout</button>) : (
        <div className='login-signup'>
          <Link to="/signup" className='login-btn'>SignUp</Link>
          <Link to="/login" className='login-btn'>Login</Link>
        </div>
      ) }


    </nav >
  )
}

export default Navbar