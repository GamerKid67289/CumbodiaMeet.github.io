const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const startButton = document.getElementById("startButton");
const hangupButton = document.getElementById("hangupButton");

let localStream;
let remoteStream;
let pc1;
let pc2;

startButton.addEventListener("click", startCall);
hangupButton.addEventListener("click", hangupCall);



// Add this section after the previous code
const toggleCameraButton = document.getElementById("toggleCameraButton");
let isCameraOn = true;

toggleCameraButton.addEventListener("click", toggleCamera);

async function toggleCamera() {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            isCameraOn = !isCameraOn;
            videoTrack.enabled = isCameraOn;
            if (isCameraOn) {
                toggleCameraButton.textContent = "Turn Off Camera";
            } else {
                toggleCameraButton.textContent = "Turn On Camera";
            }
        }
    }
}

// ... (remaining previous code) ...


async function startCall() {
    startButton.disabled = true;
    hangupButton.disabled = false;

    // Get local video stream
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
    } catch (error) {
        console.error("Error accessing local media:", error);
        return;
    }

    // Set up PeerConnection
    const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };
    pc1 = new RTCPeerConnection(configuration);
    pc2 = new RTCPeerConnection(configuration);

    // Add local stream to pc1
    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    // Set up ice candidate handlers for both peers
    pc1.onicecandidate = event => {
        if (event.candidate) {
            pc2.addIceCandidate(event.candidate);
        }
    };
    pc2.onicecandidate = event => {
        if (event.candidate) {
            pc1.addIceCandidate(event.candidate);
        }
    };

    // Set up remote stream handler for pc2
    pc2.ontrack = event => {
        if (!remoteStream) {
            remoteStream = new MediaStream();
            remoteVideo.srcObject = remoteStream;
        }
        remoteStream.addTrack(event.track);
    };

    // Create offer and set it as pc1's local description
    try {
        const offer = await pc1.createOffer();
        await pc1.setLocalDescription(offer);
        await pc2.setRemoteDescription(offer);

        const answer = await pc2.createAnswer();
        await pc2.setLocalDescription(answer);
        await pc1.setRemoteDescription(answer);
    } catch (error) {
        console.error("Error creating or setting description:", error);
    }
}

function hangupCall() {
    pc1.close();
    pc2.close();
    localStream.getTracks().forEach(track => track.stop());
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    startButton.disabled = false;
    hangupButton.disabled = true;
}

