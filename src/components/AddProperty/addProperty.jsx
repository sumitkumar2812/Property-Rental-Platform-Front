import { useState } from 'react'
import axios from 'axios'
import "./addProperty.css"
import {useNavigate } from 'react-router-dom'

const AddProperty = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "", location: "", price: "", image: "", description: "", category: "House", bedrooms: "", bathrooms: ""
    })

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

        try {
            const response = await axios.post("http://localhost:5000/api/properties", formData, { headers: {Authorization :`Bearer ${token}`}})

            if (response.status === 201) {
                alert("Property Posted Successfully")
                navigate("/listings")
            }
        } catch (error) {
            console.error("Error posting property:", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        }

    }

    return (
        <div className='add-property-container'>
            <h2>List Your Property</h2>
            <form onSubmit={handleSubmit} className='property-form'>
                <input type='text' name='title' placeholder='Property Title(e.g 2BHK Flat)' onChange={handleChange} required />
                <input type='text' name='price' placeholder='Price' onChange={handleChange} required />
                <input type='text' name='location' placeholder='Location' onChange={handleChange} required />
                <input type='text' name='image' placeholder='Image URL' onChange={handleChange} required />
                <textarea name='description' placeholder='Description' onChange={handleChange} required></textarea>
                <input type='text' name='bedrooms' placeholder='No. of Bedrooms' onChange={handleChange} required />
                <input type='text' name='bathrooms' placeholder='No. of Bathrooms' onChange={handleChange} required />
                <button type='submit' className='submit-btn'>Post Property</button>
            </form>

        </div>
    )
}

export default AddProperty