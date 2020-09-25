const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages.js');
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users.js');
const app = express();

const server = http.createServer(app);

const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Chatname bot';
// run when a client connects
io.on('connection', socket => {
    socket.on('joinRoom' , ({username,room}) =>{
        
        console.log("okay");
        const user = userJoin(socket.id, username, room);
        
        socket.join(user.room);
        
        socket.emit('message', formatMessage("chatbot", 'welcome to the server'));

        // Broadcast when a user emits
        socket.broadcast.to(user.room).emit('message' , formatMessage("chatbot",`${username} has joined ${room}`));
    });
    console.log('New WS connection');

    // so the difference between socket and io is that they are different objects or different classes. The socket object
    // can diifferentiate between all the other socket connections and the socket connection it represents. while the io object does not know this
    // atleast that's my understanding

    // this is sent to the guy that has this connection
    // socket.emit('message', formatMessage(botName, 'welcome to the server'));

    // // Broadcast when a user emits
    // socket.broadcast.emit('message' , formatMessage(botName,'A user has joined'));

    // socket on disconnect is when the particular guy disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        // console.log(user);

        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
        }
    });

    // listen for chat message
    socket.on('chatMessage', (msg) =>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username,msg));
    });
})
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on ${PORT}`));

