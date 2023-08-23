var video = document.getElementById("video-container");

// Initialize the video call
var videoCall = new VideoCall();

// Add a listener for the "connected" event
videoCall.addEventListener("connected", function() {
  // The video call has connected, so show the video
  video.appendChild(videoCall.videoElement);
});

// Add a listener for the "disconnected" event
videoCall.addEventListener("disconnected", function() {
  // The video call has disconnected, so hide the video
  video.removeChild(videoCall.videoElement);
});

// Start the video call
videoCall.start();
