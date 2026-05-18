import React, { useState, useEffect } from 'react'
import Loader from '../Loader/loader'
import axios from 'axios'
import "./listings.css"
//import { propertyData } from "../../data.js"
import { Link } from "react-router-dom"

const Listings = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: "",
    maxPrice: "",
    minPrice: "",
    bedrooms: ""
  });


  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }


  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const {city, maxPrice, minPrice, bedrooms} = filters
        const response = await axios.get("https://property-rental-platform-backend.onrender.com/api/properties",{params:{city, maxPrice, minPrice, bedrooms}});
        setProperties(response.data)
        console.log(response.data)
      } catch (error) {
        console.error("Fetch Error :", error)
      } finally {
        setLoading(false)
      }
    }
    const timer = setTimeout(() => fetchProperties(),500);
    return () => clearTimeout(timer)
  }, [filters])

  return (
    <div className='listings-page'>
      <div className='searchSection'>
        <input name='city' type='text' placeholder='Enter Your City' style={{
          padding: '12px 20px',
          width: '25%',
          borderRadius: '25px',
          border: '2px solid #007bff',
          outline: 'none'
        }} onChange={handleFilterChange} />

        <input name='minPrice' type='text' placeholder='Minimun Price' style={{
          padding: '12px 20px',
          width: '25%',
          borderRadius: '25px',
          border: '2px solid #007bff',
          marginLeft:"15px",
          outline: 'none'
        }} onChange={handleFilterChange} />

        <select name="bedrooms" className='search-input' style={{ width: '150px' }} onChange={handleFilterChange}>
          <option value="">All BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
        </select>

      </div>
        <p style={{ marginTop: '10px', color: '#666' }}>Showing {properties.length} properties</p>

      {loading ? <Loader /> : (<div className='listings-container'>
        {properties.length > 0 ? (properties.map((item) => (
          <div className='property-card' key={item._id}>
            <img src={item.image} alt={item.title} loading='lazy' />
            <div className='card-details'>
              <h3>{item.title}</h3>
              <p className='loc'>{item.location}</p>
              <p className='price'>₹{item.price} <span>/Month</span></p>
              <Link to={`/property/${item._id}`}>
                <button className='details-btn'>View Details</button>
              </Link>
            </div>
          </div>))
        ) : (<div>There is no properties in this Location</div>)}
      </div>)}
    </div>
  )
}

export default Listings