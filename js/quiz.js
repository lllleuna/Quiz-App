const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get("category");

let currentQuestionIndex = 0;
let userAnswers = [];
let questions = [];

const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("options");
const statusBar = document.getElementById("statusBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

fetch("../data/questions.json")
  .then((res) => res.json())
  .then((data) => {
    const builtIn = data[category] || [];
    const custom = JSON.parse(localStorage.getItem("customQuizzes") || "{}")[category] || [];

    // Combine default + custom questions
    questions = [...builtIn, ...custom];

    if (questions.length === 0) {
      alert("No questions found for this category.");
      return;
    }

    userAnswers = Array(questions.length).fill(null);
    renderQuestion();
  });


function renderStatusBar() {
  statusBar.innerHTML = questions
    .map((_, i) => {
      const status = userAnswers[i] !== null ? "✓" : i === currentQuestionIndex ? "🔘" : "○";
      return `<span style="margin: 0 5px;">${status}</span>`;
    })
    .join("");
}

function renderQuestion() {
  const q = questions[currentQuestionIndex];
  questionText.textContent = q.question;
  optionsContainer.innerHTML = "";

  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "option-btn";
    btn.onclick = () => {
      userAnswers[currentQuestionIndex] = opt;
      renderQuestion(); // re-render to highlight selected
      renderStatusBar();
    };
    if (userAnswers[currentQuestionIndex] === opt) {
      btn.style.backgroundColor = "#007bff";
      btn.style.color = "#fff";
    }
    optionsContainer.appendChild(btn);
  });

  prevBtn.disabled = currentQuestionIndex === 0;
  nextBtn.textContent =
    currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";

  renderStatusBar();
}

nextBtn.addEventListener("click", () => {
  if (nextBtn.textContent === "Submit") {
    let score = 0;
    questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) score++;
    });

    localStorage.setItem(
      "quizResult",
      JSON.stringify({ questions, userAnswers, score })
    );

    window.location.href = `result.html?category=${category}`;
  } else if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
});
