const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const toggleVideoButton = document.getElementById('toggleVideo');
const toggleMicrophoneButton = document.getElementById('toggleMicrophone');

let localStream;
let peerConnection;
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
// Create and establish a WebRTC connection
async function createConnection() {
  peerConnection = new RTCPeerConnection();

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = event => {
      remoteVideo.srcObject = event.streams[0];
  };

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  // Send the offer to the other peer through your preferred signaling method
}

// Handle the answer from the other peer
async function handleAnswer(answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

// Handle incoming ice candidates
async function handleIceCandidate(candidate) {
  await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

async function sendMessage(message) {
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
    await createConnection();
};
