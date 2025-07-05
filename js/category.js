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

nextButton.addEventListener("click", () => {
  if (selectedCategory) {
    console.log("Selected category:", selectedCategory);
    alert(`Proceeding with ${selectedCategory} category`);
    // navigation logic here
  }
});

// keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !nextButton.disabled) {
    nextButton.click();
  }
});
