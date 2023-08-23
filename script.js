const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const toggleCameraButton = document.getElementById('toggleCamera');
let localStream = null;

async function startLocalVideo() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
}

toggleCameraButton.addEventListener('click', async () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        const enabled = !videoTrack.enabled;
        videoTrack.enabled = enabled;
        toggleCameraButton.textContent = enabled ? 'Disable Camera' : 'Enable Camera';
    }
});

async function initialize() {
    await startLocalVideo();

    // Additional logic to establish connections and handle remote streams would go here
}

initialize();
