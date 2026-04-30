import { useEffect, useState } from 'react'
import axios from 'axios'
import "./addProperty.css"
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/loader'

const AddProperty = () => {
    const navigate = useNavigate()
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        title: "", location: "", price: "", image: "", description: "", bedrooms: "", bathrooms: ""
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
    }

    const handleChange = (e) => {
        const { name, value } = e.target
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

            const data = new FormData();

            data.append("title", formData.title);
            data.append("location", formData.location);
            data.append("price", formData.price);
            data.append("description", formData.description);
            data.append("bedrooms", formData.bedrooms);
            data.append("bathrooms", formData.bathrooms);

            if (imageFile) {
                data.append("image", imageFile)
            }

            const response = await axios.post("http://localhost:5000/api/properties", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            if (response.status === 201) {
                alert("Property Posted Successfully")
                navigate("/listings")
            }
        } catch (error) {
            console.error("Error posting property:", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        }
    }
    if (loading) return <Loader />

    return (
        <div className='add-property-container'>
            <h2>List Your Property</h2>
            <form onSubmit={handleSubmit} className='property-form'>
                <input type='text' name='title' placeholder='Property Title(e.g 2BHK Flat)' onChange={handleChange} required />
                <input type='text' name='price' placeholder='Price' onChange={handleChange} required />
                <input type='text' name='location' placeholder='Location' onChange={handleChange} required />
                {imagePreview && (
                    <div className='preview-container'>
                        <p>Image Preview:</p>
                        <img src={imagePreview} alt="Selected" style={{ width: '200px', borderRadius: '10px', marginTop: '10px' }} />
                        <button
                            onClick={handleRemoveImage}
                            style={{
                                marginLeft: "5px",
                                marginBottom: "5px",
                                color: 'black',
                                borderWidth: '2px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                padding: '5px 10px'
                            }}
                        >
                            X
                        </button>
                    </div>)}
                <input type='file' accept='image/*' placeholder='Image' onChange={handleImageChange} required />
                <textarea name='description' placeholder='Description' onChange={handleChange} required></textarea>
                <input type='text' name='bedrooms' placeholder='No. of Bedrooms' onChange={handleChange} required />
                <input type='text' name='bathrooms' placeholder='No. of Bathrooms' onChange={handleChange} required />
                <button type='submit' className='submit-btn'>Post Property</button>
            </form>
        </div>
    )
}

export default AddProperty