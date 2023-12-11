// SignIn.js
import { useState } from 'react';
import { authenticateUser } from './mockAPI'; 

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();

    const token = authenticateUser(username, password);

    if (token) {
      // Mock authentication was successful, store the token
      localStorage.setItem('token', token);
      // Redirect to the data dashboard
      window.location.href = '/dataDashboard';
    } else {
      // Mock authentication failed, produce an error message
      setError('Invalid username or password');
    }
  }

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSignIn}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
