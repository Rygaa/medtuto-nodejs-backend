const io=require('socket.io')(8900,{
    cors:{
        origin:'http://localhost:3003'
    }
});
let users=[]
const addUser=(userId,socketId)=>{
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
   const index=users.findIndex(u=>u.socketIds.includes(socketId))
   if(users[index] &&users[index].socketIds.length>0){
    users[index].socketIds.filter(id=>id!==socketId)
   }
   else{
       users.filter(user=>user!==users[index])
   }
}
const getUser=(userId)=>{
    return users.find(user=>user.userId===userId)
}

io.on("connection", (socket) => {
    console.log("a user has connected")
    
    socket.on('addUser',userId=>{
       
        addUser(userId,socket.id)
        
        io.emit("getUsers",users)
        
    })
    //send and receive messages
    socket.on('sendMessage',({senderId,receiverId,text})=>{
        const user=getUser(receiverId)
     //  user && io.to(user.socketId).emit('getMessage',{text,senderId})
     if(user){
        for(let id of user.socketIds){
            
            io.to(id).emit('getMessage',{text,senderId})
        }
        
     }
     const sender=getUser(senderId)
     if(sender){
        
        for(let id of sender.socketIds){
            if(id!==socket.id){
                io.to(id).emit('getMessage',{text,senderId})
            }
          
        }
    }
     
    })

    socket.on("disconnect",()=>{
        console.log("a user has disconnected")
        removeUser(socket.id)
        io.emit("getUsers",users)
        
    })
})