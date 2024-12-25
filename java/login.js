// Ensure the Login form is shown when the page is loaded
window.onload = function() {
    showLoginForm(); // Show Login Form by default
  }
  
  // Function to show the Login form
  function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.remove('hidden'); // Show Login form
    signupForm.classList.add('hidden');   // Hide Sign-up form
    document.getElementById('messageBox').style.display = 'none';  // Hide any messages
  }
  
  // Function to toggle between Login and Sign-Up Forms
  function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
  
    loginForm.classList.toggle('hidden');
    signupForm.classList.toggle('hidden');
  
    // Hide the message box when switching forms
    document.getElementById('messageBox').style.display = 'none';
  }
  
  // Handle Sign-Up
  function handleSignUp() {
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
  
    if (!username || !password) {
      showMessage("Please fill out all fields.", "error");
      return;
    }
  
    // Check if username already exists
    if (localStorage.getItem(username)) {
      showMessage("Username already exists. Please choose a different one.", "error");
      return;
    }
  
    // Save user to localStorage
    localStorage.setItem(username, password);
    showMessage("Sign-Up successful! You can now log in.", "success");
    toggleForms(); // Switch to Login form after successful sign-up
  }
  
  // Handle Login
  function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
  
    if (!username || !password) {
      showMessage("Please fill out all fields.", "error");
      return;
    }
  
    const storedPassword = localStorage.getItem(username);
  
    // Check if password matches
    if (storedPassword === password) {
      showMessage("Login successful!", "success");
      // Redirect to the main index.html page after login
      window.location.href = 'index1.html';  // Redirect to the main page
    } else {
      showMessage("Invalid username or password.", "error");
    }
  }
  
  // Show the message in a box
  function showMessage(message, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.innerHTML = message;
    messageBox.classList.remove('success', 'error');
    messageBox.classList.add(type);
    messageBox.style.display = 'block';
  }
  