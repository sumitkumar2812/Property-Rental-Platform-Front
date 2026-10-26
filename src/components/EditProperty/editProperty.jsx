import { useEffect, useState } from 'react'
import axios from 'axios'
import "./editProperty.css"
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../Loader/loader'

const EditProperty = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState({
        title: "",
        location: "",
        price: "",
        description: "",
        bedrooms: "",
        bathrooms: ""
    })

    // State for managing existing images (URLs from DB)
    const [existingImages, setExistingImages] = useState([])

    // State for managing newly selected files from device
    const [newImageFiles, setNewImageFiles] = useState([])

    // State for amenities
    const [amenitiesList, setAmenitiesList] = useState([])
    const [newAmenityInput, setNewAmenityInput] = useState("")

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const response = await axios.get(`https://property-rental-platform-backend.onrender.com/api/properties/${id}`);
                const data = response.data;

                setFormData({
                    title: data.title || "",
                    location: data.location || "",
                    price: data.price || "",
                    description: data.description || "",
                    bedrooms: data.bedrooms || "",
                    bathrooms: data.bathrooms || ""
                });

                // Load existing images array
                if (Array.isArray(data.images)) {
                    setExistingImages(data.images);
                } else if (data.image) {
                    setExistingImages(Array.isArray(data.image) ? data.image : [data.image]);
                }

                // Load existing amenities array
                if (Array.isArray(data.amenities)) {
                    setAmenitiesList(data.amenities);
                } else if (typeof data.amenities === "string") {
                    setAmenitiesList(data.amenities.split(",").map(i => i.trim()).filter(Boolean));
                }

            } catch (error) {
                console.error("Fetch Error :", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProperty()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // Remove existing image from the list
    const handleRemoveExistingImage = (indexToRemove) => {
        setExistingImages(existingImages.filter((_, index) => index !== indexToRemove));
    }

    // Handle new file selections from device
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImageFiles((prevFiles) => [...prevFiles, ...files]);
    }

    // Remove newly selected file before upload
    const handleRemoveNewFile = (indexToRemove) => {
        setNewImageFiles(newImageFiles.filter((_, index) => index !== indexToRemove));
    }

    // Amenity handlers
    const handleAddAmenity = () => {
        if (newAmenityInput.trim() !== "") {
            setAmenitiesList([...amenitiesList, newAmenityInput.trim()]);
            setNewAmenityInput("");
        }
    }

    const handleRemoveAmenity = (indexToRemove) => {
        setAmenitiesList(amenitiesList.filter((_, index) => index !== indexToRemove));
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem("token");
        setLoading(true)

        try {
            // Using FormData to send text data, remaining existing images, and new file uploads together
            const data = new FormData();
            data.append("title", formData.title);
            data.append("location", formData.location);
            data.append("price", formData.price);
            data.append("description", formData.description);
            data.append("bedrooms", formData.bedrooms);
            data.append("bathrooms", formData.bathrooms);

            // Append existing images so backend knows which ones to keep
            existingImages.forEach((imgUrl) => {
                data.append("existingImages", imgUrl);
            });

            // Append newly uploaded local image files
            newImageFiles.forEach((file) => {
                data.append("images", file); // Matches multer field name 'images'
            });

            // Append amenities array elements
            amenitiesList.forEach((amenity) => {
                data.append("amenities", amenity);
            });

            await axios.put(`https://property-rental-platform-backend.onrender.com/api/properties/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })

            alert("Property Updated Successfully")
            navigate(`/property/${id}`)

        } catch (error) {
            console.error("Error Updating property:", error);
            alert("Error: " + (error.response?.data?.message || "Something went wrong"));
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader />

    return (
        <div className='add-property-container'>
            <h2>Edit Your Property</h2>
            <form onSubmit={handleSubmit} className='property-form'>
                <input type='text' name='title' value={formData.title} placeholder='Property Title' onChange={handleChange} required />
                <input type='number' name='price' value={formData.price} placeholder='Price' onChange={handleChange} required />
                <input type='text' name='location' value={formData.location} placeholder='Location' onChange={handleChange} required />

                {/* 1. EXISTING IMAGES PREVIEW & REMOVE SECTION */}
                <div style={{ margin: '10px 0', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Current Images:</label>
                    {existingImages.length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#777' }}>No images currently uploaded.</p>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {existingImages.map((imgUrl, idx) => (
                                <div key={idx} style={{ position: 'relative', width: '80px', height: '80px' }}>
                                    <img src={imgUrl} alt="property" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ccc' }} />
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveExistingImage(idx)}
                                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 2. UPLOAD NEW FILES FROM DEVICE SECTION */}
                <div style={{ margin: '10px 0', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Add New Images from Device:</label>
                    <input
                        type='file'
                        multiple
                        accept='image/*'
                        onChange={handleFileChange}
                        style={{ marginBottom: '10px' }}
                    />

                    {newImageFiles.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                            {newImageFiles.map((file, idx) => (
                                <div key={idx} style={{ position: 'relative', background: '#f1f5f9', padding: '5px 10px', borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                    <span>{file.name}</span>
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveNewFile(idx)}
                                        style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <textarea name='description' value={formData.description} placeholder='Description' onChange={handleChange} required></textarea>

                <input type='number' name='bedrooms' value={formData.bedrooms} placeholder='No. of Bedrooms' onChange={handleChange} required />
                <input type='number' name='bathrooms' value={formData.bathrooms} placeholder='No. of Bathrooms' onChange={handleChange} required />

                {/* 3. AMENITIES MANAGEMENT SECTION */}
                <div style={{ margin: '10px 0', border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '8px' }}>Manage Amenities:</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        <input
                            type='text'
                            value={newAmenityInput}
                            placeholder='Add amenity (e.g. WiFi)'
                            onChange={(e) => setNewAmenityInput(e.target.value)}
                            style={{ flex: 1, padding: '8px' }}
                        />
                        <button type='button' onClick={handleAddAmenity} style={{ padding: '8px 15px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {amenitiesList.map((amenity, idx) => (
                            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0369a1', padding: '5px 10px', borderRadius: '20px', fontSize: '13px' }}>
                                {amenity}
                                <button type='button' onClick={() => handleRemoveAmenity(idx)} style={{ background: 'transparent', border: 'none', color: '#0369a1', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>&times;</button>
                            </span>
                        ))}
                    </div>
                </div>

                <button type='submit' className='submit-btn'>Update Property</button>
            </form>
        </div>
    )
}

export default EditProperty