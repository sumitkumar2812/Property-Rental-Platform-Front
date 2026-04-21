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
        title: "", location: "", price: "", image: "", description: "", bedrooms: "", bathrooms: ""
    })

    useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setFormData(response.data)
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
            await axios.put(`http://localhost:5000/api/properties/${id}`, formData, { headers: {Authorization :`Bearer ${token}`}})

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
                <input type='text' name='image' value={formData.image} placeholder='Image URL' onChange={handleChange} required />
                <textarea name='description' value={formData.description} placeholder='Description' onChange={handleChange} required></textarea>
                <input type='text' name='bedrooms' value={formData.bedrooms} placeholder='No. of Bedrooms' onChange={handleChange} required />
                <input type='text' name='bathrooms' value={formData.bathrooms} placeholder='No. of Bathrooms' onChange={handleChange} required />
                <button type='submit' className='submit-btn'>Edit Property</button>
            </form>
        </div>
    )
}

export default EditProperty