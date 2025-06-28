const socket = io('http://127.0.0.1:8000');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const audio = new Audio('ting.mp3');

// Append message to chat container
const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.appendChild(messageElement);

    if (position === 'left') {
        audio.play();
    }

    // Scroll to bottom
    messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Get user's name
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// Send message on form submit
form.addEventListener('submit', e => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message === "") return;

    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Receive when a user joins
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
});

// Receive message from others
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// User left the chat
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});
