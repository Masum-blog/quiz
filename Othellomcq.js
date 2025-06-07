<script>
       const quizForm = document.getElementById('quiz-form');
    const submitButton = document.getElementById('submit-btn');
    const resultsContainer = document.getElementById('results');
    const timerDisplay = document.getElementById('timer');

    let timeLeft = 10 * 60; // 10 minutes in seconds
    let timerInterval;
    let quizSubmitted = false;

    function buildQuiz() {
        quizData.forEach((currentQuestion, questionNumber) => {
            const questionBlock = document.createElement('div');
            questionBlock.classList.add('question-block');
            questionBlock.setAttribute('id', `question-${questionNumber}`);

            const questionText = document.createElement('p');
            questionText.textContent = currentQuestion.question;
            questionBlock.appendChild(questionText);

            const optionsDiv = document.createElement('div');
            optionsDiv.classList.add('options');

            currentQuestion.options.forEach((option, index) => {
                const label = document.createElement('label');
                label.setAttribute('for', `q${questionNumber}_option${index}`);

                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = `question${questionNumber}`;
                radio.value = option;
                radio.id = `q${questionNumber}_option${index}`;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(option));
                optionsDiv.appendChild(label);
            });
            questionBlock.appendChild(optionsDiv);
            quizForm.appendChild(questionBlock);
        });
    }

    function showResults() {
        quizSubmitted = true;
        clearInterval(timerInterval); // Stop the timer
        timerDisplay.textContent = "Time's Up or Quiz Submitted!";

        let score = 0;
        quizData.forEach((currentQuestion, questionNumber) => {
            const questionBlock = document.getElementById(`question-${questionNumber}`);
            const selector = `input[name="question${questionNumber}"]:checked`;
            const userAnswerNode = (quizForm.querySelector(selector));
            const userAnswer = userAnswerNode ? userAnswerNode.value : null;

            const optionLabels = questionBlock.querySelectorAll('.options label');

            optionLabels.forEach(label => {
                const radio = label.querySelector('input[type="radio"]');
                if (radio.value === currentQuestion.answer) {
                    label.classList.add('correct-answer');
                }
                if (radio.checked) {
                    label.classList.add('user-selected');
                    if (radio.value !== currentQuestion.answer) {
                        label.classList.add('incorrect-answer');
                    }
                }
                radio.disabled = true; // Disable radio buttons after submission
            });

            if (userAnswer === currentQuestion.answer) {
                score++;
            }
        });

        resultsContainer.innerHTML = `<h2>You scored ${score} out of ${quizData.length}</h2>`;
        if (score === quizData.length) {
            resultsContainer.innerHTML += "<p>Excellent! You got all answers correct.</p>";
        } else if (score >= quizData.length * 0.7) {
            resultsContainer.innerHTML += "<p>Good job! You have a good understanding.</p>";
        } else {
            resultsContainer.innerHTML += "<p>Keep practicing to improve your score.</p>";
        }
        submitButton.disabled = true;
        submitButton.style.backgroundColor = "#6c757d"; // Grey out button
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (quizSubmitted) {
                clearInterval(timerInterval);
                return;
            }
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            seconds = seconds < 10 ? '0' + seconds : seconds;
            timerDisplay.textContent = `${minutes}:${seconds}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "Time's Up!";
                if (!quizSubmitted) {
                  alert("Time's up! The quiz will be submitted automatically.");
                  showResults();
                }
            }
        }, 1000);
    }

    buildQuiz();
    startTimer();

    submitButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default form submission
        if (quizSubmitted) return;

        // Optional: Confirm submission if timer hasn't run out
        // if (timeLeft > 0 && !confirm("Are you sure you want to submit?")) {
        // return;
        // }
        showResults();
    });

</script>
