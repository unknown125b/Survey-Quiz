const people = {
  crossbow: { name: "Crossbow Femboy", img: "Crossbow femboy.png" },
  sgkhan:   { name: "SG Khan",         img: "SG_Khan.png" },
  tvman:    { name: "Tv Man",          img: "Tv Man.png" },
  blue:     { name: "Blue",            img: "Blue.png" },
  markhor:  { name: "Markhor",         img: "Markhor.png" },
  heizi:    { name: "Heizi77",         img: "Heizi77.png" },
  crmsn:    { name: "Crmsn",           img: "Crmsn.png" },
  death:    { name: "Death",           img: "Death.png" },
  goku:     { name: "Goku Chan",       img: "Goku chan.png" },
  mrcake:   { name: "Mr Cake",         img: "Mr Cake.png" }
};

// Real-life names for the scary question
const realNames = {
  heizi: "Giorgi",
  markhor: "Abdullah",
  death: "Yousaf",
  crossbow: "Sanaullah",
  crmsn: "Ali",
  goku: "Saad",
  tvman: "Unknown",
  mrcake: "Ilteris"
  // blue + sgkhan have no real-name mapping
};

const questions = [
  {
    text: "Are you good at fps/shooter games?",
    yes: ["crossbow", "sgkhan", "tvman", "blue", "markhor", "mrcake"],
    no: ["heizi", "crmsn", "death", "goku"]
  },
  {
    text: "Are you good at driving/racing games?",
    yes: ["markhor", "death", "crossbow"],
    no: ["sgkhan", "tvman", "blue", "heizi", "crmsn", "goku", "mrcake"]
  },
  {
    text: "Are you good/avg at obby games?",
    yes: ["heizi", "mrcake"],
    no: ["crossbow", "sgkhan", "tvman", "blue", "markhor", "crmsn", "death", "goku"]
  },
  {
    text: "Are you good/avg at rhythm games (osu, fnf)?",
    yes: ["tvman", "heizi"],
    no: ["crossbow", "sgkhan", "blue", "markhor", "crmsn", "death", "goku", "mrcake"]
  },
  {
    text: "Are you good at survival & crafting games (Minecraft)?",
    yes: ["sgkhan", "markhor"],
    no: ["crossbow", "tvman", "blue", "heizi", "crmsn", "death", "goku", "mrcake"]
  },
  {
    text: "Do you like single player games?",
    yes: ["crmsn", "crossbow", "heizi", "mrcake"],
    no: ["sgkhan", "tvman", "blue", "markhor", "death", "goku"]
  },
  {
    text: "Are you good at strategy games?",
    yes: ["crossbow", "crmsn", "mrcake"],
    no: ["sgkhan", "tvman", "blue", "markhor", "heizi", "death", "goku"]
  },
  {
    text: "Are you good at auto-runner movement games (Geometry Dash)?",
    yes: ["heizi", "crmsn", "tvman"],
    no: ["crossbow", "sgkhan", "blue", "markhor", "death", "goku", "mrcake"]
  },
  {
    text: "Are you good at action/rpg games?",
    yes: ["goku", "tvman", "death"],
    no: ["crossbow", "sgkhan", "blue", "markhor", "heizi", "crmsn", "mrcake"]
  },
  {
    text: "Are you good at battle royale games?",
    yes: ["blue", "death", "goku", "crossbow"],
    no: ["sgkhan", "tvman", "markhor", "heizi", "crmsn", "mrcake"]
  },
  {
    text: "Are you good/avg at battleground games?",
    yes: ["tvman", "heizi", "mrcake", "crossbow"],
    no: ["sgkhan", "blue", "markhor", "crmsn", "death", "goku"]
  },
  {
    text: "Are you good at horror games?",
    yes: ["blue", "markhor", "crmsn", "death", "goku", "sgkhan"],
    no: ["crossbow", "tvman", "heizi", "mrcake"]
  },
  {
    text: "Do you like 2d action/story games?",
    yes: ["crmsn", "mrcake"],
    no: ["crossbow", "sgkhan", "tvman", "blue", "markhor", "heizi", "death", "goku"]
  }
];

let currentQuestion = 0;
let scores = {};
let answerHistory = [];
let currentWinners = [];

