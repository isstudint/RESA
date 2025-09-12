const express = require('express');
const app = express();
const PORT = 8000;

// Serve static files from the current directory
app.use(express.static('.'));

// Start the server on all network interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at:`);
  console.log(`- Local: http://localhost:${PORT}/`);
  console.log(`- Network: http://192.168.1.8:${PORT}/`);
  console.log(`\nOn your phone, visit:`);
  console.log(`http://192.168.1.8:${PORT}/3d-building-viewer.html`);
});
