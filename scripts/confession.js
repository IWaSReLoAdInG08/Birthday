// Fade-in animation for sections
document.addEventListener('DOMContentLoaded', function() {
  const letterSection = document.querySelector('.letter-section');
  const videoSection = document.querySelector('.video-section');

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  if (letterSection) {
    observer.observe(letterSection);
  }

  if (videoSection) {
    observer.observe(videoSection);
  }

  // Video loading error handling
  const video = document.getElementById('confession-video');
  if (video) {
    video.addEventListener('error', function() {
      const videoWrapper = document.querySelector('.video-wrapper');
      if (videoWrapper) {
        videoWrapper.innerHTML = `
          <div style="padding: 2rem; text-align: center; background: rgba(155, 89, 182, 0.1); border-radius: 12px;">
            <p style="color: #8e44ad; font-weight: 600; margin-bottom: 0.5rem;">Video henüz yüklenmedi</p>
            <p style="color: rgba(55, 59, 65, 0.7); font-size: 0.9rem;">
              Videoyu eklemek için <code style="background: rgba(155, 89, 182, 0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">confession-video.mp4</code> dosyasını proje klasörüne koy
            </p>
          </div>
        `;
      }
    });
  }
});

