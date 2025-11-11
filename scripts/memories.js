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
});

