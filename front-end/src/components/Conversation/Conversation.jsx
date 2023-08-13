import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import './conversation.css'
import{io} from 'socket.io-client'
export default function Conversation({conversation,currentUser,online,socket,currentConversation}) {
    //user here is the correspondant
    const [user, setUser] = useState(null)
    const [insocket, setInsocket] = useState(socket)
    const [unseenMessageNum, setUnseenMessageNum] = useState(0)
    const [displayUnseen, setDisplayUnseen] = useState(true)

    useEffect(() => {
       
        insocket?.on('getMessage',data=>{
            
           if(conversation.pubId===data.conversationId && data.senderId!==currentUser.pubId){
            
            setUnseenMessageNum(prev=>prev+1)
           }
                    
        })
       return ()=>{
           setInsocket(null)
       }
    }, [socket])
    useEffect(() => {
        if(currentConversation?.pubId!==conversation.pubId){
            setDisplayUnseen(true)
        }
    }, [currentConversation])
   // let buffer;
    useEffect(() => {
        const correspondantId=conversation.members.find(m=>m !==currentUser.pubId)
        
        const getCorrespondant=async()=>{
            try{
               const res=await axios.get('http://localhost:3005/api/users?userId='+correspondantId)
                setUser(res.data)
                 //buffer = Buffer.from( new Uint8Array(res.data.picture.data) );
               // console.log(typeof buffer)
            }

            catch(err){
                console.log(err)
            }
           
        }
        getCorrespondant()
    }, [currentUser,conversation])
    
   useEffect(() => {
    const getUnseenMessages=async()=>{
        try{
            const res=await axios.get('http://localhost:3005/api/messages/'+conversation.pubId)
           
             for(let message of res.data){
                 console.log(message.status)
                 if (message.status==="not seen"){
                    setUnseenMessageNum(prev=>prev+1)
                 }
             }

         }
         catch(err){
             console.log(err)
         }
    }
         !online && conversation && getUnseenMessages()
        
         
     }, [conversation])
     const toggleUnseen=async()=>{
         
         try{
            const res=await axios.put('http://localhost:3005/api/messages/'+conversation.pubId,{currentId:currentUser.pubId})
            setUnseenMessageNum(prev=>prev-prev)
            setDisplayUnseen(false)
        }
         catch(err){
             console.log(err)
         }
     }
    return (
        
        <div className="conversation" onClick={toggleUnseen}>
            {user && <>
            <div className="imageContainer">
            <img src="https://via.placeholder.com/350x150"  alt="conversation image" className="conversationImage" />
            { online &&<div className="chatOnlineBadge"></div>}
            </div>
            
            <span className="conversationName">{user.username}</span>
           {unseenMessageNum>0 && !online&& <span className="unssen">{unseenMessageNum} nouveaux messages</span>}
        </>  }           
        </div>
    )
}
//src="https://via.placeholder.com/350x150"
//src={"data:image/png;base64,"+buffer?.toString('base64')}