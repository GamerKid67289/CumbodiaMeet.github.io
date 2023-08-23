const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleMicButton = document.getElementById('toggleMicButton');

let localStream;
let remoteStream;
let isCameraOn = true;
let isMicMuted = false;
let peerConnection;

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
toggleCameraButton.addEventListener('click', toggleCamera);
toggleMicButton.addEventListener('click', toggleMic);

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        peerConnection = new RTCPeerConnection(configuration);

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };

        // TODO: Set up signaling and establish the connection
        // This involves handling offers, answers, ICE candidates, etc.

    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

function endCall() {
    // TODO: Close the connection and clean up resources
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    remoteStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}

function toggleCamera() {
    isCameraOn = !isCameraOn;
    localStream.getVideoTracks()[0].enabled = isCameraOn;
    toggleCameraButton.textContent = isCameraOn ? 'Turn Off Camera' : 'Turn On Camera';
}

function toggleMic() {
    isMicMuted = !isMicMuted;
    localStream.getAudioTracks()[0].enabled = !isMicMuted;
    toggleMicButton.textContent = isMicMuted ? 'Unmute Mic' : 'Mute Mic';
}
