const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const remoteVideosContainer = document.getElementById("remoteVideos"); // Add this line
const startButton = document.getElementById("startButton");
const hangupButton = document.getElementById("hangupButton");
const toggleCameraButton = document.getElementById("toggleCameraButton");
let localStream;
let remoteStream;
let pc1;
let pc2;
let pc3; // Add more peer connections as needed
let isCameraOn = true;

startButton.addEventListener("click", startCall);
hangupButton.addEventListener("click", hangupCall);
toggleCameraButton.addEventListener("click", toggleCamera);

async function startCall() {
    startButton.disabled = true;
    hangupButton.disabled = false;
    toggleCameraButton.disabled = false;

    // ... (previous code)

    // Create peer connections for each participant
    participants["self"] = pc1;
    participants["participant1"] = pc2;
    participants["participant2"] = pc3; // Add more participants as needed

    // ... (previous code)
}

// Function to handle remote stream and display in a remote video element
function handleRemoteStream(stream, participantId) {
    const remoteVideoElement = document.createElement("video");
    remoteVideoElement.id = `remoteVideo_${participantId}`;
    remoteVideoElement.autoplay = true;
    remoteVideoElement.srcObject = stream;
    remoteVideosContainer.appendChild(remoteVideoElement);
}

// ... (previous code)
