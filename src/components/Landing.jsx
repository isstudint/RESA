import { Routes, Route, useNavigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import Navbar from './Nav.jsx';
import Button from './Button.jsx';
import '../css/style.css';
function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);

  // Array of different models (you can add more models here)
  const models = [
    { 
      name: 'Model 1', 
      path: '/resa.glb',
      hotspots: [
        { position: '5m 0m 0m', title: 'Building Size', description: 'Total: 450 sq.m' },
        { position: '1.91m 1.5m 0m', title: 'Interior', description: 'Living: 120 sq.m' },
        { position: '0.61m -0.46m 1.29m', title: 'Floor Area', description: 'Ground: 150 sq.m' },
        { position: '10m 1m 2m', title: 'Commercial Units', description: 'Each: 45 sq.m' }
      ]
    },
    { 
      name: 'Model 2', 
      path: '/try.glb',
      hotspots: []
    },
    { 
      name: 'Model 3', 
      path: '/resa.glb',
      hotspots: []
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      {/* 1ST SECTION - PARALLAX HERO */}
      <section className="hero-section">
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="hero-text">
            <h1 className="hero-title">STRUCTIV</h1>
            <p className="hero-subtitle">powered by RESA</p>
            <p className="hero-description">
              An innovative system made for Piazza Amariluna Commercial Unit
              that allows you to explore and acquire a unit of your very own
              home.
            </p>
            <Button onClick={handleLoginClick} text={{ first: "Get", last: "Started" }} />
          </div>
        </div>

        <div className="hero-background" style={{ transform: `translateY(${scrollY * 0.3}px)` }}>
          <img src="./images/untitled.png" alt="" />
        </div>
      </section>

      {/* Arrow Down Indicator */}
      <div className="scroll-indicator">
        <div className="arrow-down">↓</div>
      </div>

      {/*  2ND SECTION - 3 IMAGE CARDS */}
      <section className="content-section">
        <div className="container">
          <h2>LOREM IPSUM</h2>
          <p className="section-subtitle">KHDJKSHD</p>
          
          <div className="cards-container">
            <div className="image-card">
              <div className="card-image">
                <img src="/public/section.png" alt="" />
              </div>
            </div>
            <div className="image-card">
              <div className="card-image">
                <img src="/public/section.png" alt="" />
              </div>
            </div>
            <div className="image-card">
              <div className="card-image">
                <img src="/public/section.png" alt="" />
              </div>
            </div>
          </div>

          <p className="section-description">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisque faucibus ex sapien vitae 
            pellentesque sem placerat. In id cursus mi pretium duis
          </p>
        </div>
      </section>

      {/* Third Section - Model Viewer with Switcher */}
      <section className="third-section">
        <h2>Building Showcase</h2>
        <p>Choose a model to explore in 3D. Click and drag to rotate.</p>
        
        {/* Model Switcher Buttons */}
        <div className="model-switcher">
          {models.map((model, index) => (
            <button
              key={index}
              className={`model-btn ${selectedModel === index ? 'active' : ''}`}
              onClick={() => setSelectedModel(index)}
            >
              {model.name}
            </button>
          ))}
        </div>

        <model-viewer
          src={models[selectedModel].path}
          alt="RESA 3D Model"
          ar
          disable-tap
          environment-image="/public/brown_photostudio_02_2k.hdr"
          camera-controls
          shadow-intensity="2"
          loading="eager"
          reveal="auto"
          max-camera-orbit="auto auto 20m"
          interpolation-decay="50"
        >
          {/* Dynamic Hotspots based on selected model */}
          {models[selectedModel].hotspots.map((hotspot, index) => (
            <button 
              key={index}
              className="hotspot" 
              slot={`hotspot-${index + 1}`}
              data-position={hotspot.position}
              data-normal="0m 1m 0m"
            >
              <div className="hotspot-annotation">
                <div className="hotspot-title">{hotspot.title}</div>
                <div className="hotspot-description">{hotspot.description}</div>
              </div>
            </button>
          ))}
        </model-viewer>
      </section>
    </>
  );

}

export default HomePage;
