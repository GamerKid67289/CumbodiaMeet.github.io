const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleMicButton = document.getElementById('toggleMicButton');

let localStream;
let peer;
let peerConnection;
let isCameraOn = true;
let isMicMuted = false;

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
toggleCameraButton.addEventListener('click', toggleCamera);
toggleMicButton.addEventListener('click', toggleMic);

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peer = new Peer(); // Create a new Peer instance
        peer.on('open', () => {
            // Display your own video and audio
            const myVideoCall = peer.call(peer.id, localStream);

            myVideoCall.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
        });

        peer.on('call', incomingCall => {
            // Answer incoming calls and display remote video and audio
            incomingCall.answer(localStream);
            incomingCall.on('stream', remoteStream => {
                remoteVideo.srcObject = remoteStream;
            });
        });
    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

function endCall() {
    if (peer) {
        peer.destroy();
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

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
