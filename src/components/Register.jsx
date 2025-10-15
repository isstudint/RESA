import React, { useState } from 'react';
import '../css/Regist.css';

function Register() {
    const [isSignUp, setIsSignUp] = useState(false);

    const switchToSignUp = (e) => { e.preventDefault(); setIsSignUp(true); };
    const switchToSignIn = (e) => { e.preventDefault(); setIsSignUp(false); };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(isSignUp ? 'Sign Up submitted' : 'Sign In submitted');
        // place actual submit logic here
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

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="form-layout">
                        {isSignUp && (
                            <>
                                <div className="form-group">
                                    <input className="form-input" type="text" name="firstName" placeholder="First Name" required />
                                    <input className="form-input" type="text" name="lastName" placeholder="Last Name" required />
                                </div>
                                <input className="form-input" type="text" name="username" placeholder="Username" required />
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

                        <button type="submit" className="btn-primary">{isSignUp ? 'Sign Up' : 'Login'}</button>
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
