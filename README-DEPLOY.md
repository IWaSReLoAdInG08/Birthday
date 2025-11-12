Deployment notes — Vercel

Goal
- Allow users to draw on the canvas and persist those drawings so they appear after redeploys/visits.

Why earlier upload failed on Vercel
- Vercel serverless functions run in an ephemeral environment; writing files to disk is not persistent across invocations or deploys.
- A standalone Express `server.js` (that writes to a local `uploads/` folder) will not provide persistent storage on Vercel.

Recommended approach (implemented in this repo)
- Use a cloud storage provider (Cloudinary, Supabase Storage, or S3) and a serverless API that uploads the canvas image to that storage.
- This repo includes Vercel-style serverless functions in `api/` that upload to Cloudinary.

What I added
- `api/upload.js` — accepts POST JSON { image: dataURL } and uploads to Cloudinary, returns the secure URL.
- `api/uploads.js` — returns a JSON array of previously uploaded image URLs from Cloudinary.
- `scripts/memories.js` — updated to POST the data URL as JSON to `/api/upload` and fetch `/api/uploads`.
- `package.json` — added `cloudinary` dependency for local testing and Vercel builds.

Environment variables (Vercel)
- Set the following in your Vercel project settings (Environment Variables):
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`

Local testing (optional)
1. Install dependencies locally:

```powershell
cd "C:\Users\SK VERMA\Desktop\BirthDay\Birthday"
npm install
```

2. If you want to run the simple Express dev server (server.js) that saves to local `uploads/` folder:

```powershell
npm start
```

Then open `http://localhost:3000/memories.html` in the browser and test drawing/uploading.

Deploying to Vercel
1. Push this repo to GitHub (or link with Vercel).
2. In Vercel dashboard, add the three Cloudinary env vars.
3. Deploy. The client will call `/api/upload` and `/api/uploads` on the same origin.

If you prefer a different provider (Supabase Storage, S3, or Cloudinary unsigned uploads), tell me and I can adjust the serverless functions.
