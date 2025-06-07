document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('quizForm');
  const submitBtn = document.getElementById('submitBtn');
  const resultDiv = document.getElementById('result');
  const timerDiv = document.getElementById('timer');

  if (!form || !submitBtn || !resultDiv || typeof answerKey === 'undefined') {
    console.error('Quiz elements or answerKey missing.');
    return;
  }

  // Timer setup
  let timeLeft = 10 * 60; // 10 minutes in seconds
  const timerInterval = setInterval(() => {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerDiv.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerDiv.textContent = "Time's up!";
      if (!submitBtn.disabled) {
        submitQuiz(); // Auto-submit
      }
    }

    timeLeft--;
  }, 1000);

  // Manual submit
  submitBtn.addEventListener('click', submitQuiz);

  // Grading logic
  function submitQuiz() {
    let score = 0;
    const total = Object.keys(answerKey).length;

    submitBtn.disabled = true;

    // Clear previous highlights
    form.querySelectorAll('label').forEach(label => {
      label.style.backgroundColor = '';
    });

    for (let q in answerKey) {
      const selected = form.querySelector(`input[name="${q}"]:checked`);
      const correct = answerKey[q];

      const allOptions = form.querySelectorAll(`input[name="${q}"]`);
      allOptions.forEach(option => {
        const label = option.parentElement;
        if (option.value === correct) {
          label.style.backgroundColor = '#c8f7c5'; // Green
        } else if (option.checked && option.value !== correct) {
          label.style.backgroundColor = '#f7c5c5'; // Red
        }
      });

      if (selected && selected.value === correct) {
        score++;
      }
    }

    resultDiv.innerHTML = `<strong>You scored ${score} out of ${total}.</strong>`;
  }
});
