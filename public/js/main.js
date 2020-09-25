const chatForm = document.getElementById('chat-form');
const ChatMessages = document.querySelector('.chat-messages');
const socket = io();

// Get username and romm
const {username , room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
});

socket.emit('joinRoom', { username,room });

// message from server
socket.on('message', message => {
    // console.log(message);
    outputmessage(message);

    //scroll down 
    ChatMessages.scrollTop = ChatMessages.scrollHeight;
})

// on submission of form
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // console.log(msg);
    socket.emit('chatMessage', msg);
    e.target.elements.msg.value = "";
    e.target.elements.msg.value.focus();
})


// Output mesage to DOM
function outputmessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}