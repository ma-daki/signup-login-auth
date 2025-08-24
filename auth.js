// Enhanced user database with timestamps (simulates real DB)
    let users = JSON.parse(sessionStorage.getItem('userDB') || '[]');
    
    // Add demo user if database is empty
    if (users.length === 0) {
      users = [
        { 
          id: 1,
          username: 'demo', 
          email: 'demo@example.com', 
          password: 'Demo123!',
          createdAt: new Date('2024-01-01').toISOString()
        }
      ];
      sessionStorage.setItem('userDB', JSON.stringify(users));
    }

    // Session management
    let currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    let nextUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // DOM Elements
    const loginContainer = document.getElementById('loginContainer');
    const signupContainer = document.getElementById('signupContainer');
    const dashboardContainer = document.getElementById('dashboardContainer');
    const welcomePopup = document.getElementById('welcomePopup');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const closePopupBtn = document.getElementById('closePopup');

    // Check if user is already logged in on page load
    window.addEventListener('load', () => {
      if (currentUser) {
        showDashboard();
      }
    });

    // Toggle between login and signup
    showSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showSignup();
    });

    showLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showLogin();
    });

    // Close welcome popup
    closePopupBtn.addEventListener('click', () => {
      hideWelcomePopup();
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
        // Save session
        currentUser = user;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showWelcomePopup(user.username, 'Welcome back!');
        
        setTimeout(() => {
          showDashboard();
        }, 2000);
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
        showError('signupEmailError', 'This email address is already registered');
        hasErrors = true;
      }
      
      // Password strength validation
      const passwordErrors = validatePasswordStrength(password);
      if (passwordErrors.length > 0) {
        showError('signupPasswordError', `Password must contain ${passwordErrors.join(', ')}`);
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
      
      // Create new user
      const newUser = {
        id: nextUserId++,
        username,
        email,
        password,
        createdAt: new Date().toISOString()
      };
      
      // Save to database
      users.push(newUser);
      sessionStorage.setItem('userDB', JSON.stringify(users));
      
      showSuccess('signupSuccess', 'Account created successfully! You can now login.');
      signupForm.reset();
      
      // Switch to login after 2 seconds
      setTimeout(() => {
        showLogin();
        clearMessages();
        // Pre-fill email for convenience
        document.getElementById('loginEmail').value = email;
      }, 2000);
      
      setLoading('signup', false);
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
      currentUser = null;
      sessionStorage.removeItem('currentUser');
      showLogin();
      clearMessages();
      loginForm.reset();
      signupForm.reset();
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

    // UI Helper functions
    function showLogin() {
      hideAllContainers();
      loginContainer.classList.remove('hidden');
    }

    function showSignup() {
      hideAllContainers();
      signupContainer.classList.remove('hidden');
    }

    function showDashboard() {
      hideAllContainers();
      dashboardContainer.classList.remove('hidden');
      
      // Populate dashboard with user info
      document.getElementById('welcomeTitle').textContent = `Welcome back, ${currentUser.username}!`;
      document.getElementById('dashUsername').textContent = currentUser.username;
      document.getElementById('dashEmail').textContent = currentUser.email;
      document.getElementById('dashCreated').textContent = new Date(currentUser.createdAt).toLocaleDateString();
    }

    function hideAllContainers() {
      loginContainer.classList.add('hidden');
      signupContainer.classList.add('hidden');
      dashboardContainer.classList.add('hidden');
    }

    function showWelcomePopup(username, message) {
      document.getElementById('popupTitle').textContent = `Welcome ${username}!`;
      document.getElementById('popupMessage').textContent = message;
      welcomePopup.classList.add('show');
    }

    function hideWelcomePopup() {
      welcomePopup.classList.remove('show');
    }

    // Password strength validation function
    function validatePasswordStrength(password) {
      const errors = [];
      
      if (password.length < 8) {
        errors.push('at least 8 characters');
      }
      
      if (!/[A-Z]/.test(password)) {
        errors.push('one uppercase letter');
      }
      
      if (!/[a-z]/.test(password)) {
        errors.push('one lowercase letter');
      }
      
      if (!/[0-9]/.test(password)) {
        errors.push('one number');
      }
      
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('one symbol (!@#$%^&* etc.)');
      }
      
      return errors;
    }

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

    // Real-time validation with visual indicators
    document.getElementById('signupPassword').addEventListener('input', function() {
      const password = this.value;
      const confirmPassword = document.getElementById('confirmPassword');
      
      // Update visual requirement indicators
      updatePasswordRequirements(password);
      
      // Check password strength in real-time
      if (password.length > 0) {
        const passwordErrors = validatePasswordStrength(password);
        if (passwordErrors.length > 0) {
          showError('signupPasswordError', `Password must contain ${passwordErrors.join(', ')}`);
        } else {
          document.getElementById('signupPasswordError').style.display = 'none';
          document.getElementById('signupPassword').classList.remove('error');
        }
      }
      
      // Check password match
      if (confirmPassword.value && password !== confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
      } else if (confirmPassword.value) {
        document.getElementById('confirmPasswordError').style.display = 'none';
        document.getElementById('confirmPassword').classList.remove('error');
      }
    });

    // Function to update password requirement indicators
    function updatePasswordRequirements(password) {
      const requirements = [
        { id: 'req-length', test: password.length >= 8 },
        { id: 'req-uppercase', test: /[A-Z]/.test(password) },
        { id: 'req-lowercase', test: /[a-z]/.test(password) },
        { id: 'req-number', test: /[0-9]/.test(password) },
        { id: 'req-symbol', test: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
      ];

      requirements.forEach(req => {
        const element = document.getElementById(req.id);
        const icon = element.querySelector('i');
        
        if (req.test) {
          element.classList.add('valid');
          icon.className = 'fas fa-check';
        } else {
          element.classList.remove('valid');
          icon.className = 'fas fa-times';
        }
      });
    }

    document.getElementById('confirmPassword').addEventListener('input', function() {
      const password = document.getElementById('signupPassword').value;
      if (this.value && this.value !== password) {
        showError('confirmPasswordError', 'Passwords do not match');
      } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
        this.classList.remove('error');
      }
    });

    // Real-time email validation for signup
    document.getElementById('signupEmail').addEventListener('blur', function() {
      const email = this.value;
      if (email && users.find(u => u.email === email)) {
        showError('signupEmailError', 'This email address is already registered');
      } else {
        document.getElementById('signupEmailError').style.display = 'none';
        this.classList.remove('error');
      }
    });
  </script> password = this.value;
      const confirmPassword = document.getElementById('confirmPassword');
      
      // Check password strength in real-time
      if (password.length > 0) {
        const passwordErrors = validatePasswordStrength(password);
        if (passwordErrors.length > 0) {
          showError('signupPasswordError', `Password must contain ${passwordErrors.join(', ')}`);
        } else {
          document.getElementById('signupPasswordError').style.display = 'none';
          document.getElementById('signupPassword').classList.remove('error');
        }
      }
      
      // Check password match
      if (confirmPassword.value && password !== confirmPassword.value) {
        showError('confirmPasswordError', 'Passwords do not match');
      } else if (confirmPassword.value) {
        document.getElementById('confirmPasswordError').style.display = 'none';
        document.getElementById('confirmPassword').classList.remove('error');
      }
    });

    document.getElementById('confirmPassword').addEventListener('input', function() {
      const password = document.getElementById('signupPassword').value;
      if (this.value && this.value !== password) {
        showError('confirmPasswordError', 'Passwords do not match');
      } else {
        document.getElementById('confirmPasswordError').style.display = 'none';
        this.classList.remove('error');
      }
    });

    // Real-time email validation for signup
    document.getElementById('signupEmail').addEventListener('blur', function() {
      const email = this.value;
      if (email && users.find(u => u.email === email)) {
        showError('signupEmailError', 'This email address is already registered');
      } else {
        document.getElementById('signupEmailError').style.display = 'none';
        this.classList.remove('error');
      }
    });