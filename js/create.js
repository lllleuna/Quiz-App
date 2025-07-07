const categorySelect = document.getElementById("categorySelect");
const questionInput = document.getElementById("questionInput");
const optionsContainer = document.getElementById("optionsContainer");
const addOptionBtn = document.getElementById("addOptionBtn");
const addQuestionBtn = document.getElementById("addQuestionBtn");
const questionList = document.getElementById("questionList");
const submitBtn = document.getElementById("submitBtn");

const urlParams = new URLSearchParams(window.location.search);
const categoryFromURL = urlParams.get("category");

if (categoryFromURL) {
  categorySelect.value = categoryFromURL;
}

let createdQuestions = [];
let editingIndex = null;

// Initial 2 option inputs with design enhancements
function renderOptionInputs() {
  optionsContainer.innerHTML = "";
  for (let i = 0; i < 2; i++) {
    addOptionInput();
  }
}

function addOptionInput(value = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "option-group";

  const radio = document.createElement("input");
  radio.type = "radio";
  radio.name = "correctOption";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "optionInput";
  input.placeholder = `Option`;
  input.value = value;

  // Add remove button only if more than 2 options
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "remove-option";
  removeBtn.innerHTML = "×";
  removeBtn.onclick = () => removeOption(removeBtn);

  wrapper.appendChild(radio);
  wrapper.appendChild(input);
  wrapper.appendChild(removeBtn);
  optionsContainer.appendChild(wrapper);

  // Add slide-in animation
  wrapper.style.opacity = "0";
  wrapper.style.transform = "translateX(-20px)";

  requestAnimationFrame(() => {
    wrapper.style.transition = "all 0.3s ease";
    wrapper.style.opacity = "1";
    wrapper.style.transform = "translateX(0)";
  });
}

function removeOption(button) {
  const wrapper = button.parentElement;
  const optionsContainer = document.getElementById("optionsContainer");

  // Don't allow removing if only 2 options remain
  if (optionsContainer.children.length <= 2) {
    alert("A question must have at least 2 options!");
    return;
  }

  wrapper.style.transition = "all 0.3s ease";
  wrapper.style.opacity = "0";
  wrapper.style.transform = "translateX(-20px)";

  setTimeout(() => {
    wrapper.remove();
  }, 300);
}

addOptionBtn.addEventListener("click", () => {
  addOptionInput();
});

addQuestionBtn.addEventListener("click", () => {
  const question = questionInput.value.trim();
  const optionRows = Array.from(document.querySelectorAll(".option-group"));

  const options = [];
  let correctAnswer = null;

  optionRows.forEach((row, index) => {
    const text = row.querySelector(".optionInput").value.trim();
    const isCorrect = row.querySelector("input[type='radio']").checked;
    if (text !== "") {
      options.push(text);
      if (isCorrect) correctAnswer = text;
    }
  });

  if (!question || options.length < 2 || !correctAnswer) {
    alert(
      "Please enter a question, at least 2 options, and select a correct answer."
    );
    return;
  }

  const newQuestion = { question, options, answer: correctAnswer };

  if (editingIndex !== null) {
    createdQuestions[editingIndex] = newQuestion;
    editingIndex = null;
  } else {
    createdQuestions.push(newQuestion);
  }

  questionInput.value = "";
  renderOptionInputs();
  renderQuestionList();

  showSuccessAnimation();
});

function renderQuestionList() {
  questionList.innerHTML = "";

  if (createdQuestions.length === 0) {
    questionList.innerHTML = `
          <div class="empty-state">
            No questions added yet. Create your first question above!
          </div>
        `;
    return;
  }

  createdQuestions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question-item";
    div.style.animation = "slideIn 0.5s ease-out";

    const optionsHTML = q.options
      .map((option) => {
        const isCorrect = option === q.answer;
        return `
            <div class="option-display ${isCorrect ? "correct" : ""}">
              ${isCorrect ? "✓" : "○"} ${option}
            </div>
          `;
      })
      .join("");

    div.innerHTML = `
          <button class="delete-question" onclick="deleteQuestion(${index})">Delete</button>
          <div class="question-text">${q.question}</div>
          <div class="question-options">
            ${optionsHTML}
          </div>
          <button class="edit-question" onclick="editQuestion(${index})">Edit</button>
        `;
    questionList.appendChild(div);
  });
}

window.editQuestion = function (index) {
  const q = createdQuestions[index];
  questionInput.value = q.question;
  optionsContainer.innerHTML = "";
  q.options.forEach((opt) => {
    const wrapper = document.createElement("div");
    wrapper.className = "option-group";

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "correctOption";
    if (opt === q.answer) radio.checked = true;

    const input = document.createElement("input");
    input.type = "text";
    input.className = "optionInput";
    input.value = opt;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-option";
    removeBtn.innerHTML = "×";
    removeBtn.onclick = () => removeOption(removeBtn);

    wrapper.appendChild(radio);
    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    optionsContainer.appendChild(wrapper);
  });
  editingIndex = index;

  // Scroll to top and highlight form
  document
    .querySelector(".create-section")
    .scrollIntoView({ behavior: "smooth" });
};

window.deleteQuestion = function (index) {
  if (confirm("Are you sure you want to delete this question?")) {
    createdQuestions.splice(index, 1);
    renderQuestionList();
  }
};

submitBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  if (createdQuestions.length === 0) {
    alert("No questions to save.");
    return;
  }

  const saved = JSON.parse(localStorage.getItem("customQuizzes") || "{}");
  if (!saved[category]) saved[category] = [];
  saved[category].push(...createdQuestions);

  localStorage.setItem("customQuizzes", JSON.stringify(saved));

  alert("Questions saved successfully!");
  createdQuestions = [];
  renderQuestionList();

  showSubmitAnimation();
});

function showSuccessAnimation() {
  const addButton = document.getElementById("addQuestionBtn");
  const originalText = addButton.textContent;

  addButton.textContent = "✓ Question Added!";
  addButton.style.background = "linear-gradient(135deg, #43e97b, #38f9d7)";

  setTimeout(() => {
    addButton.textContent = originalText;
    addButton.style.background = "linear-gradient(135deg, #4facfe, #00f2fe)";
  }, 2000);
}

function showSubmitAnimation() {
  const submitButton = document.getElementById("submitBtn");
  const originalText = submitButton.textContent;

  submitButton.textContent = "✓ Successfully Submitted!";
  submitButton.style.background = "linear-gradient(135deg, #43e97b, #38f9d7)";

  setTimeout(() => {
    submitButton.textContent = originalText;
    submitButton.style.background = "linear-gradient(135deg, #43e97b, #38f9d7)";
  }, 3000);
}

renderOptionInputs();
renderQuestionList();

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Enter") {
    addQuestionBtn.click();
  }
});
