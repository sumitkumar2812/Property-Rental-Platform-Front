import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./signup.css"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("tenant")

  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post("https://property-rental-platform-backend.onrender.com/api/auth/signup", { name: name, email: email, mobile: mobile, password: password, role: role });
      alert("User Registered! Please Login")
      navigate("/login")
      console.log(response.data)
    } catch (error) {
      alert("Error: " + error.response.data.message)
    }
  }


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="mobile" placeholder="Mobile Number" onChange={(e) => setMobile(e.target.value)} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          <div>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="auth-card-role">
              <option value="tenant">I want to Rent (Tenent)</option>
              <option value="owner">I want to List Property (Owner)</option>
            </select>
          </div>
          <button type="submit">Register</button>
        </form>
        <p>Already have an Account <a href="/login">Login</a></p>
      </div>
    </div>
  )
}

export default Signup