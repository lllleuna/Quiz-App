// -------------------
// Landing Page Script
// -------------------

document.getElementById("getStartedBtn").addEventListener("click", () => {
  const welcomeSection = document.getElementById("welcome");
  const modeSection = document.getElementById("mode");

  welcomeSection.classList.add("slide-up");

  // Show the mode section after a short delay
  setTimeout(() => {
    modeSection.classList.add("show");
  }, 400);
});

// Create floating particles
function createParticle() {
  const particle = document.createElement("div");
  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "vw";
  particle.style.animationDelay = Math.random() * 2 + "s";
  particle.style.animationDuration = Math.random() * 3 + 3 + "s";
  document.body.appendChild(particle);

  setTimeout(() => {
    particle.remove();
  }, 6000);
}

// Generate particles periodically
setInterval(createParticle, 500);

// Add some initial particles
for (let i = 0; i < 3; i++) {
  setTimeout(createParticle, i * 200);
}
