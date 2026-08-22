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

const questions = [
  {
    text: "Are you good at fps/shooter games?",
    yes: ["crossbow", "sgkhan", "tvman", "blue", "markhor", "mrcake"],
    no: ["heizi", "crmsn", "death", "goku"]
  },
  {
    text: "Are you good at driving/racing games?",
    yes: ["markhor", "death"],
    no: ["crossbow", "sgkhan", "tvman", "blue", "heizi", "crmsn", "goku", "mrcake"]
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
    yes: ["blue", "death", "goku"],
    no: ["crossbow", "sgkhan", "tvman", "markhor", "heizi", "crmsn", "mrcake"]
  },
  {
    text: "Are you good/avg at battleground games?",
    yes: ["tvman", "heizi", "mrcake"],
    no: ["crossbow", "sgkhan", "blue", "markhor", "crmsn", "death", "goku"]
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

function resetScores() {
  scores = {};
  for (const key in people) scores[key] = 0;
  answerHistory = [];
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

  // Always finishes, even if something else is slow
  const timer = setInterval(function () {
    i += 1;
    if (i < steps.length) {
      $("calibrate-text").textContent = steps[i][0];
      $("calibrate-sub").textContent = steps[i][1];
    } else {
      clearInterval(timer);
      try {
        showResult();
      } catch (err) {
        console.error(err);
        alert("Result error: " + err.message);
      }
    }
  }, 700);
}

function showResult() {
  let highest = -1;
  for (const key in scores) {
    if (scores[key] > highest) highest = scores[key];
  }

  const winners = [];
  for (const key in scores) {
    if (scores[key] === highest) winners.push(key);
  }

  const title = $("result-title");
  const container = $("results-container");

  if (!title || !container) {
    throw new Error("Missing result-title or results-container in HTML");
  }

  title.textContent = winners.length === 1 ? "You are..." : "You could be...";
  container.innerHTML = "";

  for (let i = 0; i < winners.length; i++) {
    const person = people[winners[i]];
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

// Wire buttons after page loads
window.addEventListener("DOMContentLoaded", function () {
  $("start-btn").addEventListener("click", startQuiz);
  $("yes-btn").addEventListener("click", function () { answerQuestion("yes"); });
  $("no-btn").addEventListener("click", function () { answerQuestion("no"); });
  $("undo-btn").addEventListener("click", undoAnswer);
  $("restart-btn").addEventListener("click", startQuiz);
  $("theme-toggle").addEventListener("click", function () {
    document.body.classList.toggle("light");
  });
});
