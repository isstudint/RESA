import React, { useState, useEffect } from "react";
import "../css/dash_admin.css";

function AdminUnitModal({ unit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    price: "",
    images: [],
    status: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (unit) {
      const images =
        typeof unit.images === "string"
          ? JSON.parse(unit.images || "[]")
          : unit.images || [];
      setFormData({
        name: unit.name || "",
        size: unit.size || "",
        price: unit.price || "",
        images: images,
        status: unit.status || "Available",
      });
    }
  }, [unit]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (index) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleRemoveNewImage = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let uploadedImages = [...formData.images];

      // Upload new images if any
      if (selectedFiles.length > 0) {
        const formDataUpload = new FormData();
        selectedFiles.forEach((file) => {
          formDataUpload.append("images", file);
        });

        const uploadRes = await fetch(
          "http://localhost:5000/api/units/upload-images",
          {
            method: "POST",
            body: formDataUpload,
          }
        );

        if (uploadRes.ok) {
          const { images } = await uploadRes.json();
          uploadedImages = [...uploadedImages, ...images];
        } else {
          const error = await uploadRes.json();
          throw new Error(error.error || "Failed to upload images");
        }
      }

      // Save unit with all images
      const updatedUnit = {
        ...formData,
        images: uploadedImages,
      };

      const saveRes = await fetch(
        `http://localhost:5000/api/units/${unit.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUnit),
        }
      );

      if (saveRes.ok) {
        onSave({ ...unit, ...updatedUnit });
        onClose();
      } else {
        const error = await saveRes.json();
        throw new Error(error.error || "Failed to save unit");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-large">
        <div className="modal-header">
          <h3>Edit Unit</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Unit Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Size (sqm)</label>
            <input
              type="number"
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Price (₱)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          {/* Existing Images */}
          {formData.images.length > 0 && (
            <div className="form-group">
              <label>Current Images</label>
              <div className="image-preview-grid">
                {formData.images.map((url, index) => (
                  <div key={`existing-${index}`} className="image-preview-item">
                    <img
                      src={
                        url.startsWith("/uploads")
                          ? `http://localhost:5000${url}`
                          : url
                      }
                      alt={`Existing ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "/section.png";
                      }}
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveExistingImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images */}
          {selectedFiles.length > 0 && (
            <div className="form-group">
              <label>New Images to Upload</label>
              <div className="image-preview-grid">
                {selectedFiles.map((file, index) => (
                  <div key={`new-${index}`} className="image-preview-item">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => handleRemoveNewImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Add More Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="file-input"
            />
            <p className="file-hint">
              You can select multiple images (max 10 total, 5MB each)
            </p>
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="form-select"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div className="modal-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </button>
            <button type="submit" className="save-btn" disabled={uploading}>
              {uploading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUnitModal;
