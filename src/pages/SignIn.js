import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
// import { signinRoute } from "../utils/APIRoutes";
// import MessageLoading from '../components/MessageLoading';
// import { isAuth } from '../utils/Utils'
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import Cookies from 'js-cookie';
import { loginRoute } from '../utils/APIRoutes';

const SignIn = () => {
   const navigate = useNavigate();
   const [values, setValues] = useState({
      email: "",
      password: "",
   });
   const [loading, setLoading] = useState(false)
   const [message, setMessage] = useState(null)
   const [theme, setTheme] = useState("dark")
   const [primary, setPrimary] = useState()
   const [secondary, setSecondary] = useState()

   const th = localStorage.getItem("theme")
   useEffect(() => {
      if (th) {
         setTheme(th)
      } else {
         localStorage.setItem("theme", "dark")
      }
   }, [th])

   const auth = Cookies.get("accessToken")
   useEffect(() => {
      if (auth) {
         navigate("/")
      }
   }, [auth, navigate])

   const handletheme = () => {
      if (theme === "dark") {
         setTheme("light")
      } else {
         setTheme("dark")
      }
      localStorage.setItem("theme", theme)
   }

   const handleSubmit = async () => {
      setLoading(true)
      try {
         const { email, password } = values;
         const response = await axios.post(loginRoute, values, { withCredentials: true });
         navigate("/")
         setLoading(false)
         if (response) {
            Cookies.set("accessToken", response.data.data.accessToken)
            localStorage.setItem("accessToken", response.data.data.accessToken)
            console.log(response)
         } else {
            setMessage(response?.data)
            setTimeout(() => {
               setMessage(null)
            }, 5000)
         }
      } catch (err) {
         console.log(err)
      }
   };

   const handleChange = (event) => {
      setValues({ ...values, [event.target.name]: event.target.value });
   };
   return (
      <div className={`${theme === "dark" ? "bg-[#1F222A] text-white " : "bg-[#FFF]"} flex items-center justify-between h-screen gap-3 px-4 `}>
         <div className={` flex flex-col justify-center items-center w-full md:w-[50%] `}>
            <div onClick={handletheme} className='text-[#17CE92] text-[34px] font-bold cursor-pointer absolute top-5 left-5 '>
               {theme === "light" ? <MdOutlineWbSunny /> : <FaMoon />}
            </div>
            <div className={` flex flex-col p-10 ${theme === "dark" ? "bg-[#35383F]" : "bg-[#F5F5F5]"} rounded-2xl backdrop-blur-xl shadow-[0_3px_10px_rgb(0,0,0,0.2)] gap-3 w-full sm:w-[70%] `}>
               <div className="text-xl text-center mb-4">User Login</div>
               <div className="flex flex-col">
                  <label className="text-sm mb-1" >Email</label>
                  <input
                     className="p-2 text-black rounded-lg focus:outline-none"
                     type="email"
                     placeholder="Email"
                     name="email"
                     value={values.email}
                     onChange={(e) => handleChange(e)}
                  />
               </div>
               <div className="flex flex-col">
                  <label className="text-sm mb-1" >Password</label>
                  <input
                     className="p-2 text-black rounded-lg focus:outline-none"
                     type="password"
                     placeholder="Password"
                     name="password"
                     value={values.password}
                     onChange={(e) => handleChange(e)}
                  />
               </div>
               <button className="h-10 bg-[#17CE92] rounded-lg shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] shadow-[#17CE92] " onClick={handleSubmit}>UserLogin</button>
               <Link to={"/signup"} className='self-end mt-2'>Click to Create Account</Link>
               {/* <MessageLoading loading={loading} message={message} /> */}
            </div>
         </div>
         <div className="h-full top-0 right-0 flex-col items-center justify-center fixed w-[50%] bg-[#17CE92] hidden md:flex ">
            <img className="h-[50%] w-[50%]" src={require("../image.png")} alt="hero" />
         </div>
      </div>
   )
}

export default SignIn