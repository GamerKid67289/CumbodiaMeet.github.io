const localVideo = document.getElementById('localVideo');
const toggleCameraButton = document.getElementById('toggleCamera');
const toggleMicButton = document.getElementById('toggleMic');

let isCameraOn = true;
let isMicOn = true;

let peerConnection;
const socket = io(); // Assuming you have the socket.io library included

// Access user media and start signaling
async function startMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = stream;

        // Set up peer connection
        const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
        peerConnection = new RTCPeerConnection(configuration);

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        // Handle incoming tracks from remote peers
        peerConnection.ontrack = (event) => {
            const remoteVideo = document.createElement('video');
            remoteVideo.srcObject = event.streams[0];
            remoteVideo.autoplay = true;
            document.getElementById('videos').appendChild(remoteVideo);
        };

        // Signal ICE candidates to remote peers
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                socket.emit('ice-candidate', event.candidate);
            }
        };

        // Set up signaling listeners
        socket.on('ice-candidate', async candidate => {
            try {
                await peerConnection.addIceCandidate(candidate);
            } catch (e) {
                console.error('Error adding ice candidate:', e);
            }
        });

        // Create and send offer to remote peers
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer);
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

// Start the media and signaling on page load
startMedia();
