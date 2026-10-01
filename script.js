const body = document.body;
const themeToggle = document.querySelector('#themeToggle');
const preferredTheme = localStorage.getItem('theme');
if (preferredTheme === 'dark') body.classList.add('dark');

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  localStorage.setItem('theme', body.classList.contains('dark') ? 'dark' : 'light');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const progressBar = document.querySelector('#progressBar');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${total ? (window.scrollY / total) * 100 : 0}%`;
}, { passive: true });

let passed = new Set();
function updateScore() {
  document.querySelector('#score span').textContent = passed.size;
}

document.querySelectorAll('.challenge[data-challenge]:not([data-challenge="spot"])').forEach((challenge) => {
  challenge.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      const correct = button.dataset.answer === 'correct';
      challenge.querySelectorAll('[data-answer]').forEach((item) => item.classList.remove('correct', 'wrong'));
      button.classList.add(correct ? 'correct' : 'wrong');
      const feedback = challenge.querySelector('.feedback');
      if (correct) {
        passed.add(challenge.dataset.challenge);
        feedback.textContent = challenge.dataset.challenge === 'priority'
          ? 'Correct — financial integrity and customer trust make this critical.'
          : 'Correct — values just outside both limits reveal boundary failures.';
      } else {
        feedback.textContent = 'Reasonable observation, but look for the highest user or business risk.';
      }
      updateScore();
    });
  });
});

const spotChallenge = document.querySelector('[data-challenge="spot"]');
spotChallenge.querySelector('.reveal-answer').addEventListener('click', (event) => {
  passed.add('spot');
  spotChallenge.querySelector('.feedback').textContent = 'Found it — the primary action says “Delete account” on a login form: a severe labeling and safety defect.';
  event.currentTarget.textContent = 'Defect revealed';
  event.currentTarget.disabled = true;
  updateScore();
});

document.querySelector('#year').textContent = new Date().getFullYear();
