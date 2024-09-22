const progressBar = document.querySelector('.progress-bar'),
  progressText = document.querySelector('.progress-text');

let questions = [],
  time = 30,
  score = 0,
  currentQuestion = 0,
  timer;

const startBtn = document.querySelector('.start'),
  numQuestions = document.querySelector('#num-questions'),
  category = document.querySelector('#category'),
  difficulty = document.querySelector('#difficulty'),
  timeSelect = document.querySelector('#time'),
  quiz = document.querySelector('.quiz'),
  startscreen = document.querySelector('.start-screen'),
  endscreen = document.querySelector('.end-screen'),
  submitBtn = document.querySelector('.submit'),
  restartBtn = document.querySelector('.restart');

const startQuiz = () => {
  const num = numQuestions.value,
    cat = category.value,
    diff = difficulty.value,
    selectedTime = parseInt(timeSelect.value) || 30;
  time = selectedTime;

  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      questions = data.results;
      startscreen.classList.add('hide');
      quiz.classList.remove('hide');
      currentQuestion = 0;
      score = 0;
      showQuestion(questions[currentQuestion]);
    });
};

const showQuestion = (question) => {
  const questionText = document.querySelector('.question'),
    answerWrapper = document.querySelector('.answer-wrapper'),
    questionNumber = document.querySelector('.current');

  questionText.innerHTML = question.question;
  questionNumber.innerHTML = currentQuestion + 1;
  answerWrapper.innerHTML = '';

  const allAnswers = [...question.incorrect_answers, question.correct_answer];
  allAnswers.sort(() => Math.random() - 0.5);

  allAnswers.forEach((answer) => {
    const answerDiv = document.createElement('div');
    answerDiv.classList.add('answer');
    answerDiv.innerHTML = `<span class="text">${answer}</span><span class="checkbox"><span class="icon"><i class="fa-solid fa-check"></i></span></span>`;
    answerDiv.onclick = () =>
      selectAnswer(answerDiv, answer, question.correct_answer);
    answerWrapper.appendChild(answerDiv);
  });

  startTimer(time);
};

const startTimer = (time) => {
  clearInterval(timer);
  let currentTime = time;
  progress(currentTime);
  timer = setInterval(() => {
    currentTime--;
    progress(currentTime);
    if (currentTime <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
};

const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

const selectAnswer = (answerDiv, selectedAnswer, correctAnswer) => {
  const answerButtons = document.querySelectorAll('.answer');

  answerButtons.forEach((btn) => {
    btn.classList.remove('selected', 'correct', 'wrong');
  });

  answerDiv.classList.add('selected');

  if (selectedAnswer === correctAnswer) {
    answerDiv.classList.add('correct');
    score++;
  } else {
    answerDiv.classList.add('wrong');

    answerButtons.forEach((btn) => {
      if (btn.innerText === correctAnswer) {
        btn.classList.add('correct');
      }
    });
  }

  setTimeout(nextQuestion, 1000);
};

const nextQuestion = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion(questions[currentQuestion]);
  } else {
    endQuiz();
  }
};

const endQuiz = () => {
  clearInterval(timer);
  quiz.classList.add('hide');
  endscreen.classList.remove('hide');
  document.querySelector('.final-score').innerHTML = score;
  document.querySelector('.total-score').innerHTML = `/${questions.length}`;
};

const restartQuiz = () => {
  score = 0;
  currentQuestion = 0;
  startscreen.classList.remove('hide');
  endscreen.classList.add('hide');
  progressBar.style.width = '100%';
  progressText.innerHTML = '0';
};

startBtn.addEventListener('click', startQuiz);
restartBtn.addEventListener('click', restartQuiz);
