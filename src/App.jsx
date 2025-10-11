import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Navbar from './components/Nav.jsx';
import Button from './components/button.jsx';
import './css/style.css';

function HomePage() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      {/* 1ST SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">STRUCTIV</h1>
            <p className="hero-subtitle">powered by RESA</p>
            <p className="hero-description">
              An innovative system made for Piazza Amariluna Commercial Unit
              that allows you to explore and acquire a unit of your very own
              home.
            </p>
            <Button onClick={handleLoginClick} text="Get Started" />
          </div>
        </div>

        <div className="hero-background">
          <img src="./images/untitled.png" alt="" />
        </div>
      </section>

      {/* Arrow Down Indicator */}
      <div className="scroll-indicator">
        <div className="arrow-down">↓</div>
      </div>

      {/*  2ND SECTION */}
      <section className="content-section">
        <div className="container">
          <h2>Welcome to Structiv</h2>
          <p>Explore our innovative approach to real estate visualization.</p>
        </div>
      </section>

      {/* Third Section - Simple Model Viewer */}
      <section className="third-section">
        <h2>Building Showcase</h2>
        <p>Explore our designs in 3D. Click and drag to rotate the model.</p>
        <model-viewer
          src="/public/resa.glb"
          alt="RESA 3D Model"
          ar
<<<<<<< Updated upstream
          disable-tap
=======

>>>>>>> Stashed changes
          environment-image="/public/brown_photostudio_02_2k.hdr"
          camera-controls
          shadow-intensity="2"
          loading="eager"
          reveal="auto"
          max-camera-orbit="auto auto 30m"
          interpolation-decay="30"
        ></model-viewer>
      </section>
    </>
  );
}

function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Nav" element={<Navbar />} />
        <Route path="/button" element={<Button />} />
      </Routes>
    </main>
  );

  
}

export default App;
