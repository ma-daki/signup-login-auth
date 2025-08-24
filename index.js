
  const loginBtn = document.getElementById('loginBtn');
  const googleBtn = document.getElementById('googleLoginBtn');

  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    loginBtn.classList.add('active');
    googleBtn.classList.remove('active');
  });

  googleBtn.addEventListener('click', function(e) {
    e.preventDefault();
    googleBtn.classList.add('active');
    loginBtn.classList.remove('active');
  });


  document.addEventListener("DOMContentLoaded", function() {
  const loginContainer = document.getElementById("loginContainer");
  const signupContainer = document.getElementById("signupContainer");
  const showSignup = document.getElementById("showSignup");
  const showLogin = document.getElementById("showLogin");

  showSignup.addEventListener("click", function(e) {
    e.preventDefault();
    loginContainer.style.display = "none";
    signupContainer.style.display = "block";
  });

  showLogin.addEventListener("click", function(e) {
    e.preventDefault();
    signupContainer.style.display = "none";
    loginContainer.style.display = "block";
  });
});