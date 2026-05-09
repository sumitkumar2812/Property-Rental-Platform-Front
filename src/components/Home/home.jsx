import React, { useState } from 'react'
import "./home.css"
import { useNavigate } from 'react-router-dom'

const Home = () => {

const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();


const handleSearch = () =>{
  navigate(`/listings?city=${searchTerm}`)
}
 
return (
<div className='home-container'>
  <section className='hero'>
    <div className='hero-content'>
      <h1>Find your perfect Rental Home</h1>
      <p>The best properties in your favorite cities.</p>

      <div className='search-wrapper'>
        <input type='text' placeholder='search by city (e.g. Mumbai...)' value={searchTerm} onChange={(e)=> {setSearchTerm(e.target.value); console.log(e.target.value) }} />
      <button className='search-button' onClick={handleSearch}>Search</button>
      </div>
    </div>
  </section>

  <section className='features'>
        <div className='feature-card'>
          <div className="icon">🏠</div>
          <h3>10K+ Properties</h3>
          <p>Wide range of choices</p>
        </div>
        <div className='feature-card'>
          <div className="icon">✅</div>
          <h3>Verified Owners</h3>
          <p>No more fake listings</p>
        </div>
        <div className='feature-card'>
          <div className="icon">🛡️</div>
          <h3>Secure Payments</h3>
          <p>Safe and fast transactions</p>
        </div>
      </section>

  {/* Contact & Footer Section */}
      <footer className='footer'>
        <div className='footer-content'>
          <div className='footer-section about'>
            <h3>Rental <span>Hub</span></h3>
            <p>Making house hunting simple, fast, and secure. Find your next home with confidence.</p>
          </div>

          <div className='footer-section links'>
            <h4>Quick Links</h4>
            <ul>
              <li onClick={() => navigate("/listings")}>Browse Homes</li>
              <li onClick={() => navigate("/signup")}>Join as Owner</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div className='footer-section contact'>
            <h4>Contact & Connect</h4>
            <p>📧 Email: sumit.kumar@example.com</p>
            <p>📍 Location: Kanpur, India</p>
            <div className='social-links'>
              {/* Apne real links yahan paste kar dena */}
              <a href="https://www.linkedin.com/in/sumit-kumar-9a3b4b246/" target="_blank" rel="noreferrer" className="social-icon linkedin">
                LinkedIn
              </a>
              <a href="https://github.com/sumitkumar2812" target="_blank" rel="noreferrer" className="social-icon github">
                GitHub
              </a>
            </div>
          </div>
        </div>
        <div className='footer-bottom'>
          <p>&copy; 2026 Rental Hub | Designed by Sumit Kumar</p>
        </div>
      </footer>

</div>
)
}

export default Home