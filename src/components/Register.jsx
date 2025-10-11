import React from 'react';
import '../css/Regist.css';

function Register() {
    return (
        <body>
            <div className="bg-pattern">
                <div className="circle circle-large-tl"></div>
                <div className="circle circle-medium-tl"></div>
                <div className="circle circle-large-br"></div>
                <div className="circle circle-medium-br"></div>
            </div>
            

            <div className="structiv-logo">STRUCTIV</div>

            <div className="auth-card">

                <div id="image-panel" className="image-panel">
                    <img id="auth-image" 
                        src="./images/untitled.png"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://placehold.co/450x600/b0b0b0/444444?text=Property+Image'; }}
                        alt="Commercial Unit" 
                        className="img-right-side" 
                    />
                </div>

               
                <div id="form-panel" className="form-panel">
                   
                </div>
            </div>
        </body>
    );
}
export default Register;