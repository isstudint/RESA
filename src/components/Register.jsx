import React, { useState } from 'react';
import '../css/Regist.css';

function Register() {
    // Simple state to track if we're showing sign in or sign up
    const [isSignUp, setIsSignUp] = useState(false);

    // Function to switch between sign in and sign up
    const switchToSignUp = () => setIsSignUp(true);
    const switchToSignIn = () => setIsSignUp(false);

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isSignUp ? 'Sign Up submitted' : 'Sign In submitted');
    };

    return (
        <div className="register-page">
            {/* Background circles */}
            <div className="bg-pattern">
                <div className="circle circle-large-tl"></div>
                <div className="circle circle-medium-tl"></div>
                <div className="circle circle-large-br"></div>
                <div className="circle circle-medium-br"></div>
            </div>
            
            {/* Logo */}
            <div className="structiv-logo">STRUCTIV</div>

            {/* Main card */}
            <div className="auth-card">
                {/* Image panel - changes order based on isSignUp */}
                <div className={`image-panel ${isSignUp ? 'order-1' : 'order-2'}`}>
                    <img 
                        src="/src/images/hero.png"
                        alt="Commercial Unit" 
                    />
                </div>
                
                {/* Form panel - changes order based on isSignUp */}
                <div className={`form-panel ${isSignUp ? 'order-2' : 'order-1'}`}>
                    <h2 className="form-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
                    
                    <form onSubmit={handleSubmit} className="form-layout">
                        {/* Sign Up fields */}
                        {isSignUp && (
                            <>
                                <div className="form-group">
                                    <input type="text" placeholder="First Name" required className="form-input" />
                                    <input type="text" placeholder="Last Name" required className="form-input" />
                                </div>
                                <input type="text" placeholder="Username" required className="form-input" />
                            </>
                        )}
                        
                        {/* Common fields */}
                        <input type="email" placeholder="Email" required className="form-input" />
                        <input type="password" placeholder="Password" required className="form-input" />
                        
                        {/* Confirm password for sign up */}
                        {isSignUp && (
                            <input type="password" placeholder="Confirm Password" required className="form-input" />
                        )}
                        
                        {/* Forgot password for sign in */}
                        {!isSignUp && (
                            <div className="forgot-password">
                                <a href="#">Forgot Password?</a>
                            </div>
                        )}

                        <button type="submit" className="btn-primary">
                            {isSignUp ? 'Sign Up' : 'Login'}
                        </button>
                    </form>
                    
                    {/* Switch between forms */}
                    {isSignUp ? (
                        <div className="switch-link-container">
                            <a href="#" onClick={switchToSignIn} className="switch-link">
                                Already have an Account? Sign In
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="form-divider"><span>Or</span></div>
                            <button type="button" onClick={switchToSignUp} className="btn-link">
                                Register a new account
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Register;