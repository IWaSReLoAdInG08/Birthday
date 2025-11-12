const form = document.getElementById('quiz-form');
const resultsSection = document.getElementById('results');
const scoreEl = resultsSection?.querySelector('.score');
const messageEl = resultsSection?.querySelector('.message');

// This is a vibes-based quiz; no right/wrong answers.
// We create a playful "closeness" score based on option variety and sincerity picks.
function computeClosenessScore(formEl) {
  const fields = Array.from(formEl.querySelectorAll('fieldset'));
  let score = 0;
  let sincerity = 0;
  fields.forEach((fs, idx) => {
    const name = fs.querySelector('input[type="radio"]')?.name;
    const value = name ? formEl.elements[name]?.value : null;
    if (!value) return;
    score += 1; // answered
    // lightly weight some heartfelt choices
    if (
      (name === 'q1' && (value === 'a' || value === 'd')) ||
      (name === 'q4' && (value === 'b' || value === 'd')) ||
      (name === 'q5' && (value === 'a' || value === 'd')) ||
      (name === 'q6' && value === 'd') ||
      (name === 'q10' && (value === 'a' || value === 'd'))
    ) {
      sincerity += 1;
    }
  });
  return { answered: score, sincerity };
}

function buildMessage({ answered, sincerity }, total) {
  if (answered < total) {
    return 'Özel sonucunu görmek için tüm soruları cevapla!';
  }
  if (sincerity >= Math.ceil(total * 0.4)) {
    return 'Mükemmel uyum — beni anlıyorsun, canım. Bu arkadaşlık premium seviye ✨';
  }
  if (sincerity >= Math.ceil(total * 0.25)) {
    return 'Çok yakın! Sıcak, tatlı ve neredeyse tamamen senkron — seviliyorsun 💛';
  }
  return 'Tatlı seçimler! Daha fazla anı yapalım ve bunu yükseltelim — hadi bakalım 🎈';
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const totalQuestions = form.querySelectorAll('fieldset').length;
  const result = computeClosenessScore(form);

  if (scoreEl) {
    scoreEl.textContent = `Tamamlandı ${result.answered} / ${totalQuestions}`;
  }
  if (messageEl) {
    messageEl.textContent = buildMessage(result, totalQuestions);
  }
  if (resultsSection) {
    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});

