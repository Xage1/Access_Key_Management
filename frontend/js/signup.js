document.getElementById('signup-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
  
    const response = await fetch('/api/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, confirmPassword }),
    });
  
    const result = await response.json();
    if (response.ok) {
      alert('Signup successful. Please check your email to verify your account.');
      // Redirect or handle signup success
    } else {
      alert(`Signup failed: ${result.message}`);
    }
  });
  