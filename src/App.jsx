import './css/style.css';
function App() {
  return (
    <main className="App">
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo-nav">
            <h1 className="logo">STRUCTIV</h1>
          </div>

          <div className="nav-menu">
            <a href="#home" className="nav-link">
              Home
            </a>
            <a href="#faq" className="nav-link">
              FAQ
            </a>
            <a href="#booking" className="nav-link">
              Booking
            </a>
            <a href="#showcase" className="nav-link">
              Showcase
            </a>
          </div>
        </div>
      </nav>

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
            <button className="cta-button">Book now</button>
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
          environment-image="/public/brown_photostudio_02_2k.hdr"
          camera-controls
          shadow-intensity="2"
          loading="eager"
          reveal="auto"
        ></model-viewer>
      </section>
    </main>
  );

  
}

export default App;
