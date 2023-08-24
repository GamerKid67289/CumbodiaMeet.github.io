const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');
const toggleVideoButton = document.getElementById('toggleVideo');
const toggleAudioButton = document.getElementById('toggleAudio');

let localStream;
const constraints = { video: true, audio: true };

// Get user media and display it on the local video element
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        localStream = stream;
        localVideo.srcObject = stream;
    })
    .catch(error => console.error('Error accessing user media:', error));

// Toggle video stream
toggleVideoButton.addEventListener('click', () => {
    const videoTrack = localStream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
});

// Toggle audio stream
toggleAudioButton.addEventListener('click', () => {
    const audioTrack = localStream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
});
