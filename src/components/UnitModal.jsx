import React from 'react';
import '../css/unit_modal.css';

function UnitModal({ unit, onClose }) {
  if (!unit) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-image">
          <img src={unit.image} alt={unit.name} />
        </div>

        <div className="modal-body">
          <h2>{unit.name}</h2>
          <p className="modal-location">{unit.location}</p>
          
          <div className="modal-details">
            <div className="detail-item">
              <span className="detail-label">Size</span>
              <span className="detail-value">{unit.size} sq.m</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Rooms</span>
              <span className="detail-value">{unit.rooms} Rooms</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Price</span>
              <span className="detail-value">${unit.price.toLocaleString()}/month</span>
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
