import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BiSend } from 'react-icons/bi';
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa"
import { BsRobot } from "react-icons/bs";
import { MdOutlineWbSunny } from "react-icons/md";
import { FaMoon } from "react-icons/fa";
import OpenAI from 'openai';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { chatRoute, historyRoute, logoutRoute, userRoute } from '../utils/APIRoutes';
import axios from 'axios';
import ChathistoryButton from '../components/ChathistoryButton';
import { createChat, fetchChat, fetchChatHistory, handleSubmit, handletheme, logout } from '../utils/functions';
import { FiChevronsRight } from "react-icons/fi";

import { FaX } from 'react-icons/fa6';
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const Chatbot = () => {
  const navigate = useNavigate()
  const [userQuery, setUserQuery] = useState('');
  const [botResponse, setBotResponse] = useState([]);
  const chatRef = useRef(null);
  const [typing, setIsTyping] = useState(false)
  const [chats, setChats] = useState([])
  const [theme, setTheme] = useState("dark")
  const [currChat, setCurrChat] = useState()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()

  // var chatbot = [{ role: "user", content: "what is pesticide" }, { role: "assistant", content: "Pesticides are substances that are used to control, repel, or kill pests such as insects, weeds, fungi, and rodents that can harm crops, livestock, and humans. They are commonly used in agriculture to protect crops from pests and diseases, thereby increasing crop yields and quality. Pesticides can come in various forms including sprays, powders, and baits. It is important to use pesticides responsibly and follow safety guidelines to minimize any negative impact on the environment and human health." }, { role: "user", content: "what is your name" }, { role: "assistant", content: "My name is AgroAi. I am here to assist you with any agricultural-related questions or information you may need. Feel free to ask me anything related to farming, gardening, livestock, or any other agriculture-related topic." }]
  const [chathist, setChathist] = useState([])

  const th = localStorage.getItem("theme")
  useEffect(() => {
    if (th) {
      setTheme(th)
    } else {
      localStorage.setItem("theme", "dark")
    }
  }, [th])


  const auth = localStorage.getItem("accessToken")
  console.log(auth)
  // useEffect(() => {
  //   if (!auth) {
  //     navigate("/signin")
  //   }
  // }, [auth, navigate])


  useEffect(() => {
    fetchChatHistory()
  }, [])


  useEffect(() => {
    fetchChat(currChat)
  }, [currChat])


  const createChat = async () => {
    try {
      const config = {
        headers: {
          Authorization:`Bearer ${auth}`
        }
      }
      const response = await axios.post(chatRoute,config, { withCredentials: true });
      fetchChatHistory()
      setCurrChat(chathist[0]._id)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchUser = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      }
      const response = await axios.get(userRoute,config, { withCredentials: true })
      setUser(response.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [auth])

  const handletheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
    localStorage.setItem("theme", theme)
  }

  const fetchChatHistory = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      }
      const response = await axios.get(historyRoute,config, { withCredentials: true })
      if (response) {
        setChathist(response.data.data)
        console.log(chathist,"igbj")
        setCurrChat(chathist?.[0]?._id)
        fetchChat(currChat)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const fetchChat = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      }
      const response = await axios.get(`${chatRoute}/${currChat}`,config, { withCredentials: true })
      if (response) {
        setChats(response.data.data.messages)
      }
    } catch (err) {
      console.log(err)
    }
  }, [currChat])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currChat) {
      console.log(userQuery)
      if (!userQuery) return;
      setIsTyping(true);

      const message = { role: "user", content: userQuery }


      // let msgs = chats;
      // msgs.push({ role: "user", content: userQuery });
      // console.log(msgs)
      // setChats(msgs);

      // // setMessage("");


      // openai.chat.completions
      //   .create({
      //     model: "gpt-3.5-turbo",
      //     messages: [
      //       { role: "system", content: "You are AgroAi a helpful and kind AI Agriculture Assistant" },
      //       message,
      //     ],
        //   }).withResponse()
      const data = {
        "prompt": userQuery
      }
      const api = "https://2222-34-168-67-121.ngrok-free.app/generateImageHritik"
      axios.post(api, data)
        .then((res) => {
          updateChat(currChat, userQuery, res.data.generated_image_encoded)
          fetchChat(currChat)
          setIsTyping(false);
          setUserQuery("")
          console.log(chats)
          console.log(res.data.choices[0].message.content);
        })
        .catch((e) => {
          console.log(e);
          setIsTyping(false);
        }).finally(() => {
          fetchChat(currChat)
        })
    }
    // Scroll to the bottom to show the latest message
    // scrollToBottom();
  };

  const logout = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      }
      const response = await axios.post(logoutRoute,config, { withCredentials: true });
      Cookies.remove("accessToken")
      navigate("/signin")
    } catch (err) {
      console.log(err)
    }
  }





  const updateChat = async (chatid, user,ai) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth}`
        }
      }
      const response = await axios.put(`${chatRoute}/${chatid}`,{user,ai},config, { withCredentials: true });

    } catch (err) {
      console.log(err)
    }
  }





  return (
    <div className={`${theme === "light" ? "bg-[#FFF]" : "bg-[#1F222A] text-white"} flex w-full h-[100vh] py-4 px-4`}>
      <div className='w-[20%]  flex-col justify-between hidden md:flex backdrop-blur-xl overflow-y-scroll no-scrollbar rounded-[12px]'>
        <div>
          <div onClick={createChat} className='flex justify-between p-2 px-4 items-center bg-[#17CE92] rounded-[12px] '>
            New Chat
            <div className='text-white'>
              <FaPlus />
            </div>
          </div>
          <div className='flex flex-col gap-3 my-4'>
            {chathist.length > 0 && chathist?.map((chat, index) => (
              <ChathistoryButton chat={chat} auth={auth} index={index} theme={theme} setCurrChat={(id) => setCurrChat(id)} fetchChatHistory={() => fetchChatHistory()} />
            ))}
          </div>
        </div>
        <button onClick={logout} className={`flex items-center flex-col justify-between px-4 p-2 mb-4 ${theme === "light" ? "bg-[#F5F5F5]" : "bg-[#35383F]"} border-[2px]  text-[#17CE92] border-[#17CE92] rounded-[12px] shadow-2xl`}>logout</button>
      </div>

      {open && <div className='w-[80%] z-[100] h-full flex gap-2  md:hidden justify-between absolute top-0 left-0  backdrop-blur-xl rounded-[12px] p-3'>
        <div className='w-full overflow-y-scroll no-scrollbar'>
          <div>
            <div onClick={createChat} className='flex justify-between p-4 items-center bg-[#17CE92] rounded-[12px] '>
              New Chat
              <div className='text-white'>
                <FaPlus />
              </div>
            </div>
            <div className='flex flex-col gap-3 my-4'>
              {chathist.length > 0 && chathist?.map((chat, index) => (
                <ChathistoryButton chat={chat} index={index} theme={theme} setCurrChat={(id) => setCurrChat(id)} fetchChatHistory={() => fetchChatHistory()} />
              ))}
            </div>
          </div>
          <button onClick={logout} className={`flex items-center flex-col justify-between px-4 p-2 mb-4 ${theme === "light" ? "bg-[#F5F5F5]" : "bg-[#35383F]"} border-[2px]  text-[#17CE92] border-[#17CE92] rounded-[12px] shadow-2xl`}>logout</button>

        </div>
        <div className='text-[24px] text-[#17CE92]' onClick={() => setOpen(false)}><FaX /></div>
      </div>}
      <div className="w-full md:w-[80%] flex items-center justify-center h-full ">
        <div className='w-full md:w-[80%] self-center flex flex-col h-full justify-between backdrop-blur-xl pb-4 rounded-[12px]'>
          <div className='flex items-center justify-between'>
            <div onClick={() => setOpen(true)} className='text-[24px] md:hidden text-[#17CE92] mr-4 '><FiChevronsRight /></div>
            <div className=' w-full rounded-[12px] text-[#17CE92] text-[24px] font-bold'>Hii {user?.name} 🙋‍♂️</div>
            <div onClick={handletheme} className='text-[#17CE92] text-[34px] font-bold cursor-pointer'>
              {theme === "dark" ? <MdOutlineWbSunny /> : <FaMoon />}
            </div>
          </div>
          <div className="flex flex-col gap-3 overflow-y-scroll no-scrollbar h-full mt-4">

            {chats?.map((message, index) => (
              <div
                key={index}
                className={`w-full rounded-[12px]   ${theme === "light" ? "bg-[#F5F5F5]" : "bg-[#35383F]"}`}
              >
                <div className={` w-full  rounded-[12px] p-4 bg-[#17CE92] text-[20px]`}><span className=' text-[24px] mr-4'>👨🏻</span>{message.user}</div>
                <div className={` p-4   `}><span className=' text-[24px] mr-4'>🤖</span>
                  <img className='w-200 h-200' src={message.ai} alt='img' />
                </div>
              </div>
            )) || <div className='flex flex-col justify-center items-center'> Create New Chat or Select old chats </div>}
            {typing && <div
              className={`w-full  self-start received rounded-[12px] p-4 ${theme === "light" ? "bg-[#F5F5F5]" : "bg-[#35383F]"}`}
            >
              <div className=' w-full self-end rounded-[12px] p-4 bg-[#17CE92] text-[20px]'><span className=' text-[24px] mr-4'>👨🏻</span>{userQuery}</div>
              <div className='p-4 flex  '>🤖 generating...</div>
            </div>}
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className={`flex justify-between items-center self-center w-full mt-3 p-2 ${theme === "dark" ? "bg-[#35383F]" : "bg-[#F5F5F5]"} rounded-[12px]`}>
            <input
              className={`w-full p-2 ${theme === "light" ? "bg-[#F5F5F5]" : "bg-[#35383F]"} rounded-[12px] focus:outline-none`}
              placeholder="Type your question..."
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
            <button type='submit' className="send-button text-[#17CE92] text-[28px]" disabled={typing}  ><BiSend /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
