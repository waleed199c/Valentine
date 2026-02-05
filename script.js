const card = document.getElementById("card");
const area = document.getElementById("buttonArea");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const response = document.getElementById("response");
const overlay = document.getElementById("overlay");
const closePopup = document.getElementById("closePopup");
const hearts = document.getElementById("hearts");
const soundToggle = document.getElementById("soundToggle");
const tryAgainBtn = document.getElementById("tryAgainBtn");
const popupTitle = document.getElementById("popupTitle");
const popupNote = document.getElementById("popupNote");
const noGifFrame = document.getElementById("noGifFrame");
const gifCreditLink = document.getElementById("gifCreditLink");

const HOVER_LIMIT = 8;
const SAFE_POINTER_DISTANCE = 110;

let noHoverCount = 0;
let soundEnabled = true;
let yesSelected = false;
let pointerInArea = false;
let pointerX = 0;
let pointerY = 0;

const defaultPopup = {
  title: "Stop messing with me 😤",
  note: "You poked the No button way too much 😂",
  gifEmbed: "https://tenor.com/embed/5459893182316367885",
  source: "https://tenor.com/view/cute-cat-hands-up-close-up-gun-gif-5459893182316367885",
};

const easterEggPopup = {
  title: "OH COME ON 😩",
  note: "You said yes and still clicked no? Wild behavior 😂",
  gifEmbed: "https://tenor.com/embed/13885231",
  source: "https://tenor.com/view/come-on-really-seriously-gif-13885231",
};

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
  [620, 760, 920, 820].forEach((frequency, index) => {
    setTimeout(() => {
      playTone({ frequency, duration: 0.12, type: "triangle" });
    }, index * 110);
  });
}

function stageForHoverCount(count) {
  if (count <= 2) return 0;
  if (count <= 4) return 1;
  if (count <= 6) return 2;
  return 3;
}

function setPopupContent(popup) {
  popupTitle.textContent = popup.title;
  popupNote.textContent = popup.note;
  noGifFrame.src = popup.gifEmbed;
  gifCreditLink.href = popup.source;
}

function revealPopup({ resetHoverCount = false, easterEgg = false } = {}) {
  if (resetHoverCount) {
    noHoverCount = 0;
  }

  setPopupContent(easterEgg ? easterEggPopup : defaultPopup);
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function findSafeNoButtonPosition(maxX, maxY) {
  let candidateX = Math.random() * maxX;
  let candidateY = Math.random() * maxY;

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const testX = Math.random() * maxX;
    const testY = Math.random() * maxY;

    if (!pointerInArea) {
      candidateX = testX;
      candidateY = testY;
      break;
    }

    const distance = Math.hypot(testX - pointerX, testY - pointerY);
    if (distance > SAFE_POINTER_DISTANCE) {
      candidateX = testX;
      candidateY = testY;
      break;
    }
  }

  return { x: candidateX, y: candidateY };
}

function moveNoButton() {
  if (yesSelected) {
    return;
  }

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

  const movementScale = [0.3, 0.5, 0.75, 1][stage];
  const { x: safeX, y: safeY } = findSafeNoButtonPosition(maxX, maxY);

  const currentLeft = parseFloat(noBtn.style.left) || maxX * 0.75;
  const currentTop = parseFloat(noBtn.style.top) || maxY * 0.5;

  const nextX = currentLeft + (safeX - currentLeft) * movementScale;
  const nextY = currentTop + (safeY - currentTop) * movementScale;

  noBtn.style.left = `${Math.max(0, Math.min(maxX, nextX))}px`;
  noBtn.style.top = `${Math.max(0, Math.min(maxY, nextY))}px`;
  noBtn.style.transform = stage === 3 ? "translate(0, 0) rotate(-5deg)" : "none";

  const stageTaunts = tauntsByStage[stage];
  response.textContent = stageTaunts[Math.floor(Math.random() * stageTaunts.length)];
  playTone({ frequency: 420 + stage * 120, duration: 0.08, type: "square" });
}

function createHeart() {
  const heart = document.createElement("span");
  heart.className = "heart";
  const pool = ["💖", "💗", "✨", "💘", "🌈"];
  heart.textContent = pool[Math.floor(Math.random() * pool.length)];
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.animationDelay = `${Math.random() * 0.4}s`;
  heart.style.fontSize = `${0.9 + Math.random() * 1.2}rem`;
  hearts.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 2600);
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
    }, index * 900);
  });
}

function celebrateYes() {
  yesSelected = true;

  runYesTextSequence();
  playYesChime();

  card.classList.add("celebrating");
  setTimeout(() => card.classList.remove("celebrating"), 2800);

  for (let i = 0; i < 32; i += 1) {
    setTimeout(createHeart, i * 70);
  }

  yesBtn.textContent = "❤";
  yesBtn.classList.add("chosen-heart", "centered");
  yesBtn.setAttribute("aria-label", "Yes, my heart says yes");

  noBtn.classList.add("no-peeking");
  noBtn.setAttribute("aria-label", "Sneaky no button peeking out");

  tryAgainBtn.hidden = false;
}

function resetState() {
  yesSelected = false;
  noHoverCount = 0;

  closeOverlay();
  response.textContent = "You know what to do 😌";

  yesBtn.textContent = "Yes 💖";
  yesBtn.classList.remove("chosen-heart", "centered");
  yesBtn.setAttribute("aria-label", "Yes button");

  noBtn.classList.remove("no-peeking");
  noBtn.style.left = "75%";
  noBtn.style.top = "50%";
  noBtn.style.transform = "translate(-50%, -50%)";

  tryAgainBtn.hidden = true;
}

function closeOverlay() {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

area.addEventListener("mousemove", (event) => {
  const rect = area.getBoundingClientRect();
  pointerInArea = true;
  pointerX = event.clientX - rect.left;
  pointerY = event.clientY - rect.top;
});

area.addEventListener("mouseleave", () => {
  pointerInArea = false;
});

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

noBtn.addEventListener("click", () => {
  if (yesSelected) {
    revealPopup({ easterEgg: true });
    playTone({ frequency: 310, duration: 0.17, type: "sawtooth" });
    return;
  }

  revealPopup();
});

yesBtn.addEventListener("click", celebrateYes);
tryAgainBtn.addEventListener("click", resetState);

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
