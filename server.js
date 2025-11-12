const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const safeName = Date.now() + '_' + file.originalname.replace(/\s+/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({ storage });

// POST /upload - expects multipart/form-data with field 'file'
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = '/uploads/' + req.file.filename;
  res.json({ url });
});

// GET /uploads - returns JSON array of upload URLs
app.get('/uploads', (req, res) => {
  fs.readdir(uploadsDir, (err, files) => {
    if (err) return res.status(500).json([]);
    const urls = files.filter(f => !f.startsWith('.')).map(f => '/uploads/' + f);
    res.json(urls);
  });
});

// serve uploaded files
app.use('/uploads', express.static(uploadsDir));
// serve the rest of the project statically from this folder
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => {
  console.log(`Birthday server running: http://localhost:${PORT}`);
});
