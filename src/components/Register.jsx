import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Regist.css';

function Register() {
    // State: Variables that update the UI
    const [isSignUp, setIsSignUp] = useState(false);  // Toggle: login or signup
    const [error, setError] = useState('');            // Error message
    const [success, setSuccess] = useState('');        // Success message
    const [loading, setLoading] = useState(false);     // Loading state
    const navigate = useNavigate();                    // For changing pages


    // Switch to signup form
    const switchToSignUp = (e) => { 
        e.preventDefault(); 
        setIsSignUp(true); 
        setError(''); 
        setSuccess(''); 
    };
    
    // Switch to login form
    const switchToSignIn = (e) => { 
        e.preventDefault(); 
        setIsSignUp(false); 
        setError(''); 
        setSuccess(''); 
    };

    // Handle form submission (login or signup)
    const handleSubmit = async (e) => {
        e.preventDefault();  // Don't refresh page
        setError('');
        setSuccess('');
        setLoading(true);

        // Get all form fields
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);

        // Choose API: /api/register or /api/login
        const url = isSignUp ? '/api/register' : '/api/login';

        try {
            // Send data to backend
            const response = await fetch(`http://localhost:5000${url}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            // Check if successful
            if (response.ok) {
                setSuccess(result.message);
                
                // If LOGIN: save user and go to dashboard
                if (!isSignUp) {
                    if (result.user.role === 'admin') {
                        setTimeout(() => navigate('/dash_admin'), 1000);
                    } else {
                        setTimeout(() => navigate('/dash_user'), 1000);
                    }
                    localStorage.setItem('user', JSON.stringify(result.user));
                } 
                // If SIGNUP: switch to login form
                else {
                    setTimeout(() => {
                        setIsSignUp(false);
                        setSuccess('Registration successful! Please sign in.');
                    }, 1500);
                }
            } else {
                // Show error
                setError(result.error || 'Something went wrong');
            }
        } catch {
            // Connection error
            setError('Cannot connect to server. Make sure the backend is running.');
        } finally {
            // Always turn off loading
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="bg-pattern" aria-hidden>
                <div className="circle circle-large-tl"></div>
                <div className="circle circle-medium-tl"></div>
                <div className="circle circle-large-br"></div>
                <div className="circle circle-medium-br"></div>
            </div>

            <div className="structiv-logo">STRUCTIV</div>

            <div className={`auth-card ${isSignUp ? 'signup-mode' : ''}`}>

                {/* Image panel (slides left/right depending on mode) */}
                <div className="image-panel" aria-hidden={isSignUp ? "false" : "true"}>
                    <img src="/src/images/hero.png" alt="Hero visual" />
                </div>

                {/* Form panel (slides opposite direction) */}
                <div className="form-panel" role="region" aria-label={isSignUp ? "Sign up form" : "Sign in form"}>
                    {/* Title */}
                    <h2 className="form-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

                    {/* Error/Success Messages */}
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="form-layout">
                        {isSignUp && (
                            <>
                                <div className="form-group">
                                    <input className="form-input" type="text" name="firstName" placeholder="First Name" required />
                                    <input className="form-input" type="text" name="lastName" placeholder="Last Name" required />
                                </div>
                                <input className="form-input" type="text" name="username" placeholder="Username" required />
                                <input className="form-input" type="tel" name="contactNumber" placeholder="Contact Number" />
                            </>
                        )}

                        <input className="form-input" type="email" name="email" placeholder="Email" required />
                        <input className="form-input" type="password" name="password" placeholder="Password" required />

                        {isSignUp && (
                            <input className="form-input" type="password" name="confirmPassword" placeholder="Confirm Password" required />
                        )}

                        {!isSignUp && (
                            <div className="forgot-password">
                                <a href="#" onClick={(e)=>e.preventDefault()}>Forgot Password?</a>
                            </div>
                        )}

                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
                        </button>
                    </form>

                    {/* Switch controls */}
                    {!isSignUp ? (
                        <>
                            <div className="form-divider"><span>Or</span></div>
                            <button type="button" className="btn-link" onClick={switchToSignUp}>Register a new account</button>
                        </>
                    ) : (
                        <div className="switch-link-container">
                            <a href="#" onClick={switchToSignIn} className="switch-link">Already have an account? Sign In</a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;
