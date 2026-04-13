import React, { useMemo, useState, useEffect} from 'react'
import Loader from '../Loader/loader'
import axios from 'axios'
import "./listings.css"
//import { propertyData } from "../../data.js"
import { Link } from "react-router-dom"

const Listings = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/properties");
        setProperties(response.data)
        console.log(response.data)
      } catch (error) {
        console.error("Fetch Error :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperties()
  }, [])

  const filteredData = useMemo(() => {
    return properties.filter((item) => item.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm, properties]);

  if (loading) {
    return <Loader/>
  }

  return (

    <div className='listings-page'>
      <div className='searchSection'>
        <input type='text' placeholder='Enter Your City' className='search-input' style={{
          padding: '12px 20px',
          width: '60%',
          borderRadius: '25px',
          border: '2px solid #007bff',
          outline: 'none'
        }} onChange={(e) => setSearchTerm(e.target.value)} />
        <p style={{ marginTop: '10px', color: '#666' }}>Showing {filteredData.length} properties</p>
      </div>
      <div className='listings-container'>
        {filteredData.length > 0 ? (filteredData.map((item) => (
          <div className='property-card' key={item._id}>
            <img src={item.image} alt="item.title" loading='lazy' />
            <div className='card-details'>
              <h3>{item.title}</h3>
              <p className='loc'>{item.location}</p>
              <p className='price'>{item.price} <span>/Month</span></p>
              <Link to={`/property/${item._id}`}>
                <button className='details-btn'>View Details</button>
              </Link>
            </div>
          </div>))
        ) : (<div>There is no properties in this Location</div>)}
      </div>
    </div>
  )
}

export default Listings