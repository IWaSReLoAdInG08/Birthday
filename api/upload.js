const cloudinary = require('cloudinary').v2;

// configure via Vercel environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { image } = req.body || {};
    if (!image) return res.status(400).json({ error: 'Missing image data' });

    // image should be a data URL (data:image/png;base64,...)
    const result = await cloudinary.uploader.upload(image, {
      folder: 'birthday_uploads',
      use_filename: true,
      unique_filename: false
    });

    return res.status(200).json({ url: result.secure_url, raw: result });
  } catch (err) {
    console.error('upload error', err);
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
};
