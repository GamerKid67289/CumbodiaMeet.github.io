const APP_ID = '25540f7394b841d29dfe60b86c43a5eb';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localStream;
const remoteStreams = {};

let isAudioMuted = false;
let isVideoMuted = false;

const localVideoContainer = document.getElementById('localVideo');
const remoteVideosContainer = document.getElementById('remoteVideos');
const joinButton = document.getElementById('joinButton');
const leaveButton = document.getElementById('leaveButton');
const toggleAudioButton = document.getElementById('toggleAudioButton');
const toggleVideoButton = document.getElementById('toggleVideoButton');

joinButton.addEventListener('click', joinCall);
leaveButton.addEventListener('click', leaveCall);
toggleAudioButton.addEventListener('click', toggleAudio);
toggleVideoButton.addEventListener('click', toggleVideo);

async function joinCall() {
  try {
    const uid = await client.join(APP_ID, 'myChannel', null);

    localStream = AgoraRTC.createStream({
      streamID: uid,
      audio: true,
      video: true,
    });

    await localStream.init();

    localStream.play('localVideo');
    client.publish(localStream);

    client.on('stream-added', async (event) => {
      const remoteStream = event.stream;
      remoteStreams[remoteStream.getId()] = remoteStream;
      await client.subscribe(remoteStream);
      addRemoteVideo(remoteStream.getId());
    });

    client.on('stream-removed', (event) => {
      const remoteStream = event.stream;
      removeRemoteVideo(remoteStream.getId());
    });
  } catch (error) {
    console.error('Error joining call:', error);
  }
}

function leaveCall() {
  if (localStream) {
    localStream.stop();
    client.unpublish(localStream);
  }

  for (const streamId in remoteStreams) {
    if (remoteStreams.hasOwnProperty(streamId)) {
      remoteStreams[streamId].stop();
      removeRemoteVideo(streamId);
    }
  }

  client.leave();
}

async function toggleAudio() {
  if (localStream) {
    isAudioMuted = !isAudioMuted;
    if (isAudioMuted) {
      localStream.muteAudio();
    } else {
      localStream.unmuteAudio();
    }
    toggleAudioButton.textContent = isAudioMuted ? 'Unmute Audio' : 'Mute Audio';
  }
}

async function toggleVideo() {
  if (localStream) {
    isVideoMuted = !isVideoMuted;
    if (isVideoMuted) {
      localStream.muteVideo();
    } else {
      localStream.unmuteVideo();
    }
    toggleVideoButton.textContent = isVideoMuted ? 'Unmute Video' : 'Mute Video';
  }
}

function addRemoteVideo(streamId) {
  const remoteVideoElement = document.createElement('div');
  remoteVideoElement.id = `remote_${streamId}`;
  remoteVideoElement.className = 'remote-video';
  remoteVideosContainer.appendChild(remoteVideoElement);
  remoteStreams[streamId].play(`remote_${streamId}`);
}

function removeRemoteVideo(streamId) {
  const remoteVideoElement = document.getElementById(`remote_${streamId}`);
  if (remoteVideoElement) {
    remoteVideoElement.parentNode.removeChild(remoteVideoElement);
    delete remoteStreams[streamId];
  }
}
