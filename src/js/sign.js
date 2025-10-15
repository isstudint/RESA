const formPanel = document.getElementById('form-panel');
        const imagePanel = document.getElementById('image-panel');
        const authImage = document.getElementById('auth-image');

        // State management for the current view ('signin' or 'signup')
        let currentView = 'signin';
        let isTransitioning = false;

        const IMAGE_URL = "./images/untitled.png";

        /**
         * Generates the HTML string for either the Sign In or Sign Up form.
         * @param {string} type - 'signin' or 'signup'
         * @returns {string} The HTML string for the form.
         */
        function createFormContent(type) {
            const isSignUp = type === 'signup';
            
            // This logic still controls the side swap
            if (isSignUp) {
                // Sign Up: Image moves to the LEFT (order-1), Form to the RIGHT (order-2)
                formPanel.classList.add('order-2');
                formPanel.classList.remove('order-1');
                imagePanel.classList.add('order-1');
                imagePanel.classList.remove('order-2');
            } else {
                // Sign In: Form moves to the LEFT (order-1), Image to the RIGHT (order-2)
                formPanel.classList.add('order-1');
                formPanel.classList.remove('order-2');
                imagePanel.classList.add('order-2');
                imagePanel.classList.remove('order-1');
            }

            authImage.src = IMAGE_URL;

            if (isSignUp) {
                // Sign Up Form
                return `
                    <h2 class="form-title">Sign Up</h2>
                    
                    <form onsubmit="handleAuthSubmit(event, 'signup')" class="form-layout">
                        <div class="form-group">
                            <input type="text" id="signup-first-name" name="firstName" placeholder="First Name" required
                                class="form-input"
                            />
                            <input type="text" id="signup-last-name" name="lastName" placeholder="Last Name" required
                                class="form-input"
                            />
                        </div>
                        <input type="text" id="signup-username" name="username" placeholder="Username" required
                            class="form-input"
                        />
                        <input type="email" id="signup-email" name="email" placeholder="Email" required
                            class="form-input"
                        />
                        <input type="password" id="signup-password" name="password" placeholder="Password" required
                            class="form-input"
                        />
                        <input type="password" id="signup-confirm-password" name="confirmPassword" placeholder="Confirm Password" required
                            class="form-input"
                        />

                        <button type="submit" class="btn-primary">
                            Sign Up
                        </button>
                    </form>
                    
                    <div class="switch-link-container">
                        <a href="#" onclick="switchToSignIn(); return false;" class="switch-link">
                            Already have an Account? Sign In
                        </a>
                    </div>
                `;
            } else { // Sign In Form
                return `
                    <h2 class="form-title">Sign In</h2>
                    
                    <form onsubmit="handleAuthSubmit(event, 'signin')" class="form-layout">
                        <input type="email" id="signin-email" name="email" placeholder="Email" required
                            class="form-input"
                        />
                        <input type="password" id="signin-password" name="password" placeholder="Password" required
                            class="form-input"
                        />
                        
                        <div class="forgot-password">
                            <a href="#">Forgot Password?</a>
                        </div>

                        <button type="submit" class="btn-primary">
                            Login
                        </button>
                    </form>

                    <div class="form-divider"><span>Or</span></div>

                    <button onclick="switchToSignUp()" class="btn-link">
                        Register a new account
                    </button>
                `;
            }
        }


        /**
         * Main function to render the correct authentication form based on current state with fade transitions.
         */
        window.renderAuthForm = function(isInitialRender = false) {
            // Wait for DOM elements to be available
            setTimeout(() => {
                const formPanel = document.getElementById('form-panel');
                const imagePanel = document.getElementById('image-panel');
                const authImage = document.getElementById('auth-image');
                
                if (!formPanel || !imagePanel || !authImage) {
                    console.log('DOM elements not ready yet, retrying...');
                    window.renderAuthForm(isInitialRender);
                    return;
                }
                
                const FADE_DURATION = 400;
                
                if (formPanel.innerHTML && !isInitialRender) {
                    isTransitioning = true;
                    
                    // 1. Start the fade-out animation
                    formPanel.classList.add('form-fade-out');
                    
                    // Wait for the animation duration (0.4s) before content replacement
                    setTimeout(() => {
                        // 2. Clear fade-out and replace content
                        formPanel.classList.remove('form-fade-out');
                        formPanel.innerHTML = createFormContent(currentView);
                        
                        // 3. Start the fade-in animation
                        formPanel.classList.add('form-fade-in');

                        // Wait for fade-in duration
                        setTimeout(() => {
                            // 4. Clean up and allow next transition
                            formPanel.classList.remove('form-fade-in');
                            isTransitioning = false;
                        }, FADE_DURATION);

                    }, FADE_DURATION);

                } else {
                    // Initial render (no animation needed)
                    formPanel.innerHTML = createFormContent(currentView);
                }
            }, 100);
        }

        /**
         * Public function to switch to the Sign Up view.
         */
        window.switchToSignUp = () => {
            if (isTransitioning || currentView === 'signup') return;
            currentView = 'signup';
            renderAuthForm();
        };

        /**
         * Public function to switch to the Sign In view.
         */
        window.switchToSignIn = () => {
            if (isTransitioning || currentView === 'signin') return;
            currentView = 'signin';
            renderAuthForm();
        };

        /**
         * Placeholder submission handler. This simulates sending data to a server.
         */
        window.handleAuthSubmit = (event, type) => {
            event.preventDefault();
            const form = event.target;
            
            console.log(`Submitting ${type} form data.`);
            
            // --- Mock Submission Feedback ---
            const button = form.querySelector('button[type="submit"]');
            button.textContent = 'Submitted! (Placeholder)';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = type === 'signin' ? 'Login' : 'Sign Up';
                button.disabled = false;
                // In a real application, a redirect or success message would happen here.
            }, 2000);
        };

        // Initial render when the document is ready
        renderAuthForm(true);
