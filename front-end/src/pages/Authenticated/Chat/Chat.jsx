import axios from 'axios'
import{io} from 'socket.io-client'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import ChatOnline from '../../../components/ChatOnline/ChatOnline'
import Conversation from '../../../components/Conversation/Conversation'
import Message from '../../../components/Message/Message'
import './chat.css'
import SearchContact from '../../../components/SearchContact/SearchContact'
 const Chat=()=> {
     const user = useSelector((state) => state.user);
    const[conversations,setConversations]=useState([])
    const[currentConversation,setCurrentConversation]=useState(null)
    const[messages,setMessages]=useState([])
    const[newMessage,setNewMessage]=useState('')
    const[arrivalMessage,setArrivalMessage]=useState(null)
    const [onlineConversations, setOnlineConversations] = useState([])
    const [displayChatBox, setDisplayChatBox] = useState(false)
    const socket = useRef()
    const scrollRef=useRef()

    
    
    useEffect(() => {
       socket.current=io('ws://localhost:8900')
      socket.current.on('getMessage',data=>{
           setArrivalMessage({
               sender:data.senderId,
               text:data.text,
               createdAt:Date.now()
           })
       })
       return ()=>{
           socket.off()
       }
    }, [])
    
    useEffect(() => {
        socket.current.on('server starts',()=>{
            socket.current.emit('addUser',user.pubId)
        })
       
       socket.current.on('getUsers',users=>{
           //onlineUsers is for excluding current user from other online users
           const onlineUsers=users.filter(u=>u.userId!==user.pubId)
           setOnlineConversations(conversations.filter(conv=>onlineUsers.some(user=>conv.members.includes(user.userId))))
       })
    }, [user,conversations])

    useEffect(() => {
        arrivalMessage && currentConversation?.members.includes(arrivalMessage.sender) &&
        setMessages(prev=>[...prev,arrivalMessage])
     }, [arrivalMessage,currentConversation])

    useEffect(()=>{       
        const getConversations=async()=>{
            try{
                const res=await axios.get('http://localhost:3005/api/conversations/'+user.pubId)
                setConversations(res.data)
            } 
            catch(err){
                console.log(err)
            }   
        }
        getConversations()
    },[user.pubId])
   
   
    useEffect(() => {
       const getMessages=async()=>{
           try{
               const res=await axios.get('http://localhost:3005/api/messages/'+currentConversation.pubId)
              
                setMessages(res.data)
            }
            catch(err){
                console.log(err)
            }
       }
      currentConversation && getMessages()
       
        
    }, [currentConversation])

   /*useEffect(() => {
     conversations && currentConversation &&  conversations.forEach(c=>{
           console.log(c.pubId ,currentConversation.pubId)
           console.log(c.pubId===currentConversation.pubId)
           console.log(c===currentConversation)
       })
   }, [conversations,currentConversation])*/
    
    
    const handleSubmit=async(e)=>{
        e.preventDefault()
        const message={
            sender:user.pubId,
            text:newMessage,
            conversationId:currentConversation.pubId
        }
        const receiverId=currentConversation?.members.find(member=>member!==user.pubId)
        socket.current.emit('sendMessage',{
            senderId:user.pubId,
            receiverId,
            conversationId:currentConversation.pubId,
            text:newMessage
        })
        try{
           const res=await axios.post('http://localhost:3005/api/messages',message)
           setMessages([...messages,res.data])
           setNewMessage('')
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
      scrollRef.current?.scrollIntoView({behavior:'smooth'})
       
    }, [messages])

    return (
        <div className="messenger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                    <SearchContact setDisplayChatBox={setDisplayChatBox}/>
                    
                    {user && conversations.map((c,i)=>(
                        <div key={i} className="test" onClick={()=>{setCurrentConversation(c)}}>
                        <Conversation  conversation={c} currentUser={user} 
                        socket={socket.current}  
                        currentConversation={currentConversation}></Conversation>
                       </div>
                        //currentConversation?.pubId===c?.pubId? null: 
                    ))}
                    
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {(currentConversation||displayChatBox)? 
                   ( <>
                        <div className="chatBoxTop">
                            {
                                 messages?.map((m,i)=>(
                                     <div ref={scrollRef}>
                                    <Message key={i} own={m.sender===user.pubId} message={m} vu={m===messages[messages.length-1]&&m.status==="seen"} />
                                    </div>
                   ))
                            }
                        
                       
                    </div>
                    <div className="chatBoxBottom">
                        <textarea  className="chatMessageInput" 
                        placeholder="ecrivez votre message ..." 
                        onChange={(e)=>{setNewMessage(e.target.value)} } 
                        value={newMessage}></textarea>
                        
                        <button className="chatSubmitButton" 
                        onClick={handleSubmit}>   Envoyer   </button>
                    </div>
                    </>):(<span className="noConversation">Choisissez une conversation</span>)}
                    
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    {/* <ChatOnline 
                    onlineUsers={onlineUsers} 
                    currentId={user.pubId} s
                    etCurrentConversation={setCurrentConversation}/> */}
                    {user && onlineConversations.map((c,i)=>(
                        <div key={i} onClick={()=>setCurrentConversation(c)}>
                        <Conversation  conversation={c} currentUser={user} online={true} ></Conversation>
                       </div>
                        
                    ))}
                </div>
            </div>
            
        </div>
    )
}
export default Chat;
