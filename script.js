document.addEventListener("DOMContentLoaded", () => {
  // ---------- PEOPLE DATA ----------
  // Everything is in the root/main folder, so image paths are just file names.
  const people = {
    blue: {
      name: "Blue",
      img: "Blue.png"
    },
    crmsn: {
      name: "Crmsn",
      img: "Crmsn.png"
    },
    crossbow: {
      name: "Crossbow Femboy",
      img: "Crossbow femboy.png"
    },
    death: {
      name: "Death",
      img: "Death.png"
    },
    goku: {
      name: "Goku Chan",
      img: "Goku chan.png"
    },
    heizi: {
      name: "Heizi77",
      img: "Heizi77.png"
    },
    markhor: {
      name: "Markhor",
      img: "Markhor.png"
    },
    sgkhan: {
      name: "SG Khan",
      img: "SG_Khan.png"
    },
    tvman: {
      name: "Tv Man",
      img: "Tv Man.png"
    }
  };

  const allPeople = Object.keys(people);

  function remainingPeople(exceptList) {
    return allPeople.filter(person => !exceptList.includes(person));
  }

  // ---------- QUESTIONS ----------
  const questions = [
    {
      text: "Are you good at FPS/shooter games?",
      yes: ["crossbow", "sgkhan", "tvman", "blue", "markhor"],
      no: remainingPeople(["crossbow", "sgkhan", "tvman", "blue", "markhor"])
    },
    {
      text: "Are you good at driving/racing games?",
      yes: ["markhor", "death"],
      no: remainingPeople(["markhor", "death"])
    },
    {
      text: "Are you good/avg at obby games?",
      yes: ["heizi"],
      no: remainingPeople(["heizi"])
    },
    {
      text: "Are you good/avg at rhythm games like osu or FNF?",
      yes: ["tvman", "heizi"],
      no: remainingPeople(["tvman", "heizi"])
    },
    {
      text: "Are you good at survival & crafting games like Minecraft?",
      yes: ["sgkhan", "markhor"],
      no: remainingPeople(["sgkhan", "markhor"])
    },
    {
      text: "Do you like single player games?",
      yes: ["crmsn", "crossbow", "heizi"],
      no: remainingPeople(["crmsn", "crossbow", "heizi"])
    },
    {
      text: "Are you good at strategy games?",
      yes: ["crossbow", "crmsn"],
      no: remainingPeople(["crossbow", "crmsn"])
    },
    {
      text: "Are you good at auto-runner movement games like Geometry Dash?",
      yes: ["heizi", "crmsn", "tvman"],
      no: remainingPeople(["heizi", "crmsn", "tvman"])
    },
    {
      text: "Are you good at action/RPG games?",
      yes: ["goku", "tvman", "death"],
      no: remainingPeople(["goku", "tvman", "death"])
    },
    {
      text: "Are you good at battle royale games?",
      yes: ["blue", "death", "goku"],
      no: remainingPeople(["blue", "death", "goku"])
    },
    {
      text: "Are you good/avg at battleground games?",
      yes: ["tvman", "heizi"],
      no: remainingPeople(["tvman", "heizi"])
    },
    {
      text: "Are you good at horror games?",
      yes: ["sgkhan", "blue", "crmsn", "death", "goku", "markhor"],
      no: remainingPeople(["sgkhan", "blue", "crmsn", "death", "goku", "markhor"])
    },
    {
      text: "Do you like 2D action/story games?",
      yes: ["crmsn"],
      no: remainingPeople(["crmsn"])
    }
  ];

  // ---------- STATE ----------
  let currentQuestion = 0;
  let scores = {};
  let history = [];
  let resultTimer = null;

  // ---------- ELEMENTS ----------
  const welcomeScreen = document.getElementById("welcome-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const calibratingScreen = document.getElementById("calibrating-screen");
  const resultScreen = document.getElementById("result-screen");

  const startBtn = document.getElementById("start-btn");
  const yesBtn = document.getElementById("yes-btn");
  const noBtn = document.getElementById("no-btn");
  const undoBtn = document.getElementById("undo-btn");
  const calibrationUndoBtn = document.getElementById("calibration-undo-btn");
  const resultUndoBtn = document.getElementById("result-undo-btn");
  const restartBtn = document.getElementById("restart-btn");

  const questionText = document.getElementById("question-text");
  const progressText = document.getElementById("progress");

  const resultTitle = document.getElementById("result-title");
  const resultsList = document.getElementById("results-list");

  // ---------- FUNCTIONS ----------
  function resetScores() {
    scores = {};

    allPeople.forEach(person => {
      scores[person] = 0;
    });
  }

  function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => {
      s.classList.remove("active");
    });

    screen.classList.add("active");
  }

  function startQuiz() {
    clearTimeout(resultTimer);

    currentQuestion = 0;
    history = [];
    resetScores();

    showScreen(quizScreen);
    showQuestion();
  }

  function showQuestion() {
    const q = questions[currentQuestion];

    questionText.textContent = q.text;

    if (progressText) {
      progressText.textContent = "";
    }

    if (undoBtn) {
      undoBtn.disabled = history.length === 0;
    }
  }

  function addPoints(list) {
    list.forEach(person => {
      scores[person]++;
    });
  }

  function removePoints(list) {
    list.forEach(person => {
      scores[person]--;
    });
  }

  function answerQuestion(answer) {
    const q = questions[currentQuestion];
    const pointList = answer === "yes" ? q.yes : q.no;

    addPoints(pointList);

    history.push({
      questionIndex: currentQuestion,
      answer: answer,
      pointList: pointList
    });

    currentQuestion++;

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showCalibrating();
    }
  }

  function undoLastAnswer() {
    clearTimeout(resultTimer);

    if (history.length === 0) {
      return;
    }

    const lastAnswer = history.pop();

    removePoints(lastAnswer.pointList);

    currentQuestion = lastAnswer.questionIndex;

    showScreen(quizScreen);
    showQuestion();
  }

  function showCalibrating() {
    showScreen(calibratingScreen);

    resultTimer = setTimeout(() => {
      showResult();
    }, 2500);
  }

  function showResult() {
    let highestScore = -1;
    let winners = [];

    for (let person in scores) {
      if (scores[person] > highestScore) {
        highestScore = scores[person];
        winners = [person];
      } else if (scores[person] === highestScore) {
        winners.push(person);
      }
    }

    resultsList.innerHTML = "";

    if (winners.length === 1) {
      resultTitle.textContent = "You are...";
    } else {
      resultTitle.textContent = "You are tied between...";
    }

    winners.forEach(winnerKey => {
      const result = people[winnerKey];

      const card = document.createElement("div");
      card.classList.add("result-card");

      card.innerHTML = `
        <img src="${result.img}" alt="${result.name}">
        <h2>${result.name}</h2>
      `;

      resultsList.appendChild(card);
    });

    showScreen(resultScreen);
  }

  // ---------- EVENT LISTENERS ----------
  startBtn.addEventListener("click", startQuiz);

  yesBtn.addEventListener("click", () => {
    answerQuestion("yes");
  });

  noBtn.addEventListener("click", () => {
    answerQuestion("no");
  });

  if (undoBtn) {
    undoBtn.addEventListener("click", undoLastAnswer);
  }

  if (calibrationUndoBtn) {
    calibrationUndoBtn.addEventListener("click", undoLastAnswer);
  }

  if (resultUndoBtn) {
    resultUndoBtn.addEventListener("click", undoLastAnswer);
  }

  restartBtn.addEventListener("click", startQuiz);

  const themeToggle = document.getElementById("theme-toggle");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light");
    });
  }
});
