import { useEffect, useState } from 'react'
import axios from 'axios'
import "./editProperty.css"
import {useNavigate, useParams } from 'react-router-dom'
import Loader from '../Loader/loader'

const EditProperty = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [loading , setLoading] = useState(true)

    const [formData, setFormData] = useState({
        title: "", location: "", price: "", images: "", description: "", bedrooms: "", bathrooms: "", amenities: ""
    })

    useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`https://property-rental-platform-backend.onrender.com/api/properties/${id}`);
        const data = response.data;

                // Safely convert images array to comma-separated string for the input field
                let imagesString = "";
                if (Array.isArray(data.images)) {
                    imagesString = data.images.join(", ");
                } else if (typeof data.images === "string") {
                    imagesString = data.images;
                } else if (data.image) {
                    imagesString = Array.isArray(data.image) ? data.image.join(", ") : data.image;
                }

                // Safely convert amenities array to comma-separated string
                let amenitiesString = "";
                if (Array.isArray(data.amenities)) {
                    amenitiesString = data.amenities.join(", ");
                } else if (typeof data.amenities === "string") {
                    amenitiesString = data.amenities;
                }
        setFormData({
                    title: data.title || "",
                    location: data.location || "",
                    price: data.price || "",
                    images: imagesString,
                    description: data.description || "",
                    bedrooms: data.bedrooms || "",
                    bathrooms: data.bathrooms || "",
                    amenities: amenitiesString
                });
        console.log(response.data)
      } catch (error) {
        console.error("Fetch Error :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id])
    
    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value
        })
       
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const token = localStorage.getItem("token");

        setLoading(true)

        try {
            setLoading(true)
            // Convert comma-separated images and amenities strings back into clean arrays before sending to backend
            const formattedData = {
                ...formData,
                images: formData.images.split(",").map(img => img.trim()).filter(img => img !== ""),
                amenities: formData.amenities.split(",").map(am => am.trim()).filter(am => am !== "")
            };
            await axios.put(`https://property-rental-platform-backend.onrender.com/api/properties/${id}`, formData, { headers: {Authorization :`Bearer ${token}`}})

            alert("Property Updated Successfully")
            navigate(`/property/${id}`)
            
        } catch (error) {
            console.error("Error Updating property:", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        } finally {
            setLoading(false)
        }

    }

    if (loading) return <Loader/>

    return (
        <div className='add-property-container'>
            <h2>Edit Your Property</h2>
            <form onSubmit={handleSubmit} className='property-form'>
                <input type='text' name='title' value={formData.title} placeholder='Property Title(e.g 2BHK Flat)' onChange={handleChange} required />
                <input type='text' name='price' value={formData.price} placeholder='Price' onChange={handleChange} required />
                <input type='text' name='location' value={formData.location} placeholder='Location' onChange={handleChange} required />
                {/* Images input allowing multiple URLs separated by commas */}
                <input type='text' name='images' value={formData.images} placeholder='Image URLs (comma separated)' onChange={handleChange} required />
                <small style={{ color: '#666', marginBottom: '10px' }}>Enter multiple image URLs separated by commas (,)</small>
                <textarea name='description' value={formData.description} placeholder='Description' onChange={handleChange} required></textarea>
                <input type='text' name='bedrooms' value={formData.bedrooms} placeholder='No. of Bedrooms' onChange={handleChange} required />
                <input type='text' name='bathrooms' value={formData.bathrooms} placeholder='No. of Bathrooms' onChange={handleChange} required />
                <input type='text' name='amenities' value={formData.amenities} placeholder='Amenities (e.g. WiFi, AC, Parking)' onChange={handleChange} />
                <small style={{ color: '#666', marginBottom: '10px' }}>Enter amenities separated by commas (,)</small>
                <button type='submit' className='submit-btn'>Edit Property</button>
            </form>
        </div>
    )
}

export default EditProperty