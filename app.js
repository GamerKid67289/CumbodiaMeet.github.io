const localVideo = document.getElementById('localVideo');
const toggleCameraButton = document.getElementById('toggleCamera');
const toggleMicButton = document.getElementById('toggleMic');

let isCameraOn = true;
let isMicOn = true;

// Access user media
async function startMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

// Toggle camera
toggleCameraButton.addEventListener('click', () => {
    isCameraOn = !isCameraOn;
    localVideo.srcObject.getVideoTracks().forEach(track => {
        track.enabled = isCameraOn;
    });
});

// Toggle microphone
toggleMicButton.addEventListener('click', () => {
    isMicOn = !isMicOn;
    localVideo.srcObject.getAudioTracks().forEach(track => {
        track.enabled = isMicOn;
    });
});

// Start the media on page load
startMedia();
