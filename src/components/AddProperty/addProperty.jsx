import { useEffect, useState } from 'react'
import axios from 'axios'
import "./addProperty.css"
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/loader'

const All_Amenities = [
    'WiFi',
    'Air Conditioning',
    'Parking',
    'Power Backup',
    'Gym',
    'Swimming Pool',
    'Security / CCTV',
    'Furnished'
]

const AddProperty = () => {
    const navigate = useNavigate()
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([])
    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        title: "", location: "", price: "", description: "", bedrooms: "", bathrooms: ""
    })

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false)
        }, 500)
        return () => clearTimeout(timer)
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {

            const newPreviews = files.map(file => URL.createObjectURL(file));

            setImageFiles(prevFiles => [...prevFiles, ...files])
            setImagePreviews(prevPreview => [...prevPreview, ...newPreviews])

            e.target.value = "";

            //const reader = new FileReader()
            // reader.onloadend = () => {
            //     setImagePreview(reader.result)
            // }
            // reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setImageFiles([]);
        setImagePreviews([]);
        document.getElementById("inputImage").value = "";
    }

    const handleAmenitySelect = (e) => {
        const value = e.target.value;
        if (value && !selectedAmenities.includes(value)) {
            setSelectedAmenities([...selectedAmenities, value])
        }
    }

    const removeAmenity = (amenityToRemove) => {
        setSelectedAmenities(selectedAmenities.filter(item => item !== amenityToRemove))
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
            data.append("price", Number(formData.price));
            data.append("description", formData.description);
            data.append("bedrooms", Number(formData.bedrooms));
            data.append("bathrooms", Number(formData.bathrooms));
            data.append("amenities", JSON.stringify(selectedAmenities))

            imageFiles.forEach((file) => {
                data.append("images", file)
            })

            // if (imageFiles) {
            //     data.append("image", imageFiles)
            // }

            const response = await axios.post("https://property-rental-platform-backend.onrender.com/api/properties", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    
                }
            })
            if (response.status === 201) {
                alert("Property Posted Successfully")
                navigate("/listings")
            }
        } catch (error) {
            console.error("Error posting property:", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        } finally {
            setLoading(false)
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
                {imagePreviews.length > 0 && (
                    <div className='preview-container'>
                        <p>Image Previews:</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                            {
                                imagePreviews.map((src, index) => (
                                    <img key ={index} src={src} alt={`Preview ${index}`} style={{ width: '200px', borderRadius: '10px', marginTop: '10px' }} />
                                ))
                            }
                        </div>
                        
                        <button
                            onClick={handleRemoveImage}
                            style={{
                                margin: "8px",
                                color: 'black',
                                borderWidth: '2px',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                padding: '5px 15px'
                            }}
                        >
                            Remove All Images
                        </button>
                    </div>)}
                <input type='file' id="inputImage" accept='image/*' placeholder='Image' multiple onChange={handleImageChange}/>
                <textarea name='description' placeholder='Description' onChange={handleChange} required></textarea>
                <input type='text' name='bedrooms' placeholder='No. of Bedrooms' onChange={handleChange} required />
                <input type='text' name='bathrooms' placeholder='No. of Bathrooms' onChange={handleChange} required />

                <div style={{ width: '100%', textAlign: 'left' }}>
                    <label style={{ fontWeight: '500', display: 'block', marginBottom: '5px' }}>Select Amenities:</label>
                    <select onChange={handleAmenitySelect} 
                        defaultValue=""
                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                        <option value="" disabled>Choose Amenities</option>
                        {All_Amenities.map((amenity) => (
                            <option key={amenity} value={amenity}>{amenity}</option>
                        ))}
                    </select>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                        {selectedAmenities.map((item) => (
                            <span key={item} style={{ background: '#e0f2fe', color: '#0369a1', padding: '5px 10px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                {item}
                                <button 
                                    type="button" 
                                    onClick={() => removeAmenity(item)} 
                                    style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer' }}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                    </div>
                </div>





                <button type='submit' className='submit-btn'>Post Property</button>
            </form>
        </div>
    )
}

export default AddProperty