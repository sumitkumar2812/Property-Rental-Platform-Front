import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./login.css"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()

  const handleLogin = async (e) => {
      e.preventDefault()

      try {
        const response = await axios.post("https://property-rental-platform-backend.onrender.com/api/auth/login",{email: email, password: password});

        localStorage.setItem("token", response.data.token)
        localStorage.setItem("role", response.data.role)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        alert("User Login Successfully")
        navigate("/")
        console.log(response.data)
      } catch (error) {
        alert("Error: " + error.response.data.message)
      }
  }


  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
      <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
      <button type="submit">Login</button>
      </form>
      </div>
    </div>
  )
}

export default Login