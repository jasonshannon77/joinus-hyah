// Screening form handler
const form = document.getElementById('screeningForm');
const successEl = document.getElementById('formSuccess');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const result = {};

  // Single-value fields
  for (const [key, value] of data.entries()) {
    if (key === 'q6_days') {
      if (!result[key]) result[key] = [];
      result[key].push(value);
    } else {
      result[key] = value;
    }
  }

  console.log('Screening form submission:', JSON.stringify(result, null, 2));

  // Show success state
  form.hidden = true;
  successEl.hidden = false;
  successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Scroll-reveal animation
const revealElements = document.querySelectorAll(
  '.value-card, .testimonial-card, .form-group'
);

revealElements.forEach((el) => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el) => observer.observe(el));
