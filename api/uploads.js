const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  try {
    // list resources in the birthday_uploads folder
    const resp = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'birthday_uploads/',
      max_results: 100
    });

    const urls = (resp.resources || []).map(r => r.secure_url);
    return res.status(200).json(urls);
  } catch (err) {
    console.error('list uploads error', err);
    return res.status(500).json({ error: err.message || 'Could not list uploads' });
  }
};
