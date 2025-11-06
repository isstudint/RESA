import '../css/style.css';

function Button({ onClick, text }) {
    return (
      <button className="cta-button" onClick={onClick}>
        {text.first} <span></span> {text.last}
      </button>
    );
}

export default Button;