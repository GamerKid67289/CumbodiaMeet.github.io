const localVideo = document.getElementById('localVideo');
const remoteVideosContainer = document.getElementById('remoteVideosContainer');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleMicButton = document.getElementById('toggleMicButton');

let localStream;
let peer;
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

        // Display local video
        const localVideoElement = document.createElement('video');
        localVideoElement.srcObject = localStream;
        localVideoElement.muted = true;
        localVideoElement.play();
        localVideo.appendChild(localVideoElement);

        // Answer incoming calls and display remote videos
        peer.on('call', incomingCall => {
            incomingCall.answer(localStream);
            handleIncomingCall(incomingCall);
        });

    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

function handleIncomingCall(incomingCall) {
    const remoteVideoElement = document.createElement('video');
    incomingCall.on('stream', remoteStream => {
        remoteVideoElement.srcObject = remoteStream;
        remoteVideoElement.play();
        remoteVideosContainer.appendChild(remoteVideoElement);
    });
}

function endCall() {
    if (peer) {
        peer.destroy();
    }

    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    localVideo.innerHTML = '';
    remoteVideosContainer.innerHTML = '';
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
