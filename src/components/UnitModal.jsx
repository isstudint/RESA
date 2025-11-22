import React, { useState } from "react";
import "../css/unit_modal.css";

function UnitModal({ unit, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!unit) return null;

  // Parse images array
  let images = [];
  try {
    if (unit.images) {
      if (typeof unit.images === "string") {
        images = JSON.parse(unit.images);
      } else if (Array.isArray(unit.images)) {
        images = unit.images;
      }
    }
  } catch (error) {
    console.error("Error parsing images:", error);
  }

  // Fallback to default image if no images
  if (images.length === 0) {
    images = ["/section.png"];
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getCurrentImageSrc = () => {
    const imagePath = images[currentImageIndex];
    return imagePath.startsWith("/uploads")
      ? `http://localhost:5000${imagePath}`
      : imagePath;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-image">
          <img
            src={getCurrentImageSrc()}
            alt={`${unit.name} - Image ${currentImageIndex + 1}`}
            onError={(e) => {
              e.target.src = "/section.png";
            }}
          />

          {/* Image Navigation Arrows - Only show if multiple images */}
          {images.length > 1 && (
            <>
              <button className="image-nav-btn prev" onClick={handlePrevImage}>
                ‹
              </button>
              <button className="image-nav-btn next" onClick={handleNextImage}>
                ›
              </button>
              <div className="image-counter">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        <div className="modal-body">
          <h2>{unit.name}</h2>

          <div className="modal-details">
            <div className="detail-item">
              <span className="detail-label">Size</span>
              <span className="detail-value">{unit.size} sq.m</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Price</span>
              <span className="detail-value">
                ₱{unit.price?.toLocaleString()}/month
              </span>
            </div>
          </div>

          <div className="modal-status">
            <span className="status-label">Status</span>
            <span className={`status-badge ${unit.status.toLowerCase()}`}>
              {unit.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnitModal;
