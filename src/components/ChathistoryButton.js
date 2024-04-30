import React, { useState } from 'react'
import { chatRoute } from '../utils/APIRoutes'
import { TiTick } from "react-icons/ti";
import { FaXmark } from "react-icons/fa6";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa"
import axios from 'axios';
import Cookies from 'js-cookie';

const ChathistoryButton = ({ chat, index, theme, setCurrChat, fetchChatHistory, }) => {
   const [edit, setEdit] = useState(false)
   const [title, setTitle] = useState("")

   const auth = Cookies.get("accessToken")
   const updateChatTitle = async (chatid) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${auth}`
            }
         }
         const response = await axios.patch(`${chatRoute}/${chatid}`,{title },config,  { withCredentials: true });
         setEdit(false)
         fetchChatHistory()
      } catch (err) {
         console.log(err)
      }
   }

   const deleteChat = async (chatid) => {
      try {
         const config = {
            headers: {
               Authorization: `Bearer ${auth}`
            }
         }
         const response = await axios.delete(`${chatRoute}/${chatid}`,config, { withCredentials: true });
         fetchChatHistory()
      } catch (err) {
         console.log(err)
      }
   }

   return (
      <button key={index} onClick={() => setCurrChat(chat._id)} className={`flex items-center justify-between px-4 p-4 ${theme === "light" ? "bg-[#F5F5F5]" : "bg-[#35383F]"}  rounded-[12px] shadow-2xl`}>
         <button >
            {edit ? <input className='bg-transparent focus:outline-none' type='text' placeholder='Title' onChange={(e) => setTitle(e.target.value)} /> : chat.title}
         </button>
         <div className='text-[#17CE92] text-[24px]'>
            {edit ?
               <div className='flex gap-2'>
                  <button onClick={() => updateChatTitle(chat._id)}>
                     <TiTick />
                  </button>
                  <button onClick={() => setEdit(false)}>
                     <FaXmark />
                  </button>
               </div>

               : <div className='flex gap-2'> <button onClick={() => setEdit(true)}>
                  <FaEdit />
               </button>
                  <button onClick={() => deleteChat(chat._id)}>
                     <FaTrash />
                  </button></div>}

         </div>
      </button>
   )
}

export default ChathistoryButton