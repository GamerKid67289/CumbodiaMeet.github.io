const localVideo = document.getElementById('localVideo');
const remoteVideoContainer = document.getElementById('remoteVideoContainer');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const toggleVideoButton = document.getElementById('toggleVideo');
const toggleMicrophoneButton = document.getElementById('toggleMicrophone');

let localStream;
let peerConnections = {};
let isVideoEnabled = true;
let isMicrophoneEnabled = true;

async function getMediaStream() {
    try {
        const constraints = { video: isVideoEnabled, audio: isMicrophoneEnabled };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStream = stream;
        localVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

async function createConnection(targetSocketId) {
    const peerConnection = new RTCPeerConnection();
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            sendIceCandidate(targetSocketId, event.candidate);
        }
    };

    peerConnection.ontrack = event => {
        const remoteVideo = document.createElement('video');
        remoteVideo.srcObject = event.streams[0];
        remoteVideo.autoplay = true;
        remoteVideoContainer.appendChild(remoteVideo);
    };

    peerConnection.ondatachannel = event => {
        const dataChannel = event.channel;
        setupDataChannel(dataChannel, targetSocketId);
    };

    // Create an offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    sendOffer(targetSocketId, offer);
    peerConnections[targetSocketId] = peerConnection;
}

async function handleAnswer(targetSocketId, answer) {
    await peerConnections[targetSocketId].setRemoteDescription(new RTCSessionDescription(answer));
}

async function handleIceCandidate(targetSocketId, candidate) {
    await peerConnections[targetSocketId].addIceCandidate(new RTCIceCandidate(candidate));
}

function sendOffer(targetSocketId, offer) {
    // Simulate sending offer through an HTTP request
    // In a real-world scenario, use your preferred server for signaling
}

function sendIceCandidate(targetSocketId, candidate) {
    // Simulate sending ICE candidate through an HTTP request
    // In a real-world scenario, use your preferred server for signaling
}

function sendMessage(message) {
    // Simulate sending a message by appending it to the chatMessages div
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatMessages.appendChild(messageElement);
}

sendButton.addEventListener('click', () => {
    const message = chatInput.value;
    if (message.trim() !== '') {
        sendMessage(message);
        chatInput.value = '';
    }
});

toggleVideoButton.addEventListener('click', () => {
    isVideoEnabled = !isVideoEnabled;
    getMediaStream();
});

toggleMicrophoneButton.addEventListener('click', () => {
    isMicrophoneEnabled = !isMicrophoneEnabled;
    getMediaStream();
});

// Set up the media stream when the page loads
window.onload = async () => {
    await getMediaStream();
    // Connect to peers here (based on your signaling method)
};
