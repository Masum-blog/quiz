document.addEventListener('DOMContentLoaded', () => {
    const quizForm = document.getElementById('macbethQuiz');
    const timerDisplay = document.getElementById('time');
    const resultsDiv = document.getElementById('results');
    const submitButton = document.getElementById('submitQuiz');

    const quizDuration = 300; // 5 minutes in seconds
    let timeLeft = quizDuration;
    let timerInterval;

    const correctAnswers = {
        q1: 'b', // Duncan
        q2: 'a', // He will be Thane of Cawdor and King hereafter.
        q3: 'a', // Fleance
        q4: 'c', // Macduff
        q5: 'a', // To England and Ireland, respectively.
        q6: 'a', // A floating dagger.
        q7: 'c', // Macduff
        q8: 'b', // She commits suicide.
        q9: 'a', // Birnam Wood
        q10: 'c' // Malcolm
    };

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    function startTimer() {
        timerDisplay.textContent = formatTime(timeLeft);
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = formatTime(timeLeft);

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                handleSubmit(null, true); // Submit quiz automatically when time runs out
            }
        }, 1000);
    }

    function highlightAnswers(userAnswers) {
        Object.keys(correctAnswers).forEach(questionName => {
            const questionBlock = document.querySelector(`.question-block:has(input[name="${questionName}"])`);
            if (!questionBlock) return; // Should not happen

            const correctValue = correctAnswers[questionName];
            const userAnswer = userAnswers[questionName];

            // Get all radio buttons for this question
            const radios = questionBlock.querySelectorAll(`input[name="${questionName}"]`);

            radios.forEach(radio => {
                const label = radio.closest('label'); // Get the parent label of the radio button

                if (radio.value === correctValue) {
                    label.classList.add('correct'); // Highlight correct answer
                } else if (radio.value === userAnswer && userAnswer !== correctValue) {
                    label.classList.add('incorrect'); // Highlight incorrect user answer
                }
            });

            // Disable all inputs after submission
            radios.forEach(radio => radio.disabled = true);
        });
    }

    function handleSubmit(event, timedOut = false) {
        if (event) {
            event.preventDefault(); // Prevent default form submission if triggered by button
        }

        clearInterval(timerInterval); // Stop the timer

        const formData = new FormData(quizForm);
        const userAnswers = {};
        let score = 0;

        for (const [name, value] of formData.entries()) {
            userAnswers[name] = value;
        }

        Object.keys(correctAnswers).forEach(questionName => {
            if (userAnswers[questionName] === correctAnswers[questionName]) {
                score++;
            }
        });

        resultsDiv.innerHTML = `You scored ${score} out of ${Object.keys(correctAnswers).length} questions.`;
        if (timedOut) {
            resultsDiv.innerHTML += "<br>Time's up! Your quiz has been automatically submitted.";
        }

        highlightAnswers(userAnswers);
        submitButton.disabled = true; // Disable submit button after submission
    }

    quizForm.addEventListener('submit', handleSubmit);

    // Start the timer when the page loads
    startTimer();
});