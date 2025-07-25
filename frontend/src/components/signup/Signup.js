import React,{useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Register() {
  const [form,setForm] = useState({});
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignupChange = (e) =>{
      let {name,value}= e.target;
      setForm({...form, [name]: value})  
  }
  const handleOnSubmit = async(e)=>{
    e.preventDefault();
    setError("");
      try{
        const response = await fetch("https://node-ecart-2.onrender.com/api/auth/register",
           {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
           },
           body: JSON.stringify({ fullName: form.fullName, email: form.email, password: form.password })
           }

        );
        const data= await response.json();
       
          if (!response.ok) {
            setError(data.error || "Registration failed");
          } 
          else {
            console.log("user is added succesful");
            setForm({});
            navigate("/login");
          }
      }
      catch(err){
        setError("Something went wrong. Try again later.");
      }
  }
  console.log(form);
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://t4.ftcdn.net/jpg/02/32/16/07/360_F_232160763_FuTBWDd981tvYEJFXpFZtolm8l4ct0Nz.jpg')",
    }}
    >
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Register</h2>
        <form className="space-y-4" onSubmit={handleOnSubmit}>
          <input
            onChange={handleSignupChange}
            name= "fullName"
            type="text"
            value={form.fullName || ""}
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={handleSignupChange}
            name= "email"
            type="email"
            value={form.email || ""}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            onChange={handleSignupChange}
            name= "password"
            type="password"
            value={form.password || ""}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
