
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAgP4a9wxWLlULUFgDGWvgGlKATCMGF4ms",
    authDomain: "vishnu-fe754.firebaseapp.com",
    projectId: "vishnu-fe754",
    storageBucket: "vishnu-fe754.appspot.com",
    messagingSenderId: "550301852931",
    appId: "1:550301852931:web:adfc896ad7d3497b5d7536",
    measurementId: "G-HTPCSZG2P2"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const messagesRef = ref(database, 'messages');


const chatWindow = document.getElementById('chat-window');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authBtn = document.getElementById('auth-btn');
const signupBtn = document.getElementById('signup-btn');
const authSection = document.getElementById('auth-section');
const logoutBtn = document.getElementById('logout-btn');
const newChatBtn = document.getElementById('new-chat-btn');
const chatapp= document.getElementById('Chat-app');


signupBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert('User registered successfully!');
            emailInput.value = '';
            passwordInput.value = '';
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
});


authBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            alert('User logged in successfully!');
            emailInput.value = '';
            passwordInput.value = '';
        })
        .catch((error) => {
            console.error(error);
            alert(error.message);
        });
});


logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        alert('User logged out successfully!');
    }).catch((error) => {
        console.error(error);
        alert(error.message);
    });
});


onAuthStateChanged(auth, (user) => {
    if (user) {
        authSection.style.display = 'none';
        chatWindow.style.display = 'block';
        messageInput.style.display = 'block';
        sendBtn.style.display = 'block';
        logoutBtn.style.display = 'block'; 
        newChatBtn.style.display = 'block'; 
        chatapp.style.display='block';
        
        loadMessages();
    } else {
        
        authSection.style.display = 'block';
        chatWindow.style.display = 'none';
        messageInput.style.display = 'none';
        sendBtn.style.display = 'none';
        logoutBtn.style.display = 'none'; 
        newChatBtn.style.display = 'none';
        chatapp.style.display='none'; 
    }
});


function loadMessages() {
    onChildAdded(messagesRef, (snapshot) => {
        const messageData = snapshot.val();
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-bubble', messageData.sender === auth.currentUser.email ? 'sent' : 'received');
        messageElement.textContent = `${messageData.sender}: ${messageData.message}`; 
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; 
    });
}


sendBtn.addEventListener('click', () => {
    const message = messageInput.value;
    const user = auth.currentUser; 

    if (message && user) {
        const messageData = {
            sender: user.email,
            message: message,
        };


        push(messagesRef, messageData);
        messageInput.value = ''; 
    }
});


newChatBtn.addEventListener('click', () => {
    chatWindow.innerHTML = ''; 
});
