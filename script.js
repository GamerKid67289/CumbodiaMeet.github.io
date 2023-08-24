const localVideo = document.getElementById('local-video');
const toggleCameraButton = document.getElementById('toggle-camera');
const toggleMicButton = document.getElementById('toggle-mic');
let cameraOn = true;
let micOn = true;

async function getMediaStream() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: cameraOn, audio: micOn });
        localVideo.srcObject = stream;
    } catch (error) {
        console.error('Error accessing media devices:', error);
    }
}

toggleCameraButton.addEventListener('click', () => {
    cameraOn = !cameraOn;
    getMediaStream();
});

toggleMicButton.addEventListener('click', () => {
    micOn = !micOn;
    getMediaStream();
});

getMediaStream();
