import React from 'react';
import '../css/style.css';

function Button({ onClick, text }) {
    return (
      <button className="cta-button" onClick={onClick}>
        {text}
      </button>
    );
}

export default Button;
