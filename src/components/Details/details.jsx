import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyData } from '../../data'
import "./details.css"

const details = ({data}) => {

  const { id } = useParams()
  const Navigate = useNavigate()

  const property = data.find((item) => item.id === Number(id));

  if (!property) {
    return (
      <div className='error-page'>
        <h2>Property not found.</h2>
        <button onClick={() => Navigate("/listings")}>Return to property list page.</button>
      </div>
    )
  }

  return (
    <div className='details-wrapper'>
      <button className='back-btn' onClick={() => Navigate(-1)}>Back</button>

      <div className='details-layout'>
        <div className='image-box'>
          <img src={property.image} alt={property.title} />
        </div>

        <div className='info-box'>
          <span className='catagory-tag'>Featured Property</span>
          <h1>{property.title}</h1>
          <p>{property.location}</p>

          <div className='price-section'>
            <span className='amt'>{property.price}</span>
            <span className='per-month'>/Month</span>
          </div>

          <div className='desc-box'>
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          <div className='features-list'>
            <div>{property.bathrooms} Bathrooms</div>
            <div>{property.bedrooms} Bedrooms</div>
            <div>{property.size_sqft}<span> sqft</span></div>
          </div>

          <button className='book-now-btn' onClick={() => alert("Contact Owner On this Number - 1234567890")}>Contact Owner</button>
          <button className='book-now-btn'>Delete Property</button>
        </div>
      </div>

    </div>
  )
}

export default details