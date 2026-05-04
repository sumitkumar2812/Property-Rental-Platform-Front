import React from 'react'
import { useState } from 'react'
import Loader from '../Loader/loader'
import axios from "axios"
import { useEffect } from 'react';

const MyProperties = () => {
    const [myProps, setMyProps] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchMyProps = async () => {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:5000/api/properties/myproperties", {
                headers:{Athorization :`Bearer ${token}`}
            });
            setMyProps(response)
        } 
        fetchMyProps
    },[]);
 
  return (
    <div className='my-property-container'>
        <h2>My Listed Properties</h2>
        <div className='property-list'>
            {loading ? <Loader /> : (<div className='listings-container'>
                    {myProps.length > 0 ? (myProps.map((item) => (
                      <div className='property-card' key={item._id}>
                        <img src={item.image} alt={item.title} loading='lazy' />
                        <div className='card-details'>
                          <h3>{item.title}</h3>
                          <p className='loc'>{item.location}</p>
                          <p className='price'>₹{item.price} <span>/Month</span></p>
                          <Link to={`/property/${item._id}`}>
                            <button className='details-btn'>View Details</button>
                          </Link>
                        </div>
                      </div>))
                    ) : (<div>There is no properties in this Location</div>)}
                  </div>)}
        </div>
    </div>
  )
}

export default MyProperties