function resetScores() {
  scores = {};
  for (const key in people) scores[key] = 0;
  answerHistory = [];
  currentWinners = [];
}

function $(id) {
  return document.getElementById(id);
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(function (s) {
    s.classList.remove("active");
  });
  const el = $(id);
  if (el) el.classList.add("active");
}

function updateUndoButton() {
  const undoBtn = $("undo-btn");
  if (undoBtn) undoBtn.disabled = answerHistory.length === 0;
}

function showQuestion() {
  $("question-text").textContent = questions[currentQuestion].text;
  updateUndoButton();
}

function startQuiz() {
  currentQuestion = 0;
  resetScores();
  showScreen("quiz-screen");
  showQuestion();
}

function answerQuestion(answer) {
  const q = questions[currentQuestion];
  const list = answer === "yes" ? q.yes : q.no;

  answerHistory.push({
    questionIndex: currentQuestion,
    people: list.slice()
  });

  for (let i = 0; i < list.length; i++) {
    scores[list[i]] += 1;
  }

  currentQuestion += 1;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    startCalibrating();
  }
}

function undoAnswer() {
  if (answerHistory.length === 0) return;

  const last = answerHistory.pop();
  for (let i = 0; i < last.people.length; i++) {
    scores[last.people[i]] -= 1;
  }

  currentQuestion = last.questionIndex;
  showQuestion();
}

function getWinners() {
  let highest = -1;
  for (const key in scores) {
    if (scores[key] > highest) highest = scores[key];
  }

  const winners = [];
  for (const key in scores) {
    if (scores[key] === highest) winners.push(key);
  }
  return winners;
}

function startCalibrating() {
  showScreen("calibrating-screen");

  const steps = [
    ["Calibrating...", "Please wait"],
    ["Analyzing answers...", "Crunching the numbers"],
    ["Matching profile...", "Almost there"],
    ["Finalizing result...", "One moment"]
  ];

  let i = 0;
  $("calibrate-text").textContent = steps[0][0];
  $("calibrate-sub").textContent = steps[0][1];

  const timer = setInterval(function () {
    i += 1;
    if (i < steps.length) {
      $("calibrate-text").textContent = steps[i][0];
      $("calibrate-sub").textContent = steps[i][1];
    } else {
      clearInterval(timer);
      currentWinners = getWinners();
      maybeAskIdentity();
    }
  }, 700);
}

function maybeAskIdentity() {
  // Real names for whoever won
  const names = [];
  for (let i = 0; i < currentWinners.length; i++) {
    const key = currentWinners[i];
    if (realNames[key]) names.push(realNames[key]);
  }

  // No mapped real names (e.g. only Blue / SG Khan) → skip to result
  if (names.length === 0) {
    showResult();
    return;
  }

  let question;
  if (currentWinners.length === 1 && names.length === 1) {
    question = "Are you " + names[0] + "?";
  } else {
    question = "Are you one of them: " + names.join(", ") + "?";
  }

  $("identity-question").textContent = question;
  showScreen("identity-screen");
}

function showResult() {
  const title = $("result-title");
  const container = $("results-container");

  title.textContent = currentWinners.length === 1 ? "You are..." : "You could be...";
  container.innerHTML = "";

  for (let i = 0; i < currentWinners.length; i++) {
    const person = people[currentWinners[i]];
    const card = document.createElement("div");
    card.className = "result-card";

    const img = document.createElement("img");
    img.src = person.img;
    img.alt = person.name;

    const name = document.createElement("h2");
    name.textContent = person.name;

    card.appendChild(img);
    card.appendChild(name);
    container.appendChild(card);
  }

  showScreen("result-screen");
}

window.addEventListener("DOMContentLoaded", function () {
  $("start-btn").addEventListener("click", startQuiz);
  $("yes-btn").addEventListener("click", function () { answerQuestion("yes"); });
  $("no-btn").addEventListener("click", function () { answerQuestion("no"); });
  $("undo-btn").addEventListener("click", undoAnswer);
  $("restart-btn").addEventListener("click", startQuiz);

  // Yes/No on scary screen both continue to the reveal
  $("identity-yes-btn").addEventListener("click", showResult);
  $("identity-no-btn").addEventListener("click", showResult);

  $("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("light");
  });
});
