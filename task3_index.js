const QUESTIONS = [
  {
    type: 'single',
    text: 'Which planet is known as the Red Planet?',
    options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
    answer: 'Mars'
  },
  {
    type: 'multi',
    text: 'Which of these are traditionally considered primary colors?',
    options: ['Red', 'Green', 'Blue', 'Yellow', 'Purple'],
    answer: ['Red', 'Blue', 'Green']
  },
  {
    type: 'fill',
    text: 'The largest ocean on Earth is the _____ Ocean.',
    accepted: ['pacific']
  },
  {
    type: 'single',
    text: "Who wrote the play 'Romeo and Juliet'?",
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    answer: 'William Shakespeare'
  },
  {
    type: 'multi',
    text: 'Which of the following are noble gases?',
    options: ['Helium', 'Oxygen', 'Neon', 'Nitrogen', 'Argon'],
    answer: ['Helium', 'Neon', 'Argon']
  },
  {
    type: 'fill',
    text: 'HTML stand for _____.',
    accepted: ['hypertext markup language']
  },
  {
    type: 'single',
    text: 'What is the capital of Japan?',
    options: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'],
    answer: 'Tokyo'
  },
  {
    type: 'multi',
    text: 'Which of these countries are located in South America?',
    options: ['Brazil', 'Mexico', 'Argentina', 'Canada', 'Chile'],
    answer: ['Brazil', 'Argentina', 'Chile']
  },
  {
    type: 'fill',
    text: 'Light travels at approximately 300,000 _________ per second.',
    accepted: ['kilometers', 'kilometres', 'km']
  },
  {
    type: 'single',
    text: 'How many continents are there on Earth?',
    options: ['5', '6', '7', '8'],
    answer: '7'
  }
];

let current = 0;
let score = 0;
let selected = null;    // for single: string, for multi: Set
let locked = false;
let userAnswers = [];   // record of what user picked, for review screen

const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultsScreen = document.getElementById('resultsScreen');
const trackerEl = document.getElementById('tracker');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const lockBtn = document.getElementById('lockBtn');
const fillInput = document.getElementById('fillInput');

function buildTracker() {
  trackerEl.innerHTML = '';
  QUESTIONS.forEach((_, i) => {
    const seg = document.createElement('div');
    seg.className = 'seg';
    seg.id = 'seg-' + i;
    const fill = document.createElement('div');
    fill.className = 'fill';
    seg.appendChild(fill);
    trackerEl.appendChild(seg);
  });
}

function updateTracker() {
  QUESTIONS.forEach((_, i) => {
    const seg = document.getElementById('seg-' + i);
    seg.classList.remove('current', 'done');
    if (i < current) seg.classList.add('done');
    else if (i === current) seg.classList.add('current');
  });
}

function startQuiz() {
  current = 0;
  score = 0;
  userAnswers = [];
  startScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  trackerEl.classList.remove('hidden');
  renderQuestion();
}

function typeTagInfo(type) {
  if (type === 'single') return { label: 'Pick One', cls: 'q-type-tag' };
  if (type === 'multi') return { label: 'Pick All That Apply', cls: 'q-type-tag' };
  return { label: 'Fill In The Blank', cls: 'q-type-tag' };
}

function renderQuestion() {
  locked = false;
  selected = null;
  updateTracker();

  const q = QUESTIONS[current];
  document.getElementById('qCount').textContent = `Question ${current + 1} of ${QUESTIONS.length}`;

  const tagInfo = typeTagInfo(q.type);
  const tagEl = document.getElementById('qTypeTag');
  tagEl.textContent = tagInfo.label;

  document.getElementById('qText').textContent = q.text;

  const optWrap = document.getElementById('optionsWrap');
  optWrap.innerHTML = '';
  const fb = document.getElementById('feedback');
  fb.className = 'feedback';
  fb.textContent = '';

  if (q.type === 'fill') {
    optWrap.classList.add('hidden');
    fillInput.classList.remove('hidden');
    fillInput.value = '';
    fillInput.disabled = false;
    fillInput.className = 'fill-input';
    fillInput.oninput = () => {
      lockBtn.disabled = fillInput.value.trim().length === 0;
    };
  } else {
    optWrap.classList.remove('hidden');
    fillInput.classList.add('hidden');
    selected = q.type === 'multi' ? new Set() : null;
    q.options.forEach(opt => {
      const row = document.createElement('div');
      row.className = 'option ' + (q.type === 'multi' ? 'multi-type' : 'single-type');
      row.innerHTML = `<div class="marker">&#10003;</div><div>${opt}</div>`;
      row.addEventListener('click', () => toggleOption(row, opt, q.type));
      optWrap.appendChild(row);
    });
  }

  lockBtn.textContent = 'Lock In Answer';
  lockBtn.disabled = true;
  lockBtn.onclick = lockAnswer;
}

