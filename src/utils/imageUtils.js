export const getUnitThumbnail = (unit) => {
  try {
    let images = [];
    if (unit.images) {
      if (typeof unit.images === "string") {
        images = JSON.parse(unit.images);
      } else if (Array.isArray(unit.images)) {
        images = unit.images;
      }
    }
    const imagePath = images && images.length > 0 ? images[0] : "/section.png";
    return imagePath.startsWith("/uploads")
      ? `http://localhost:5000${imagePath}`
      : imagePath;
  } catch (error) {
    console.error("Error parsing images:", error);
    return "/section.png";
  }
};

export const getAllUnitImages = (unit) => {
  try {
    let images = [];
    if (unit.images) {
      if (typeof unit.images === "string") {
        images = JSON.parse(unit.images);
      } else if (Array.isArray(unit.images)) {
        images = unit.images;
      }
    }

    if (images.length === 0) return ["/section.png"];

    // Return paths, caller handles localhost prefix if needed,
    // but looking at existing code, it seems inconsistent.
    // Let's standardize to return full URLs or paths that can be used directly.
    // The existing code checks startsWith("/uploads") and prepends localhost.

    return images;
  } catch (error) {
    console.error("Error parsing images:", error);
    return ["/section.png"];
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/section.png";
  return imagePath.startsWith("/uploads")
    ? `http://localhost:5000${imagePath}`
    : imagePath;
};
