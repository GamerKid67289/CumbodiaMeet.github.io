const videosContainer = document.getElementById('videos');
const toggleVideoButton = document.getElementById('toggleVideo');
const toggleAudioButton = document.getElementById('toggleAudio');

const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
};

const constraints = {
  video: true,
  audio: true,
};

let localStream;
const peers = [];

async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia(constraints);
    addVideoStream(localStream, true);

    // Handle incoming calls
    socket.on('call', (callerId) => {
      const peerConnection = createPeerConnection(callerId, true);
      peers.push({ id: callerId, connection: peerConnection });
    });

    // ... Additional socket.io code for handling connections and calls
  } catch (error) {
    console.error('Error accessing media devices:', error);
    alert('Camera and microphone access is required to use this app.');
  }
}

function addVideoStream(stream, isLocal) {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.autoplay = true;

  const container = document.createElement('div');
  container.classList.add('video-container');
  container.appendChild(video);

  videosContainer.appendChild(container);

  if (!isLocal) {
    // Handle remote stream
  }
}

function createPeerConnection(peerId, isCaller) {
  const peerConnection = new RTCPeerConnection(configuration);

  localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

  peerConnection.ontrack = (event) => {
    addVideoStream(event.streams[0], false);
  };

  // ... Additional peer connection setup

  return peerConnection;
}

toggleVideoButton.addEventListener('click', () => {
  localStream.getVideoTracks().forEach(track => {
    track.enabled = !track.enabled;
  });
});

toggleAudioButton.addEventListener('click', () => {
  localStream.getAudioTracks().forEach(track => {
    track.enabled = !track.enabled;
  });
});

startCall();
