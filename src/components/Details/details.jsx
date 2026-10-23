import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Loader from "../Loader/loader"
import "./details.css"

const Details = () => {
  const { id } = useParams();
  const Navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const loggedInUserId = user?.id;
  const propertyOwnerId = property?.host?._id;
  const isOwner = token && user && loggedInUserId === propertyOwnerId;

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://property-rental-platform-backend.onrender.com/api/properties/${id}`)
        setProperty(response.data);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }; 
    fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    const isConfirmed = window.confirm("Are you sure you want to delete this property, this action cannot be undone.")
    if (isConfirmed) {
      try {
        await axios.delete(`https://property-rental-platform-backend.onrender.com/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        alert("Property Deleted Successfully.")
        Navigate("/listings")
      } catch (error) {
        console.error(error)
        alert("Failed to Delete Property.")
      } finally {
        setLoading(false)
      }
    }
  }

  if (loading) return <Loader />

  if (!property) {
    return (
      <div className='error-page'>
        <h2>Property not found.</h2>
        <button onClick={() => Navigate("/listings")}>Return to property list page.</button>
      </div>
    )
  }

  // FIXED: Changed 'item' to 'property'
  const propertyImages = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : (property.image ? (Array.isArray(property.image) ? property.image : [property.image]) : ["https://via.placeholder.com/600"]);

  let amenitiesList = [];
  if (Array.isArray(property.amenities)) {
    amenitiesList = property.amenities;
  } else if (typeof property.amenities === "string") {
    try {
      amenitiesList = JSON.parse(property.amenities);
    } catch (err) {
      amenitiesList = property.amenities.split(",").map(i => i.trim());
    }
  }

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
  };

  return (
    <div className='details-wrapper'>
      <button className='back-btn' onClick={() => Navigate(-1)}>Back</button>

      <div className='details-layout'>
        {/* MULTIPLE IMAGES / CAROUSEL SECTION */}
        <div className='image-box' style={{ position: 'relative' }}>
          <img 
            src={propertyImages[currentImageIndex]} 
            alt={property.title} 
            style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '10px' }}
          />
          
          {propertyImages.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage} 
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '50%' }}
              >
                &#10094;
              </button>
              <button 
                onClick={handleNextImage} 
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '50%' }}
              >
                &#10095;
              </button>
              <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '14px', color: '#555' }}>
                Image {currentImageIndex + 1} of {propertyImages.length}
              </div>
            </>
          )}

          {/* Thumbnail row for quick clicking */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
            {propertyImages.map((imgUrl, index) => (
              <img 
                key={index} 
                src={imgUrl} 
                alt="thumb" 
                onClick={() => setCurrentImageIndex(index)}
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  objectFit: 'cover', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  border: currentImageIndex === index ? '2px solid #007bff' : '1px solid #ccc' 
                }} 
              />
            ))}
          </div>
        </div>

        <div className='info-box'>
          <span className='catagory-tag'>Featured Property</span>
          <h1>{property.title}</h1>
          <p>{property.location}</p>

          <div className='price-section'>
            <span className='amt'>₹{property.price}</span>
            <span className='per-month'>/Month</span>
          </div>

          <div className='desc-box'>
            <h3>Description</h3>
            <p>{property.description}</p>
          </div>

          <div className='features-list'>
            <div>{property.bathrooms} Bathrooms</div>
            <div>{property.bedrooms} Bedrooms</div>
          </div>

          {/* AMENITIES SECTION */}
          <div className='amenities-section' style={{ margin: '15px 0' }}>
            <h3>Amenities</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {amenitiesList.length > 0 ? (
                amenitiesList.map((amenity, idx) => (
                  <span key={idx} style={{ background: '#e0f2fe', color: '#0369a1', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>
                    {amenity}
                  </span>
                ))
              ) : (
                <p style={{ fontSize: '13px', color: '#777' }}>No amenities specified</p>
              )}
            </div>
          </div>

          <div className='action-buttons'>
            {isOwner ? (
              <div>
                <button className='book-now-btn' onClick={handleDelete}>Delete Property</button>
                <button className='book-now-btn' onClick={() => Navigate(`/edit-property/${property._id}`)}>Update Property</button>
              </div>
            ) : (
              <button className='book-now-btn' onClick={() => setShowModal(true)}>Contact Owner</button>
            )}

            {showModal && (
              <div className='modal-overlay'>
                <div className='modal-content'>
                  <h3>Owner's Contact details</h3>
                  <hr />
                  <p><strong>Name:</strong> {property.host?.name}</p>
                  <p><strong>Email:</strong> {property.host?.email}</p>
                  <p><strong>Mobile:</strong> {property.host?.mobile}</p>
                  <button className="close-btn" onClick={() => setShowModal(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details;