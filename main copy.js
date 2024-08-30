
// Initialize Firebase
// Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgY9qT22cGrA7d46axjzJT5g5EZ2SxsRw",
  authDomain: "mextube-2b3e3.firebaseapp.com",
  databaseURL: "https://mextube-2b3e3-default-rtdb.firebaseio.com",
  projectId: "mextube-2b3e3",
  storageBucket: "mextube-2b3e3.appspot.com",
  messagingSenderId: "821910922346",
  appId: "1:821910922346:web:b7f79bb310793978de1613"
};

firebase.initializeApp(firebaseConfig);

// Reference to the Firebase database
function getCommentsRef() {
  // Get the current page URL
  const url = window.location.href;
  
  // Extract the page identifier from the URL
  const pageId = extractPageIdFromUrl(url);
  
  // Return the Firebase database reference for the specific page
  return firebase.database().ref('comments/' + pageId);
}

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

// Form submission event listener
document.getElementById('commentForm').addEventListener('submit', submitComment);

// Function to submit comment
function submitComment(e) {
  e.preventDefault();
  const commentText = document.getElementById('comment').value;
  
  // Push comment to Firebase database
  getCommentsRef().push({
    name: userName,
    comment: commentText,
    icon: userIcon
  });

  // Clear comment textarea
  document.getElementById('comment').value = '';
}

// Display comments
getCommentsRef().on('value', function(snapshot) {
  const commentsContainer = document.getElementById('comments');
  commentsContainer.innerHTML = '';

  snapshot.forEach(function(childSnapshot) {
    const commentData = childSnapshot.val();
    
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
  });

  // Update comment count
  document.getElementById('commentCount').textContent = snapshot.numChildren();
});

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
// Assuming this code is placed after the DOM has loaded
document.getElementById('comments').classList.add('active');


function extractPageIdFromUrl(url) {
  // Example URL: http://example.com/play1.html
  // Extract the part of the URL after the last '/' and before '.html'
  const match = url.match(/\/([^/]+)\.html$/);
  if (match && match[1]) {
    // If there's a match and a captured group, return the captured group
    return match[1];
  } else {
    // If no match or captured group, return a default value or handle the error as needed
    return 'defaultPageId';
  }
}
