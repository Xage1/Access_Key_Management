document.getElementById('login-form').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('/api/v1/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    const result = await response.json();
    if (response.ok) {
      alert('Login successful');
      // Redirect or handle login success
    } else {
      alert(`Login failed: ${result.message}`);
    }
  });
  