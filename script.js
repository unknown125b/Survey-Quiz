// ---------- PEOPLE DATA ----------
// Paths match files in the repo root (no Images/ folder)
const people = {
  crossbow: { name: "Crossbow Femboy", img: "Crossbow femboy.png" },
  sgkhan:   { name: "SG Khan",         img: "SG_Khan.png" },
  tvman:    { name: "Tv Man",          img: "Tv Man.png" },
  blue:     { name: "Blue",            img: "Blue.png" },
  markhor:  { name: "Markhor",         img: "Markhor.png" },
  heizi:    { name: "Heizi77",         img: "Heizi77.png" },
  crmsn:    { name: "Crmsn",           img: "Crmsn.png" },
  death:    { name: "Death",           img: "Death.png" },
  goku:     { name: "Goku Chan",       img: "Goku chan.png" }
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
  const list = answer === "yes" ? 
