const answers = {
  q1: 'a',
  q2: 'b',
  q3: 'b',
  q4: 'a',
  q5: 'b',
  q6: 'a',
  q7: 'b',
  q8: 'd',
  q9: 'b',
  q10: 'b'
};

const form = document.getElementById('quizForm');
const submitBtn = document.getElementById('submitBtn');
const resultDiv = document.getElementById('result');
let timerDisplay = document.getElementById('timer');
let timeLeft = 600; // 10 minutes in seconds
let timerId;

function startTimer() {
  timerId = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerDisplay.textContent = 'Time is up!';
      submitQuiz();
      submitBtn.disabled = true;
      return;
    }
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDisplay.textContent = `Time Remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    timeLeft--;
  }, 1000);
}

function submitQuiz() {
  clearInterval(timerId);
  let score = 0;
  for (let i = 1; i <= 10; i++) {
    let qName = 'q' + i;
    let options = document.getElementsByName(qName);
    let userAnswer = null;
    options.forEach(option => {
      option.disabled = true; // disable after submission
      if (option.checked) userAnswer = option.value;
    });

    // Highlight answers
    options.forEach(option => {
      let label = option.parentElement;
      label.classList.remove('correct', 'incorrect');
      if (option.value === answers[qName]) {
        // Correct answer green
        label.classList.add('correct');
      }
    });

    if (userAnswer === answers[qName]) {
      score++;
    } else {
      // Mark user’s wrong answer red
      options.forEach(option => {
        let label = option.parentElement;
        if (option.checked && option.value !== answers[qName]) {
          label.classList.add('incorrect');
        }
      });
    }
  }
  resultDiv.textContent = `You scored ${score} out of 10.`;
  submitBtn.disabled = true;
}

submitBtn.addEventListener('click', () => {
  // Check if all questions are answered
  for (let i = 1; i <= 10; i++) {
    let qName = 'q' + i;
    let options = document.getElementsByName(qName);
    if (![...options].some(opt => opt.checked)) {
      alert(`Please answer question ${i}`);
      return;
    }
  }
  submitQuiz();
});

startTimer();
