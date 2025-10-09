import { useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Welcome ${email}!`);
  };

  return (
    <div style={{ 
      padding: '50px', 
      maxWidth: '300px', 
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{ 
              width: '100%', 
              padding: '10px',
              border: '1px solid #ccc',
              fontSize: '14px'
            }}
            required
          />
        </div>

        <button 
          type="submit"
          style={{ 
            width: '100%',
            padding: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Login
        </button>
      </form>

      <Link to="/" style={{ 
        fontSize: '12px',
        color: '#007bff',
        textDecoration: 'none',
        marginTop: '10px',
        display: 'block'
      }}>
        Back to Home
      </Link>
    </div>
  );
}

export default Login;
