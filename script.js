// ---------- PEOPLE DATA ----------
const people = {
  crossbow: { name: "Crossbow Femboy", img: "Images/Crossbow femboy.png" },
  sgkhan:   { name: "SG Khan",         img: "Images/SG_Khan.png" },
  tvman:    { name: "Tv Man",          img: "Images/Tv Man.png" },
  blue:     { name: "Blue",            img: "Images/Blue.png" },
  markhor:  { name: "Markhor",         img: "Images/Markhor.png" },
  heizi:    { name: "Heizi77",         img: "Images/Heizi77.png" },
  crmsn:    { name: "Crmsn",           img: "Images/Crmsn.png" },
  death:    { name: "Death",           img: "Images/Death.png" },
  goku:     { name: "Goku Chan",       img: "Images/Goku chan.png" }
};

// ---------- QUESTIONS ----------
const questions = [
  { text: "Are you good at fps/shooter games?",
    yes: ["crossbow","sgkhan","tvman","blue","markhor"],
    no:  ["heizi","crmsn","death","goku"] },

  { text: "Are you good at driving/racing games?",
    yes: ["markhor","death"],
    no:  ["crossbow","sgkhan","tvman","blue","heizi","crmsn","goku"] },

  { text: "Are you good/avg at obby games?",
    yes: ["heizi"],
    no:  ["crossbow","sgkhan","tvman","blue","markhor","crmsn","death","goku"] },

  { text: "Are you good/avg at rhythm games (osu, fnf)?",
    yes: ["tvman","heizi"],
    no:  ["crossbow","sgkhan","blue","markhor","crmsn","death","goku"] },

  { text: "Are you good at survival & crafting games (Minecraft)?",
    yes: ["sgkhan","markhor"],
    no:  ["crossbow","tvman","blue","heizi","crmsn","death","goku"] },

  { text: "Do you like single player games?",
    yes: ["crmsn","crossbow","heizi"],
    no:  ["sgkhan","tvman","blue","markhor","death","goku"] },

  { text: "Are you good at strategy games?",
    yes: ["crossbow","crmsn"],
    no:  ["sgkhan","tvman","blue","markhor","heizi","death","goku"] },

  { text: "Are you good at auto-runner movement games (Geometry Dash)?",
    yes: ["heizi","crmsn","tvman"],
    no:  ["crossbow","sgkhan","blue","markhor","death","goku"] },

  { text: "Are you good at action/rpg games?",
    yes: ["goku","tvman","death"],
    no:  ["crossbow","sgkhan","blue","markhor","heizi","crmsn"] },

  { text: "Are you good at battle royale games?",
    yes: ["blue","death","goku"],
    no:  ["crossbow","sgkhan","tvman","markhor","heizi","crmsn"] },

  { text: "Are you good/avg at battleground games?",
    yes: ["tvman","heizi"],
    no:  ["crossbow","sgkhan","blue","markhor","crmsn","death","goku"] },

  { text: "Are you good at horror games?",
    yes: ["blue","markhor","crmsn","death","goku","sgkhan"],
    no:  ["crossbow","tvman","heizi"] },

  { text: "Do you like 2d action/story games?",
    yes: ["crmsn"],
    no:  ["crossbow","sgkhan","tvman","blue","markhor","heizi","death","goku"] }
];

// ---------- STATE ----------
let currentQuestion = 0;
let scores = {};
let answerHistory = [];

function resetScores() {
  scores = {};
  Object.keys(people).forEach(key => scores[key] = 0);
  answerHistory = [];
}

// ---------- SCREEN ELEMENTS ----------
const welcomeScreen = document.getElementById("welcome-screen");
const quizScreen = document.getElementById("quiz-screen");
const calibratingScreen = document.getElementById("calibrating-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const yesBtn = document.getElementById("yes-btn");
const noBtn = document.getElementById("no-btn");
const undoBtn = document.getElementById("undo-btn");
const restartBtn = document.getElementById("restart-btn");

const questionText = document.getElementById("question-text");
const calibrateText = document.getElementById("calibrate-text");
const calibrateSub = document.getElementById("calibrate-sub");

const resultTitle = document.getElementById("result-title");
const resultsContainer = document.getElementById("results-container");

// ---------- FUNCTIONS ----------
function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screen.classList.add("active");
}

function startQuiz() {
  currentQuestion = 0;
  resetScores();
  showScreen(quizScreen);
  showQuestion();
  updateUndoButton();
}

function showQuestion() {
  const q = questions[currentQuestion];
  questionText.textContent = q.text;
  updateUndoButton();
}

function updateUndoButton() {
  undoBtn.disabled = answerHistory.length === 0;
}

function answerQuestion(answer) {
  const q = questions[currentQuestion];
  const list = answer === "yes" ? q.yes : q.no;

  answerHistory.push({
    questionIndex: currentQuestion,
    answer: answer,
    people: [...list]
  });

  list.forEach(person => scores[person]++);
  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    startCalibrating();
  }
}

function undoAnswer() {
  if (answerHistory.length === 0) return;

  const last = answerHistory.pop();
  last.people.forEach(person => scores[person]--);

  currentQuestion = last.questionIndex;
  showQuestion();
}

function startCalibrating() {
  showScreen(calibratingScreen);

  const steps = [
    { title: "Calibrating...", sub: "Please wait" },
    { title: "Analyzing answers...", sub: "Crunching the numbers" },
    { title: "Matching profile...", sub: "Almost there" },
    { title: "Finalizing result...", sub: "One moment" }
  ];

  let i = 0;
  calibrateText.textContent = steps[0].title;
  calibrateSub.textContent = steps[0].sub;

  const interval = setInterval(() => {
    i++;
    if (i < steps.length) {
      calibrateText.textContent = steps[i].title;
      calibrateSub.textContent = steps[i].sub;
    } else {
      clearInterval(interval);
      showResult();
    }
  }, 800);
}

function showResult() {
  // Find highest score
  let highest = -1;
  for (let key in scores) {
    if (scores[key] > highest) highest = scores[key];
  }

  // Get ALL people with that score (handles ties)
  const winners = Object.keys(scores).filter(key => scores[key] === highest);

  // Title changes if tie
  if (winners.length === 1) {
    resultTitle.textContent = "You are...";
  } else {
    resultTitle.textContent = "You could be...";
  }

  // Build result cards
  resultsContainer.innerHTML = "";
  winners.forEach(key => {
    const person = people[key];
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <img src="${person.img}" alt="${person.name}">
      <h2>${person.name}</h2>
    `;
    resultsContainer.appendChild(card);
  });

  showScreen(resultScreen);
}

// ---------- EVENT LISTENERS ----------
startBtn.addEventListener("click", startQuiz);
yesBtn.addEventListener("click", () => answerQuestion("yes"));
noBtn.addEventListener("click", () => answerQuestion("no"));
undoBtn.addEventListener("click", undoAnswer);
restartBtn.addEventListener("click", startQuiz);

document.getElementById("theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});