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
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  console.log(property?.host?.name);
  const loggedInUserId = user?.id;
  const propertyOwnerId = property?.host?._id;


  console.log(loggedInUserId)
  console.log(propertyOwnerId)
  console.log(loggedInUserId === propertyOwnerId)

  useEffect(() => {
    const fetchProperty = async () => {
      try {

        const response = await axios.get(`http://localhost:5000/api/properties/${id}`)
        console.log(response.data);
        setProperty(response.data);
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }

    }; fetchProperty();
  }, [id]);

  const handleDelete = async () => {
    const token = localStorage.getItem("token")
    const isConfirmed = window.confirm("Are you sure you want to delete this proprty , this action can not be Undone.")
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/properties/${id}`, {
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
  if (loading) return
  <Loader />

  if (!property) {
    return (
      <div className='error-page'>
        <h2>Property not found.</h2>
        <button onClick={() => Navigate("/listings")}>Return to property list page.</button>
      </div>
    )
  }

  // const [formData, setFormData] = useState({
  // title: "", location: "", price: "", image: "", description: "", bedrooms: "", bathrooms: ""
  // })

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

          <div className='action-buttons'>
            {loggedInUserId === propertyOwnerId ? <div><button className='book-now-btn' onClick={handleDelete}>Delete Property</button>
              <button className='book-now-btn' onClick={() => Navigate(`/edit-property/${property._id}`)}>Update Property</button>
            </div> : (<button className='book-now-btn' onClick={() => setShowModal(true)}>Contact Owner</button>)}

            {showModal && (<div className='modal-overlay'>
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


            </div>)}
          </div>
        </div>
      </div>


    </div>
  )
}

export default Details