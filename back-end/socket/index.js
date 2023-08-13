const io=require('socket.io')(8900,{
    cors:{
        origin:'http://localhost:3003'
    }
});
let users=[]
const addUser=(userId,socketId)=>{console.log('add user fireed')
   // !users.some(user=>userId===user.userId) &&users.push({userId,socketId})
   const user=users.find(user=>userId===user.userId)
   if(user){
       if(!user.socketIds.includes(socketId)){
        const index=users.indexOf(user)
       users[index].socketIds.push(socketId)
       }
       
   }
   else{
       users.push({userId,socketIds:[socketId]})
   }
}
const removeUser=(socketId)=>{
   // users=users.filter(user=>user.socketId!==socketId)
   console.log('remove fires')
   const index=users.findIndex(u=>u.socketIds.includes(socketId))
   if(users[index] &&users[index].socketIds.length>0){
       console.log(users[index].socketIds.length)
       console.log('inside if')
       
       users[index].socketIds=users[index].socketIds.filter(id=>id!==socketId)

   if(users[index].socketIds.length===0){
       users=users.filter(user=>user!==users[index])
   }
   }
   else{
       console.log('inside else')
       users.filter(user=>user!==users[index])
   }
}
const getUser=(userId)=>{
    return users.find(user=>user.userId===userId)
}

io.on("connection", (socket) => {
    console.log("a user has connected")
    io.emit('server starts')
    socket.on('addUser',userId=>{
       
        addUser(userId,socket.id)
        
        io.emit("getUsers",users)
        console.log(users)
    })
    //send and receive messages
    socket.on('sendMessage',({senderId,receiverId,conversationId,text})=>{
        const user=getUser(receiverId)
     //  user && io.to(user.socketId).emit('getMessage',{text,senderId})
     if(user){console.log(user.socketIds)
        for(let id of user.socketIds){
            console.log('id is ',id)
            io.to(id).emit('getMessage',{text,senderId,conversationId})
        }
        
     }
     const sender=getUser(senderId)
     if(sender){
        
        for(let id of sender.socketIds){
            if(id!==socket.id){
                io.to(id).emit('getMessage',{text,senderId,conversationId})
            }
          
        }
    }
     
    })

    socket.on("disconnect",()=>{
        console.log("a user has disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)
        console.log(users)
    })
})