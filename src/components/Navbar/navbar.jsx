import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import "./navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  
  // Clean Authentication Check
  const isAuthenticated = token && token !== "undefined" && token !== "null" && user;

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout Successfully");
    navigate("/login");
    window.location.reload();
  };

  return (
    <nav className='navbar'>
      <div className='nav-logo'>
        <h1 onClick={() => { navigate("/"); setIsMobile(false); }}>
          <span>Homely</span>
        </h1>
      </div>

      {/* Mobile Menu Icon */}
      <div className='mobile-menu-icon' onClick={() => setIsMobile(!isMobile)}>
        {isMobile ? "✖" : "☰"}
      </div>

      {/* Nav Links Section */}
      <ul className={isMobile ? 'nav-links-mobile' : 'nav-links'} onClick={() => setIsMobile(false)}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/listings">Browse Homes</Link></li>
        
        {/* Owner Specific Links */}
        {isAuthenticated && role === "owner" && (
          <>
            <li><Link to="/add">List Property</Link></li>
            <li><Link to="/my-properties">My Properties</Link></li>
          </>
        )}

        {/* Mobile View Profile/Auth Section (Sirf Mobile menu mein dikhega) */}
        <div className='mobile-auth-btns'>
          {isAuthenticated ? (
            <div className="mobile-user-profile">
               <img 
                src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                alt="User" 
                className="nav-profile-img" 
              />
              <span className="nav-username">Hi, {user.name?.split(' ')[0]}</span>
              <button className='logout-btn' onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <Link to="/login" className='nav-auth-link'>Login</Link>
              <Link to="/signup" className='signup-btn'>Sign Up</Link>
            </>
          )}
        </div>
      </ul>

      {/* Desktop View Profile/Auth Section (Sirf Desktop par dikhega) */}
      <div className='nav-auth-desktop'>
        {isAuthenticated ? (
          <div className="user-profile-flex">
            <div>
              <img 
              src={user.profilePic || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              alt="User" 
              className="nav-profile-img" 
            />
            </div>
            <span className="nav-username">Hi, {user.name?.split(' ')[0]}</span>
            <button className='logout-btn' onClick={handleLogout}>Logout</button>
          </div>
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