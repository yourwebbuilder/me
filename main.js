// Global variables for WebRTC
let peerConnection;
let dataChannel;
let remoteDataChannel;
const configuration = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] }; // STUN server for NAT traversal

// Retrieve user information from local storage
let userName = localStorage.getItem('userName');
let userIcon = localStorage.getItem('userIcon');

// Check if user information exists in local storage
if (userName && userIcon) {
  hideUserInfo(); // If user information is available, hide the user info section
}

// Update user information event listener
document.getElementById('updateUserInfo').addEventListener('click', function() {
  userName = document.getElementById('userName').value;
  userIcon = document.getElementById('userIcon').value;
  
  // Store user information in local storage
  localStorage.setItem('userName', userName);
  localStorage.setItem('userIcon', userIcon);
  
  hideUserInfo();
});

// Function to hide user information section
function hideUserInfo() {
  document.getElementById('mks').style.display = 'none';
}

// Function to show user information section
function showUserInfo() {
  document.getElementById('mks').style.display = 'block';
}

// WebRTC setup
function createPeerConnection() {
  peerConnection = new RTCPeerConnection(configuration);

  // Create a Data Channel
  dataChannel = peerConnection.createDataChannel("commentsChannel");
  dataChannel.onopen = handleChannelStatusChange;
  dataChannel.onclose = handleChannelStatusChange;
  dataChannel.onmessage = receiveMessage;

  // Listen for ICE candidates and send them to the other peer
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("New ICE candidate:", event.candidate);
      // Send ICE candidate to the other peer (use a manual signaling mechanism)
    }
  };

  // Listen for the remote data channel
  peerConnection.ondatachannel = (event) => {
    remoteDataChannel = event.channel;
    remoteDataChannel.onmessage = receiveMessage;
  };
}

// Function to handle status changes in the DataChannel
function handleChannelStatusChange(event) {
  if (dataChannel) {
    const state = dataChannel.readyState;
    if (state === "open") {
      console.log("Data channel is open.");
    } else {
      console.log("Data channel is closed.");
    }
  }
}

// Function to submit a comment
function submitComment(e) {
  e.preventDefault();
  const commentText = document.getElementById('comment').value;

  // Send comment to the other peer
  dataChannel.send(JSON.stringify({
    name: userName,
    comment: commentText,
    icon: userIcon
  }));

  // Display the comment locally
  displayComment({
    name: userName,
    comment: commentText,
    icon: userIcon
  });

  // Clear the comment textarea
  document.getElementById('comment').value = '';
}

// Function to display a comment
function displayComment(commentData) {
  const commentsContainer = document.getElementById('comments');
  
  const commentDiv = document.createElement('div');
  commentDiv.classList.add('comment');

  const iconImg = document.createElement('img');
  iconImg.src = getIconSrc(commentData.icon);
  iconImg.alt = 'User Icon';

  const commentContent = document.createElement('div');
  const commentHeader = document.createElement('div');
  commentHeader.innerHTML = '<strong>' + commentData.name + '</strong> says:';
  const commentBody = document.createElement('p');
  commentBody.textContent = commentData.comment;

  commentContent.appendChild(commentHeader);
  commentContent.appendChild(commentBody);

  commentDiv.appendChild(iconImg);
  commentDiv.appendChild(commentContent);

  commentsContainer.appendChild(commentDiv);

  // Update comment count
  document.getElementById('commentCount').textContent = commentsContainer.children.length;
}

// Function to receive a message from the other peer
function receiveMessage(event) {
  const message = JSON.parse(event.data);
  displayComment(message);
}

// Function to get icon source based on user's selected icon
function getIconSrc(icon) {
  switch (icon) {
    case 'icon1':
      return 'Flixtube icon34.png'; // Path to your icon image
    case 'icon2':
      return 'Flixtube icon34.png'; // Path to your icon image
    case 'icon3':
      return 'Flixtube icon34.png'; // Path to your icon image
    default:
      return 'Flixtube icon34.png'; // Default icon image
  }
}

// Toggle comments visibility when textarea is clicked
document.getElementById('comments').classList.add('active');

// Manually handle the signaling process
function startCall() {
  createPeerConnection();

  // Create an offer to start the connection
  peerConnection.createOffer().then(offer => {
    return peerConnection.setLocalDescription(offer);
  }).then(() => {
    console.log("Offer created. Share this offer with the other peer:", peerConnection.localDescription);
    // Manually send this offer to the other peer
  });
}

function answerCall(offer) {
  createPeerConnection();

  // Set the remote offer received from the other peer
  peerConnection.setRemoteDescription(new RTCSessionDescription(offer)).then(() => {
    // Create an answer to the offer
    return peerConnection.createAnswer();
  }).then(answer => {
    return peerConnection.setLocalDescription(answer);
  }).then(() => {
    console.log("Answer created. Share this answer with the other peer:", peerConnection.localDescription);
    // Manually send this answer to the other peer
  });
}

function addIceCandidate(candidate) {
  peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}
