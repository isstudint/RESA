import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navbar from "./Nav.jsx";
import Button from "./Button.jsx";
import "../css/style.css";

function HomePage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [selectedModel, setSelectedModel] = useState(0);
  const [isModelLoading, setIsModelLoading] = useState(false);

  const sectionRefs = useRef([]);
  const modelViewerRef = useRef(null);

  // Array of different models (you can add more models here)
  const models = [
    {
      name: "Model 1",
      path: "/resa.glb",
      hotspots: [
        {
          position: "5m 0m 0m",
          title: "Building Size",
          description: "Total: 450 sq.m",
        },
        {
          position: "1.91m 1.5m 0m",
          title: "Interior",
          description: "Living: 120 sq.m",
        },
        {
          position: "0.61m -0.46m 1.29m",
          title: "Floor Area",
          description: "Ground: 150 sq.m",
        },
        {
          position: "10m 1m 2m",
          title: "Commercial Units",
          description: "Each: 45 sq.m",
        },
      ],
    },
    {
      name: "Model 2",
      path: "/try.glb",
      hotspots: [],
    },
    {
      name: "Model 3",
      path: "/resa.glb",
      hotspots: [],
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
      <section className="hero-section">
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
            <p className="hero-subtitle-small">Immersive approach</p>
            <p className="hero-description-left">
              An innovative system made for Piazza Amariluna Commercial Unit
              that allows you to explore and acquire a unit of your very own
              home.
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
        className="split-section scroll-animate"
        ref={(el) => (sectionRefs.current[0] = el)}
      >
        <div className="split-container">
          <div className="split-text">
            <h2>
              Decorative stone grating
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
          <h2 className="huge-text">Made to matter</h2>
          <div className="typography-content">
            <p>
              Contemporary engineered stonework solutions. Built for everyday
              living, from the ground up.
            </p>
          </div>
        </div>
      </section>

      {/* 5TH SECTION - 3D MODEL VIEWER */}
      <section
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
            style={{ touchAction: "none" }}
            environment-image="/brown_photostudio_02_2k.hdr"
            shadow-intensity="2"
            loading="eager"
            reveal="auto"
            min-camera-orbit="auto auto 5m"
            max-camera-orbit="auto auto 20m"
            camera-orbit="0deg 75deg 12m"
            interpolation-decay="50"
            interaction-prompt="none"
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
                  <div className="hotspot-description">
                    {hotspot.description}
                  </div>
                </div>
              </button>
            ))}
          </model-viewer>
        </div>
      </section>
    </>
  );
}

export default HomePage;
