const area = document.getElementById("buttonArea");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");

const dodgeMessages = [
  "Nope. Too slow 😜",
  "Almost had it!",
  "Try again, ninja 🥷",
  "You can't catch me!",
];

function moveNoButton() {
  const areaRect = area.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = areaRect.width - btnRect.width;
  const maxY = areaRect.height - btnRect.height;

  const x = Math.max(0, Math.random() * maxX);
  const y = Math.max(0, Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
  noBtn.style.transform = "none";

  response.textContent = dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)];
}

function revealPopup() {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", revealPopup);

yesBtn.addEventListener("click", () => {
  response.textContent = "Yaaay! Best choice ever 💘";
});

closePopup.addEventListener("click", () => {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
});

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
  }
});
