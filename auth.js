let users = [
      { username: 'demo', email: 'demo@example.com', password: 'password123' }
    ];

    // DOM Elements
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Toggle between login and signup
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      loginContainer.classList.add('hidden');
      signupContainer.classList.remove('hidden');
      clearMessages();
    });

    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
      clearMessages();
    });

    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      
      clearErrors();
      setLoading('login', true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        showSuccess('loginSuccess', 'Login successful! Welcome back, ' + user.username);
        // In real app, redirect to dashboard
        setTimeout(() => {
          alert('Login successful! In a real app, you would be redirected to the dashboard.');
        }, 1500);
      } else {
        const foundUser = users.find(u => u.email === email);
        if (!foundUser) {
          showError('loginEmailError', 'No account found with this email address');
        } else {
          showError('loginPasswordError', 'Incorrect password');
        }
      }
      
      setLoading('login', false);
    });

    // Signup form submission
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const username = document.getElementById('signupUsername').value;
      const email = document.getElementById('signupEmail').value;
      const password = document.getElementById('signupPassword').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      clearErrors();
      
      // Validation
      let hasErrors = false;
      
      if (username.length < 3) {
        showError('signupUsernameError', 'Username must be at least 3 characters');
        hasErrors = true;
      }
      
      if (users.find(u => u.email === email)) {
        showError('signupEmailError', 'An account with this email already exists');
        hasErrors = true;
      }
      
      if (password.length < 6) {
        showError('signupPasswordError', 'Password must be at least 6 characters');
        hasErrors = true;
      }
      
      if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        hasErrors = true;
      }
      
      if (hasErrors) return;
      
      setLoading('signup', true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add user to database
      users.push({ username, email, password });
      
      showSuccess('signupSuccess', 'Account created successfully! You can now login.');
      signupForm.reset();
      
      // Switch to login after 2 seconds
      setTimeout(() => {
        signupContainer.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        clearMessages();
      }, 2000);
      
      setLoading('signup', false);
    });

    // Google login/signup (mock)
    document.getElementById('googleLoginBtn').addEventListener('click', () => {
      alert('Google Sign-In would be implemented here using Google OAuth API');
    });

    document.getElementById('googleSignupBtn').addEventListener('click', () => {
      alert('Google Sign-Up would be implemented here using Google OAuth API');
    });

    // Forgot password
    document.getElementById('forgotPassword').addEventListener('click', (e) => {
      e.preventDefault();
      const email = prompt('Please enter your email address:');
      if (email) {
        if (users.find(u => u.email === email)) {
          alert('Password reset email sent! (This is a demo - no actual email sent)');
        } else {
          alert('No account found with this email address.');
        }
      }
    });

    // Helper functions
    function clearErrors() {
      document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
      });
      document.querySelectorAll('input').forEach(input => {
        input.classList.remove('error');
      });
    }

    function clearMessages() {
      document.querySelectorAll('.success-message').forEach(el => {
        el.style.display = 'none';
      });
      clearErrors();
    }

    function showError(elementId, message) {
      const errorEl = document.getElementById(elementId);
      const inputEl = errorEl.previousElementSibling;
      
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      inputEl.classList.add('error');
    }

    function showSuccess(elementId, message) {
      const successEl = document.getElementById(elementId);
      successEl.textContent = message;
      successEl.style.display = 'block';
    }

    function setLoading(formType, isLoading) {
      const container = formType === 'login' ? loginContainer : signupContainer;
      const btn = document.getElementById(formType + 'Btn');
      const spinner = btn.querySelector('.fa-spinner');
      const text = btn.querySelector('span');
      
      if (isLoading) {
        container.classList.add('loading');
        spinner.style.display = 'inline-block';
        text.textContent = formType === 'login' ? 'Signing in...' : 'Creating account...';
      } else {
        container.classList.remove('loading');
        spinner.style.display = 'none';
        text.textContent = formType === 'login' ? 'Login' : 'Create Account';
      }
    }

    // Real-time validation
    document.getElementById('signupPassword').addEventListener('input', function() {
      const confirmPassword = document.getElementById('confirmPassword');
      if (confirmPassword.value && this.value !== confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
      } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
      }
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
      const password = document.getElementById('signupPassword').value;
      if (this.value && this.value !== password) {
        showError('confirmPasswordError', 'Passwords do not match');
      } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
      }
    });