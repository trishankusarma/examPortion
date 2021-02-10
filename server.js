const express = require("express");
const app = express();

const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');

const {  userJoin, getCurrentUser, removeUser, getUsersToRoom , removeUserByName } = require('./utils/joinUsers');

const sendMessage  = require('./utils/formatMessage');

require("dotenv").config();

app.use(express.urlencoded({extended:false}));
app.use(express.json());

const server = http.createServer(app);

const io = socketio(server);

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:true
})
const db=mongoose.connection;
db.on("error",(error)=>{
    console.error(error);
    process.exit(1);
})
db.once("open",()=>{
    console.log("Connected to MongoDB database");
})

io.on('connection',(socket)=>{
    console.log('Web sockets initiated');

    // a student or teacher enters a room by its room name
    socket.on('joinRoom',async ({ username , room })=>{

        let user = await removeUserByName(username,room);
       
        user = userJoin( socket.id , username , room );

        console.log(user);

        socket.join(user.room);

        socket.emit('message',sendMessage(`Admin`,`Best of Luck`));
    
        //a new student or teacher enters the class hall 
        socket.broadcast.to(user.room).emit("message",sendMessage(`Admin`,`${user.username} has joined`));

        const usersInroom = await getUsersToRoom(user.room);

        //get users to room
        io.to(user.room).emit("getUsersToRoom",{
           room : user.room,
           users : usersInroom
        }) 
    }) 

    //a student or teacher sends a message
    socket.on("sendMessage",async (message)=>{

        const user = await getCurrentUser(socket.id);

        if(user){
            io.to(user.room).emit("message",sendMessage(user.username,message));
        }
     });

     //a student or teacher leaves the exam hall
     socket.on('disconnect',async ()=>{

        const user = await getCurrentUser(socket.id);

        await removeUser(socket.id);
        
        if(user){
            io.to(user.room).emit('message',sendMessage('Admin',`${user.username} has left`));

            const usersInroom = await getUsersToRoom(user.room);

           //get users to room
           io.to(user.room).emit("getUsersToRoom",{
             room : user.room,
             users : usersInroom
           }) 
        } 
     })
})

const PORT = process.env.PORT;

const examRouter = require('./routers/exam');
const studentRouter = require('./routers/student');

app.use('/exam',examRouter);
app.use('/student',studentRouter);

server.listen(PORT , ()=>{
    console.log(`Server running at port ${PORT}`);
})