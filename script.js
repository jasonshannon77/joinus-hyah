// Read contact ID from URL
const urlParams = new URLSearchParams(window.location.search);
const contactId = urlParams.get('cid') || '';

// Screening form handler
const form = document.getElementById('screeningForm');
const successEl = document.getElementById('formSuccess');
const submitBtn = form.querySelector('button[type="submit"]');

const WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/12Qtr4CCIXbCJ0y6XJpY/webhook-trigger/a1b4d064-cd3b-44fa-a1c1-0b23a3dc6c20';

const questions = {
  q1_vehicle: 'Do you have a reliable vehicle registered & insured in Queensland?',
  q2_licence: "Do you have a driver's licence to drive a vehicle in Queensland with no restrictions?",
  q3_police: 'Do you have or are you willing to obtain a police check?',
  q4_ndis: 'Do you have or are you willing to obtain an NDIS Worker Screening Check?',
  q5_wwcc: 'Do you have or are you willing to obtain a Working with Children Check?',
  q6_days: 'What days of the week are you available?',
  q7_hours: 'How many hours each week do you want to work?',
  q8_other: "Anything else you'd like to tell us?",
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Disable button while submitting
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const data = new FormData(form);
  const answers = {};

  for (const [key, value] of data.entries()) {
    if (key === 'q6_days') {
      if (!answers[key]) answers[key] = [];
      answers[key].push(value);
    } else {
      answers[key] = value;
    }
  }

  // Build formatted note
  const noteLines = ['Screening Form Answers', '───'];
  let i = 1;
  for (const [key, question] of Object.entries(questions)) {
    const answer = key === 'q6_days'
      ? (answers[key] || []).join(', ') || 'None selected'
      : answers[key] || 'Not answered';
    noteLines.push(`${i}. ${question}\n   ${answer}`);
    i++;
  }
  const note = noteLines.join('\n');

  const payload = {
    contact_id: contactId,
    note: note,
    // Individual fields for GHL mapping
    vehicle: answers.q1_vehicle || '',
    licence: answers.q2_licence || '',
    police_check: answers.q3_police || '',
    ndis_screening: answers.q4_ndis || '',
    wwcc: answers.q5_wwcc || '',
    available_days: (answers.q6_days || []).join(', '),
    hours_per_week: answers.q7_hours || '',
    other_info: answers.q8_other || '',
  };

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    form.hidden = true;
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (err) {
    console.error('Webhook error:', err);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit My Answers';
    alert('Something went wrong — please try again.');
  }
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
