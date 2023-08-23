document.addEventListener("DOMContentLoaded", () => {
  const localVideo = document.getElementById("localVideo");
  const remoteVideo = document.getElementById("remoteVideo");
  const startCallButton = document.getElementById("startCall");
  const endCallButton = document.getElementById("endCall");

  let localStream;
  let peerConnection;

  // Function to start the call
  async function startCall() {
    try {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideo.srcObject = localStream;

      // Create a peer connection
      peerConnection = new RTCPeerConnection();

      // Add local stream to the peer connection
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

      // Handle incoming stream from remote user
      peerConnection.ontrack = event => {
        remoteVideo.srcObject = event.streams[0];
      };

      // TODO: Set up signaling for connecting with the remote user

      startCallButton.disabled = true;
      endCallButton.disabled = false;
    } catch (error) {
      console.error("Error starting the call:", error);
    }
  }

  // Function to end the call
  function endCall() {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      localVideo.srcObject = null;
    }
    if (peerConnection) {
      peerConnection.close();
      remoteVideo.srcObject = null;
    }

    // TODO: Clean up signaling and other related tasks

    startCallButton.disabled = false;
    endCallButton.disabled = true;
  }

  // Attach click event listeners to buttons
  startCallButton.addEventListener("click", startCall);
  endCallButton.addEventListener("click", endCall);
});
