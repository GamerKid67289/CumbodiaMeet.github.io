const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleMicButton = document.getElementById('toggleMicButton');

let localStream;
let peerConnection;

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);
toggleCameraButton.addEventListener('click', toggleCamera);
toggleMicButton.addEventListener('click', toggleMic);

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        // Create peer connection and add local stream tracks
        peerConnection = new RTCPeerConnection();
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        // TODO: Implement signaling for offer/answer and ICE candidates
        // ...

        peerConnection.ontrack = event => {
            remoteVideo.srcObject = event.streams[0];
        };

        // Create and send offer to remote peer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        // TODO: Send the offer to the remote peer
        // ...
        
    } catch (error) {
        console.error('Error starting the call:', error);
    }
}

function endCall() {
    // Close the peer connection
    if (peerConnection) {
        peerConnection.close();
    }

    // Stop local media tracks
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }

    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
}

function toggleCamera() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        videoTrack.enabled = !videoTrack.enabled;
        toggleCameraButton.textContent = videoTrack.enabled ? 'Turn Off Camera' : 'Turn On Camera';
    }
}

function toggleMic() {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        audioTrack.enabled = !audioTrack.enabled;
        toggleMicButton.textContent = audioTrack.enabled ? 'Mute Mic' : 'Unmute Mic';
    }
}
