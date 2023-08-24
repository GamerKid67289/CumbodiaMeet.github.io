const localVideo = document.getElementById('local-video');
const remoteContainer = document.getElementById('remote-container');
const toggleCameraButton = document.getElementById('toggle-camera');
const toggleMicButton = document.getElementById('toggle-mic');

let localStream;
let cameraOn = true;
let micOn = true;

async function startLocalStream() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: cameraOn, audio: micOn });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Toggle camera
toggleCameraButton.addEventListener('click', () => {
    cameraOn = !cameraOn;
    localStream.getVideoTracks()[0].enabled = cameraOn;
});

// Toggle microphone
toggleMicButton.addEventListener('click', () => {
    micOn = !micOn;
    localStream.getAudioTracks()[0].enabled = micOn;
});

// Function to add a new remote video
function addRemoteVideo(stream) {
    const remoteVideo = document.createElement('video');
    remoteVideo.srcObject = stream;
    remoteVideo.autoplay = true;
    remoteContainer.appendChild(remoteVideo);
}

// Handle signaling and peer connections - you need to implement this part

// Call this function to add a remote stream
// For example: addRemoteVideo(remoteStream);

startLocalStream();
