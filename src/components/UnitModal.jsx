import React, { useState } from "react";
import "../css/unit_modal.css";
import { getAllUnitImages } from "../utils/imageUtils";

function UnitModal({ unit, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!unit) return null;

  const images = getAllUnitImages(unit);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getCurrentImageSrc = () => {
    // The utility returns full paths/URLs now
    return images[currentImageIndex];
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
