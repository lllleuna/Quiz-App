// Category selection functionality
let selectedCategory = null;
const categoryItems = document.querySelectorAll(".category-item");
const nextButton = document.getElementById("nextBtn");

instruction.textContent = "Select a Category";

categoryItems.forEach((item) => {
  item.addEventListener("click", () => {
    // Remove selected class from all items
    categoryItems.forEach((cat) => cat.classList.remove("selected"));

    // Add selected class to clicked item
    item.classList.add("selected");

    // Store selected category
    selectedCategory = item.dataset.category;

    nextButton.disabled = false;
    instruction.textContent = `${item.textContent} Selected`;
  });
});

const urlParams = new URLSearchParams(window.location.search);
const mode = urlParams.get("mode");

nextButton.addEventListener("click", () => {
  if (selectedCategory) {
    console.log("Selected category:", selectedCategory);
    alert(`Proceeding with ${selectedCategory} category`);
    
    if (mode === "start") {
      window.location.href = `quiz.html?category=${encodeURIComponent(selectedCategory)}`;
    } else if (mode === "create") {
      window.location.href = `create.html?category=${encodeURIComponent(selectedCategory)}`;
    }
  }
});

// keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !nextButton.disabled) {
    nextButton.click();
  }
});
