import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Nav.jsx";
import Button from "./Button.jsx";
import Footer from "./Footer.jsx";
import "../css/style.css";

function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const sectionRefs = useRef([]);
  const modelViewerRef = useRef(null);

  // Array of different models
  const models = [
    {
      name: "Model 1",
      path: "/resa.glb",
    },
    {
      name: "Model 2",
      path: "/try.glb",
    },
    {
      name: "Model 3",
      path: "/resa.glb",
    },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    const currentRefs = sectionRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Model change handler with smooth transition
  const handleModelChange = (index) => {
    setIsModelLoading(true);
    setSelectedModel(index);

    // Simulate loading state
    setTimeout(() => {
      setIsModelLoading(false);
    }, 500);
  };

  // Reset camera view to initial position
  const resetView = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.cameraOrbit = "-30deg 75deg 8m";
      modelViewerRef.current.fieldOfView = "45deg";
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  // Calculate parallax layers
  const parallaxBackground = scrollY * 0.5;
  const parallaxForeground = scrollY * 0.2;

  return (
    <>
      <Navbar />

      {/* 1ST SECTION - HERO WITH PARALLAX */}
      <section id="hero" className="hero-section">
        {/* Video/Image Background */}
        <div
          className="hero-background zoom-effect"
          style={{
            transform: `translateY(${parallaxBackground}px)`,
          }}
        >
          {/* TODO: Replace with <video> tag for video background */}
          <img src="/hero.png" alt="" />
        </div>

        {/* Hero Content - Bottom Left */}
        <div
          className="hero-content-bottom-left"
          style={{
            transform: `translateY(${parallaxForeground}px)`,
          }}
        >
          <div className="hero-text-left">
            <p className="hero-subtitle-small">Piazza Amariluna Commercial Unit</p>
            <p className="hero-description-left">
              lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="hero-cta-wrapper">
              <Button onClick={handleLoginClick} text="Get Started" />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="hero-gradient-overlay"></div>
      </section>

      {/* Arrow Down Indicator */}
      <div className="scroll-indicator">
        <div className="arrow-down">↓</div>
      </div>

      {/* 2ND SECTION - SPLIT LAYOUT (Stone Grating) */}
      <section
        id="process"
        className="split-section scroll-animate"
        ref={(el) => (sectionRefs.current[0] = el)}
      >
        <div className="split-container">
          <div className="split-text">
            <h2>
              Lorem Ipsum
              <br />
              for modern urban living.
            </h2>
            <div className="split-cta">
              <p className="lorem-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
          <div className="split-image">
            <img src="/section.png" alt="Stone Grating" />
          </div>
        </div>
      </section>

      {/* 3RD SECTION - ARCHITECTURAL GRID */}
      <section
        className="grid-section scroll-animate"
        ref={(el) => (sectionRefs.current[1] = el)}
      >
        <div className="grid-container-custom">
          <div className="grid-item large">
            <img src="/section.png" alt="Architectural Detail" />
          </div>
          <div className="grid-item small">
            <img src="/section.png" alt="Architectural Detail" />
          </div>
          <div className="grid-item medium">
            <img src="/section.png" alt="Architectural Detail" />
          </div>
        </div>
      </section>

      {/* 4TH SECTION - TYPOGRAPHY (Made to Matter) */}
      <section
        className="typography-section scroll-animate"
        ref={(el) => (sectionRefs.current[2] = el)}
      >
        <div className="typography-container">
          <h2 className="huge-text">Lorem Ipsum tur Vevet</h2>
          <div className="typography-content">
            <p>
              piazza amariluna commercial unit is a modern and innovative system that allows you to explore and acquire a unit of your business.
            </p>
          </div>
        </div>
      </section>

      {/* 5TH SECTION - 3D MODEL VIEWER */}
      <section
        id="showcase"
        className="third-section scroll-animate"
        ref={(el) => (sectionRefs.current[3] = el)}
      >
        <h2>Building Showcase</h2>
        <p>Choose a model to explore in 3D. Click and drag to rotate.</p>

        {/* Model Switcher Buttons */}
        <div className="model-switcher">
          {models.map((model, index) => (
            <button
              key={index}
              className={`model-btn ${selectedModel === index ? "active" : ""}`}
              onClick={() => handleModelChange(index)}
            >
              {model.name}
            </button>
          ))}
        </div>

        {/* Model Viewer Container with Loading State */}
        <div
          className={`model-viewer-container ${
            isModelLoading ? "loading" : ""
          }`}
        >
          {isModelLoading && (
            <div className="model-loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}

          <model-viewer
            ref={modelViewerRef}
            src={models[selectedModel].path}
            alt="RESA 3D Model"
            ar
            camera-controls
            touch-action="pan-y"
            environment-image="/brown_photostudio_02_2k.hdr"
            exposure="1.2"
            shadow-intensity="1.5"
            shadow-softness="0.8"
            tone-mapping="commerce"
            loading="eager"
            reveal="auto"
            min-camera-orbit="-60deg 60deg 3m"
            max-camera-orbit="60deg 90deg 20m"
            camera-orbit="-30deg 75deg 8m"
            field-of-view="45deg"
            interpolation-decay="100"
            interaction-prompt="none"
            disable-pan
          ></model-viewer>

          {/* Reset View Button */}
          <button className="reset-view-btn" onClick={resetView}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M3 21v-5h5" />
            </svg>
            Reset View
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default HomePage;
