$(document).ready(function() {
    function toggleForm(formId) {
        if (formId === 'signup') {
            $('#login').hide();
            $('#signup').show();
        } else if (formId === 'login') {
            $('#signup').hide();
            $('#login').show();
        }
    }

    $('a[href="#signup"]').click(function(e) {
        e.preventDefault();
        toggleForm('signup');
    });

    $('a[href="#login"]').click(function(e) {
        e.preventDefault();
        toggleForm('login');
    });

    $('#loginForm').submit(function(e) {
        e.preventDefault();
        const email = $('#login-email').val();
        const password = $('#login-password').val();
        const data = { email, password };

        fetch('https://my-react-app-v8ai.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                console.log('Login successful:', data);
                localStorage.setItem('authToken', data.token);
                window.location.href = './account.html';
            } else {
                console.error('Login failed:', data.message);
                alert('Login failed: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed: Please try again later');
        });
    });

    $('#signupForm').submit(function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const email = $('#signup-email').val();
        const password = $('#signup-password').val();
        const phoneNumber = $('#signup-number').val();
        console.log('Email:', email); // Debug statement to check email
        console.log('Password:', password); // Debug statement to check password
        console.log('username:', username); // Debug statement to check email
        console.log('Phonenumber:', phoneNumber);
        
        const data = { username, email, password, phoneNumber };

        fetch('https://my-react-app-v8ai.onrender.com/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Registration failed:', err);
                    throw new Error(err.message || 'Registration failed');
                });
            }
            return response.json();
        })
        .then(responseData => {
            alert('Thank you for signing up');
            localStorage.setItem('authToken', responseData.token); // Use responseData to get the token
            window.location.href = './account.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Registration failed: Please try again later');
        });
    });

    // Function to handle logout
    function handleLogout() {
        // Debugging: Check if handleLogout is called
        console.log("Logout button clicked");

        // Remove authToken from localStorage
        localStorage.removeItem('authToken');
        // Redirect to login page
        window.location.href = './signup.html'; // Adjust path as needed
    }

    // Event listener for logout button click
    $('#logoutBtn').click(function(e) {
        e.preventDefault();
        handleLogout();
    });

});
