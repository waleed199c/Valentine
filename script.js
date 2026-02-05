const card = document.getElementById("card");
const area = document.getElementById("buttonArea");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");
const hearts = document.getElementById("hearts");
const soundToggle = document.getElementById("soundToggle");

const HOVER_LIMIT = 8;
let noHoverCount = 0;
let soundEnabled = false;

const tauntsByStage = [
  ["Hehe nice try 😜", "Nope. Too slow 😌"],
  ["Still nope 👀", "You're getting warmer... not really 😂"],
  ["Bro stop 😭", "Commitment issues activated 🏃"],
  ["Last warning 😈", "Okay now you're just stubborn 🤨"],
];

function playTone({ frequency = 520, duration = 0.08, type = "sine" } = {}) {
  if (!soundEnabled) return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = 0.04;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  osc.stop(ctx.currentTime + duration);

  osc.onended = () => ctx.close();
}

function playYesChime() {
  [620, 760, 920].forEach((frequency, index) => {
    setTimeout(() => {
      playTone({ frequency, duration: 0.12, type: "triangle" });
    }, index * 95);
  });
}

function stageForHoverCount(count) {
  if (count <= 2) return 0;
  if (count <= 4) return 1;
  if (count <= 6) return 2;
  return 3;
}

function revealPopup({ resetHoverCount = false } = {}) {
  if (resetHoverCount) {
    noHoverCount = 0;
  }

  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function moveNoButton() {
  const areaRect = area.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  noHoverCount += 1;
  const stage = stageForHoverCount(noHoverCount);

  if (noHoverCount >= HOVER_LIMIT) {
    response.textContent = "Okay okay... you really won't quit 😵‍💫";
    revealPopup({ resetHoverCount: true });
    playTone({ frequency: 260, duration: 0.22, type: "sawtooth" });
    return;
  }

  const maxX = areaRect.width - btnRect.width;
  const maxY = areaRect.height - btnRect.height;

  const movementScale = [0.25, 0.45, 0.7, 1][stage];
  const currentLeft = parseFloat(noBtn.style.left) || maxX * 0.75;
  const currentTop = parseFloat(noBtn.style.top) || maxY * 0.5;

  const xJitter = (Math.random() - 0.5) * maxX * movementScale;
  const yJitter = (Math.random() - 0.5) * maxY * movementScale;

  const nextX = Math.min(maxX, Math.max(0, currentLeft + xJitter));
  const nextY = Math.min(maxY, Math.max(0, currentTop + yJitter));

  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;
  noBtn.style.transform = stage === 3 ? "translate(0, 0) rotate(-4deg)" : "none";

  const stageTaunts = tauntsByStage[stage];
  response.textContent = stageTaunts[Math.floor(Math.random() * stageTaunts.length)];
  playTone({ frequency: 420 + stage * 120, duration: 0.08, type: "square" });
}

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  const pool = ["💖", "💗", "✨", "💘"];
  heart.textContent = pool[Math.floor(Math.random() * pool.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDelay = `${Math.random() * 0.4}s`;
  heart.style.fontSize = `${0.9 + Math.random() * 1.2}rem`;
  hearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2400);
}

function runYesTextSequence() {
  const lines = [
    "Yaaay! Best choice ever 💘",
    "Officially my favorite person 💞",
    "Date unlocked: snacks + cuddles 🍓",
  ];

  lines.forEach((line, index) => {
    setTimeout(() => {
      response.textContent = line;
    }, index * 850);
  });
}

function celebrateYes() {
  runYesTextSequence();
  playYesChime();

  card.classList.add("celebrating");
  setTimeout(() => card.classList.remove("celebrating"), 1200);

  for (let i = 0; i < 28; i += 1) {
    setTimeout(createHeart, i * 65);
  }

  yesBtn.textContent = "❤";
  yesBtn.classList.add("chosen-heart");
  yesBtn.setAttribute("aria-label", "Yes, my heart says yes");
}

function closeOverlay() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

soundToggle.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundToggle.textContent = soundEnabled ? "🔊 Sound: On" : "🔇 Sound: Off";

  if (soundEnabled) {
    playTone({ frequency: 680, duration: 0.07, type: "triangle" });
  }
});

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("focus", moveNoButton);
noBtn.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
}, { passive: false });

noBtn.addEventListener("click", () => revealPopup());
yesBtn.addEventListener("click", celebrateYes);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && overlay.classList.contains("show")) {
    closeOverlay();
  }
});

closePopup.addEventListener("click", closeOverlay);

overlay.addEventListener("click", (event) => {
  if (event.target === overlay) {
    closeOverlay();
  }
});
