const area = document.getElementById("buttonArea");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");
const title = document.getElementById("title");
const subtitle = document.getElementById("subtitle");
const hearts = document.getElementById("hearts");

const HOVER_LIMIT = 8;
let noHoverCount = 0;

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

  noHoverCount += 1;
  if (noHoverCount >= HOVER_LIMIT) {
    response.textContent = "Okay okay... you really won't quit 😵‍💫";
    revealPopup();
    return;
  }

  response.textContent = dodgeMessages[Math.floor(Math.random() * dodgeMessages.length)];
}

function revealPopup() {
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "💖" : "💗";
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDelay = `${Math.random() * 0.4}s`;
  heart.style.fontSize = `${0.9 + Math.random() * 1.2}rem`;
  hearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2400);
}

function celebrateYes() {
  response.textContent = "Yaaay! Best choice ever 💘";
  title.textContent = "You just made my heart do backflips!";
  subtitle.textContent = "Officially the cutest couple energy unlocked ✨";

  for (let i = 0; i < 24; i += 1) {
    setTimeout(createHeart, i * 70);
  }

  yesBtn.textContent = "My Valentine 💞";
  yesBtn.classList.add("chosen");
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", revealPopup);
yesBtn.addEventListener("click", celebrateYes);

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
