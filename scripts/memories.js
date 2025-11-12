// Fade-in animation for timeline items
document.addEventListener('DOMContentLoaded', function() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  const closingMessage = document.querySelector('.closing-message');
  const confessionSection = document.querySelector('.confession-section');
  const forYouSection = document.querySelector('.for-you-section');
  const surpriseBtn = document.getElementById('surprise-btn');
  const surpriseMessage = document.getElementById('surprise-message');

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('fade-in');
        }, index * 150);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  timelineItems.forEach(item => {
    observer.observe(item);
  });

  if (closingMessage) {
    observer.observe(closingMessage);
  }

  if (confessionSection) {
    observer.observe(confessionSection);
  }

  if (forYouSection) {
    observer.observe(forYouSection);
  }

  // Surprise button functionality
  if (surpriseBtn && surpriseMessage) {
    surpriseBtn.addEventListener('click', function() {
      surpriseMessage.hidden = !surpriseMessage.hidden;
      if (!surpriseMessage.hidden) {
        surpriseBtn.textContent = '💜';
        surpriseBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
          surpriseBtn.style.transform = 'scale(1)';
        }, 200);
      }
    });
  }

  /* --- Leave Your Mark (canvas) --- */
  // Upload server base (defaults to same origin). You can override by setting window.UPLOAD_BASE
  // When deployed to Vercel the API endpoints are at /api/upload and /api/uploads
  const UPLOAD_BASE = window.UPLOAD_BASE || '';
  const canvas = document.getElementById('signature-canvas');
  if (canvas && window.SignaturePad) {
    // resize canvas to proper pixel ratio
    function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const signaturePad = new SignaturePad(canvas, {
      backgroundColor: 'rgba(255,255,255,0)',
      penColor: '#222'
    });

    const clearBtn = document.getElementById('clear-canvas');
    const saveBtn = document.getElementById('save-canvas');

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        signaturePad.clear();
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', async () => {
        if (signaturePad.isEmpty()) {
          // nothing drawn
          saveBtn.textContent = 'Draw something first';
          setTimeout(() => saveBtn.textContent = 'Save', 1200);
          return;
        }
        try {
          saveBtn.disabled = true;
          saveBtn.textContent = 'Uploading...';
          // Send the dataURL as JSON to serverless API (works on Vercel)
          const dataUrl = signaturePad.toDataURL('image/png');
          const uploadResp = await fetch(UPLOAD_BASE + '/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: dataUrl })
          });

          if (!uploadResp.ok) throw new Error('Upload failed');

          // show success
          saveBtn.textContent = 'Saved';
          createSparkles(12, canvas);

          // refresh uploaded gallery if server provides a listing endpoint
          loadUploads();
        } catch (err) {
          console.error(err);
          saveBtn.textContent = 'Upload failed';
          setTimeout(() => saveBtn.textContent = 'Save', 1500);
        } finally {
          saveBtn.disabled = false;
        }
      });
    }

    // sparkles on pointerup (when drawing finishes)
    canvas.addEventListener('pointerup', () => {
      if (!signaturePad.isEmpty()) createSparkles(6, canvas);
    });

    // create simple sparkles attached to canvas
    function createSparkles(count, target) {
      const rect = target.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = (rect.left + Math.random() * rect.width) + 'px';
        s.style.top = (rect.top + Math.random() * rect.height) + 'px';
        s.style.background = ['#ffd166','#f6b7c1','#9b59b6','#f8c471'][Math.floor(Math.random()*4)];
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 900);
      }
    }

    // attempt to load previously uploaded drawings from server
    async function loadUploads() {
      const gallery = document.getElementById('uploaded-gallery');
      if (!gallery) return;
      try {
  const r = await fetch(UPLOAD_BASE + '/uploads'); // expects JSON array of image URLs
        if (!r.ok) return;
        const list = await r.json();
        gallery.innerHTML = '';
        list.forEach(url => {
          const img = document.createElement('img');
          img.src = url;
          img.alt = 'Uploaded doodle';
          gallery.appendChild(img);
        });
      } catch (e) {
        // ignore if endpoint not present
      }
    }

    // initial load of existing uploads
    loadUploads();
  }
});