function toggleOption(row, opt, type) {
  if (locked) return;
  if (type === 'single') {
    document.querySelectorAll('#optionsWrap .option').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    selected = opt;
  } else {
    if (selected.has(opt)) {
      selected.delete(opt);
      row.classList.remove('selected');
    } else {
      selected.add(opt);
      row.classList.add('selected');
    }
  }
  lockBtn.disabled = type === 'single' ? selected === null : selected.size === 0;
}

function normalize(str) {
  return str.trim().toLowerCase();
}

function lockAnswer() {
  if (locked) return;
  locked = true;
  const q = QUESTIONS[current];
  let isCorrect = false;
  let userAnswerDisplay = '';
  let correctAnswerDisplay = '';

  if (q.type === 'single') {
    isCorrect = selected === q.answer;
    userAnswerDisplay = selected || '(no answer)';
    correctAnswerDisplay = q.answer;
    document.querySelectorAll('#optionsWrap .option').forEach(row => {
      const label = row.textContent.trim();
      if (label === q.answer) row.classList.add('correct-answer');
      else if (label === selected) row.classList.add('wrong-answer');
      row.classList.add('locked');
    });
  } else if (q.type === 'multi') {
    const chosen = Array.from(selected).sort();
    const correct = [...q.answer].sort();
    isCorrect = JSON.stringify(chosen) === JSON.stringify(correct);
    userAnswerDisplay = chosen.length ? chosen.join(', ') : '(no answer)';
    correctAnswerDisplay = correct.join(', ');
    document.querySelectorAll('#optionsWrap .option').forEach(row => {
      const label = row.textContent.trim();
      const isChosen = chosen.includes(label);
      const isRight = correct.includes(label);
      if (isRight) row.classList.add('correct-answer');
      else if (isChosen && !isRight) row.classList.add('wrong-answer');
      row.classList.add('locked');
    });
  } else {
    const val = normalize(fillInput.value);
    isCorrect = q.accepted.includes(val);
    userAnswerDisplay = fillInput.value.trim() || '(no answer)';
    correctAnswerDisplay = q.accepted[0];
    fillInput.disabled = true;
    fillInput.classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
  }

  if (isCorrect) score++;
  userAnswers.push({
    question: q.text,
    userAnswer: userAnswerDisplay,
    correctAnswer: correctAnswerDisplay,
    isCorrect
  });

  const fb = document.getElementById('feedback');
  fb.classList.add('show', isCorrect ? 'good' : 'bad');
  fb.textContent = isCorrect
    ? 'Correct! Nicely done.'
    : `Not quite. The correct answer was: ${correctAnswerDisplay}.`;

  lockBtn.disabled = false;
  lockBtn.textContent = current === QUESTIONS.length - 1 ? 'See Results' : 'Next Question';
  lockBtn.onclick = advance;
}

function advance() {
  current++;
  if (current >= QUESTIONS.length) {
    showResults();
  } else {
    renderQuestion();
  }
}

function showResults() {
  updateTracker();
  quizScreen.classList.add('hidden');
  trackerEl.classList.add('hidden');
  resultsScreen.classList.remove('hidden');

  const totalEl = document.getElementById('finalTotal');
  const scoreEl = document.getElementById('finalScore');
  totalEl.textContent = QUESTIONS.length;
  scoreEl.textContent = '0';

  let displayed = 0;
  const target = score;
  const tick = setInterval(() => {
    displayed++;
    scoreEl.textContent = displayed;
    if (displayed >= target) clearInterval(tick);
  }, 120);
  if (target === 0) scoreEl.textContent = '0';

  const pct = Math.round((score / QUESTIONS.length) * 100);
  const msgEl = document.getElementById('scoreMsg');
  if (pct === 100) msgEl.textContent = 'Perfect round — you got every question right.';
  else if (pct >= 70) msgEl.textContent = 'Strong showing. You know your stuff.';
  else if (pct >= 40) msgEl.textContent = 'Solid effort — a few slipped past you.';
  else msgEl.textContent = 'Tough round. Give it another go.';

  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  userAnswers.forEach((a, i) => {
    const item = document.createElement('div');
    item.className = 'review-item';
    item.innerHTML = `
      <div class="ri-head">
        <div class="ri-icon ${a.isCorrect ? 'ok' : 'no'}">${a.isCorrect ? '&#10003;' : '&#10007;'}</div>
        <div>Q${i + 1}. ${a.question}</div>
      </div>
      <div class="ri-detail">
        <div>Your answer: <b>${a.userAnswer}</b></div>
        ${a.isCorrect ? '' : `<div>Correct answer: <b>${a.correctAnswer}</b></div>`}
      </div>
    `;
    reviewList.appendChild(item);
  });
}

function restartQuiz() {
  resultsScreen.classList.add('hidden');
  startScreen.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  buildTracker();
  startBtn.addEventListener('click', startQuiz);
  restartBtn.addEventListener('click', restartQuiz);
  fillInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !lockBtn.disabled) {
      lockBtn.click();
    }
  });
});