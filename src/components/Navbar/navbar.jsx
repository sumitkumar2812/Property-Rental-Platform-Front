import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react'; // Mobile menu ke liye
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false); // Mobile toggle state

  const token = localStorage.getItem("token");
  const isAuthenticated = token && token !== "undefined" && token !== "null";
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear(); // Saara data ek baar mein saaf
    alert("Logout Successfully");
    navigate("/login");
    window.location.reload(); // State reset karne ke liye
  };

  return (
    <nav className='navbar'>
      <div className='nav-logo'>
        <h1 onClick={() => navigate("/")}>Rental <span>Hub</span></h1>
      </div>

      {/* Mobile Menu Icon */}
      <div className='mobile-menu-icon' onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? "✖" : "☰"}
      </div>

      <ul className={isMobile ? 'nav-links-mobile' : 'nav-links'} onClick={() => setIsMobile(false)}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/listings">Browse Homes</Link></li>
        {isAuthenticated && role === "owner" && (
          <>
            <li><Link to="/add">List Property</Link></li>
            <li><Link to="/my-properties">My Properties</Link></li>
          </>
        )}
        
        {/* Mobile View mein Login/Logout niche dikhega */}
        <div className='mobile-auth-btns'>
          {isAuthenticated ? (
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login" className='nav-auth-link'>Login</Link>
              <Link to="/signup" className='signup-btn'>Sign Up</Link>
            </>
          )}
        </div>
      </ul>

      {/* Desktop Auth Buttons */}
      <div className='nav-auth-desktop'>
        {isAuthenticated ? (
          <button className='logout-btn' onClick={handleLogout}>Logout</button>
        ) : (
          <div className='auth-flex'>
            <Link to="/login" className='nav-auth-link'>Login</Link>
            <Link to="/signup" className='signup-btn'>Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;