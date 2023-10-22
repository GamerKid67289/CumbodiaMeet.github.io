const APP_ID = "25540f7394b841d29dfe60b86c43a5eb"
const TOKEN = "007eJxTYJjt17nppU3GDg6mkImXnZ7u/+p/72zT0jbBJYd+3QsqevhTgcHI1NTEIM3c2NIkycLEMMXIMiUt1cwgycIs2cQ40TQ1SSjDJLUhkJHBdr0aKyMDBIL4HAzOpblJ+SmZiQwMAH+jInA="
const CHANNEL = "Cumbodia"

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
                        <div class="video-player" id="user-${UID}"></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0], localTracks[1])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    if (mediaType === 'video') {
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null) {
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio') {
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for (let i = 0; localTracks.length > i; i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted) {
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'
    } else {
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if (localTracks[1].muted) {
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    } else {
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

// Add the following code for the chat feature

// Get references to chat elements
const chatMessages = document.getElementById('chat-messages')
const chatInput = document.getElementById('chat-input')
const sendBtn = document.getElementById('send-btn')

// Function to send a chat message
let sendChatMessage = (message) => {
    const chatMessage = {
        sender: 'You', // Replace 'You' with the actual sender name
        message: message
    };

    displayChatMessage(chatMessage);

    // Here, you can send the message to other users via your video chat platform's API
    // Implement this part depending on your video chat platform
    // Replace the following line with the actual code to send the message.
    sendChatMessageToOtherUsers(chatMessage.message);
};

// Function to display a chat message in the chat interface
let displayChatMessage = (chatMessage) => {
    const messageDiv = document.createElement('div');
    messageDiv.innerText = `${chatMessage.sender}: ${chatMessage.message}`;
    chatMessages.appendChild(messageDiv);
};

// Event listener for sending a chat message
sendBtn.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== '') {
        sendChatMessage(message);
        chatInput.value = '';
    }
});

// ... Your existing code ...
