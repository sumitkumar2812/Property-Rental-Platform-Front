import React, { useState } from 'react'
import "./home.css"
import { useNavigate } from 'react-router-dom'

const Home = () => {

const [searchTerm, setSearchTerm] = useState("");
const navigate = useNavigate();


const handleSearch = () =>{
  navigate("/listings")
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
    <div className='feature-card'>10K+ properties</div>
    <div className='feature-card'>Varified Owners</div>
    <div className='feature-card'>Secure Payments</div>
  </section>

  

</div>
)
}

export default Home