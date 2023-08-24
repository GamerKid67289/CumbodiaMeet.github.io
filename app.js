const APP_ID = '25540f7394b841d29dfe60b86c43a5eb';
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localStream;
let remoteStream;

const localVideoContainer = document.getElementById('localVideo');
const remoteVideoContainer = document.getElementById('remoteVideo');
const joinButton = document.getElementById('joinButton');
const leaveButton = document.getElementById('leaveButton');

joinButton.addEventListener('click', joinCall);
leaveButton.addEventListener('click', leaveCall);

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
      remoteStream = event.stream;
      await client.subscribe(remoteStream);
      remoteStream.play('remoteVideo');
    });

    client.on('stream-removed', (event) => {
      const stream = event.stream;
      stream.stop();
      remoteVideoContainer.innerHTML = '';
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

  if (remoteStream) {
    remoteStream.stop();
    remoteVideoContainer.innerHTML = '';
  }

  client.leave();
}
