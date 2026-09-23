const wasteItems = [
  {
    keys: ["banana", "banana peel", "fruit peel", "vegetable peel", "food scrap", "food scraps", "leftover food", "tea leaves", "coffee grounds"],
    category: "Wet Waste",
    icon: "🍃",
    tip: "Food and biodegradable waste generally belongs with wet/organic waste. Follow your local collection rules."
  },
  {
    keys: ["newspaper", "paper", "notebook", "book", "cardboard", "carton", "magazine"],
    category: "Dry / Recyclable",
    icon: "📦",
    tip: "Keep paper and cardboard clean and dry where your local system accepts them for recycling."
  },
  {
    keys: ["plastic bottle", "plastic bag", "plastic wrapper", "plastic container", "plastic cup", "plastic"],
    category: "Plastic",
    icon: "🧴",
    tip: "Check local recycling instructions because accepted plastic types can vary."
  },
  {
    keys: ["battery", "batteries", "power bank", "charger", "earphones", "headphones", "keyboard", "mouse", "electronic", "e-waste", "ewaste"],
    category: "E-waste / Special",
    icon: "🔋",
    tip: "Do not put batteries or electronic items in ordinary household bins. Use an appropriate e-waste collection point."
  },
  {
    keys: ["glass bottle", "glass jar", "jar"],
    category: "Glass / Recyclable",
    icon: "🍾",
    tip: "Handle broken glass carefully and follow your local collection instructions."
  },
  {
    keys: ["diaper", "sanitary pad", "medical waste", "bandage"],
    category: "Special / Other",
    icon: "⚠️",
    tip: "These items may require separate handling. Follow local disposal guidance."
  }
];

const quizQuestions = [
  ["Where would a banana peel usually go?", "Wet Waste", ["Wet Waste", "E-waste", "Paper", "Plastic"]],
  ["What is a newspaper mainly classified as?", "Dry / Recyclable", ["Wet Waste", "Dry / Recyclable", "E-waste", "Special Waste"]],
  ["Where should a household battery go?", "E-waste / Special", ["Wet Waste", "Paper", "E-waste / Special", "Food Waste"]],
  ["Which item is plastic?", "Plastic", ["Banana peel", "Newspaper", "Plastic bottle", "Tea leaves"]],
  ["What should you do when you are unsure?", "Check local guidance", ["Always guess", "Ignore it", "Check local guidance", "Mix everything"]],
  ["What helps make segregation easier?", "Clear labels", ["Clear labels", "More confusion", "No bins", "Guessing"]],
  ["Which is an example of wet waste?", "Food scraps", ["Food scraps", "Newspaper", "Battery", "Plastic bottle"]],
  ["Which is an example of dry/recyclable waste?", "Cardboard", ["Cardboard", "Fruit peel", "Battery", "Leftover food"]],
  ["Why is WasteWise useful?", "It helps identify categories", ["It creates waste", "It helps identify categories", "It replaces collection", "It burns waste"]],
  ["What should you follow for actual disposal?", "Local waste rules", ["Random advice", "Local waste rules", "Only this website", "No rules"]]
];

let quizIndex = 0;
let quizScore = 0;
let selected = false;

function $(id) {
  return document.getElementById(id);
}

function getData() {
  return JSON.parse(
    localStorage.getItem("wastewiseData") ||
    '{"searched":0,"attempts":0,"best":0}'
  );
}

function saveData(data) {
  localStorage.setItem("wastewiseData", JSON.stringify(data));
}

function updateStats() {
  const data = getData();

  if ($("searchedCount")) {
    $("searchedCount").textContent = data.searched;
  }

  if ($("quizAttempts")) {
    $("quizAttempts").textContent = data.attempts;
  }

  if ($("bestScore")) {
    $("bestScore").textContent = `${data.best}/10`;
  }

  if ($("itemCount")) {
    $("itemCount").textContent = wasteItems.length;
  }
}

function toast(message) {
  const box = $("toast");

  if (!box) return;

  box.textContent = message;
  box.classList.add("show");

  setTimeout(() => {
    box.classList.remove("show");
  }, 2200);
}

function clearFinderResult() {
  const result = $("finderResult");

  if (!result) return;

  result.innerHTML = "";
  result.classList.add("hidden");
}

function findWaste(text) {
  const query = text.trim().toLowerCase();

  if (!query) {
    return null;
  }

  for (const item of wasteItems) {
    if (
      item.keys.some(
        key => query.includes(key) || key.includes(query)
      )
    ) {
      return item;
    }
  }

  return {
    category: "Check Local Guidance",
    icon: "🔎",
    tip: "We don't have this item in the prototype yet. Check your local waste authority's instructions."
  };
}

function showResult(item, searched) {
  const result = $("finderResult");

  if (!result) return;

  result.innerHTML = `
    <div class="result-row">
      <div class="result-icon">${item.icon}</div>

      <div>
        <div class="result-category">${item.category}</div>

        <h3>${searched.replace(/</g, "&lt;")}</h3>

        <p class="result-help">${item.tip}</p>
      </div>
    </div>
  `;

  result.classList.remove("hidden");
}

function runSearch() {
  const input = $("searchInput");

  if (!input) return;

  const text = input.value.trim();

  // IMPORTANT:
  // If the search box is empty, remove the old result.
  if (!text) {
    clearFinderResult();
    return;
  }

  const item = findWaste(text);

  if (!item) {
    clearFinderResult();
    return;
  }

  const data = getData();

  data.searched++;

  saveData(data);
  updateStats();

  showResult(item, text);
}

function focusFinder() {
  const finder = document.querySelector("#finder");

  if (finder) {
    finder.scrollIntoView({
      behavior: "smooth"
    });
  }

  setTimeout(() => {
    if ($("searchInput")) {
      $("searchInput").focus();
    }
  }, 500);
}


/* -----------------------------
   WASTE FINDER
----------------------------- */

const searchInput = $("searchInput");
const searchButton = $("searchBtn");
const clearButton = $("clearSearch");

if (searchButton) {
  searchButton.addEventListener("click", runSearch);
}

if (clearButton) {
  clearButton.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }

    clearFinderResult();
  });
}

if (searchInput) {

  searchInput.addEventListener("input", () => {

    // THIS is what makes the old result disappear
    // as soon as the user deletes the search text.

    if (searchInput.value.trim() === "") {
      clearFinderResult();
    }

  });

  searchInput.addEventListener("keydown", event => {

    if (event.key === "Enter") {
      runSearch();
    }

  });
}


/* Quick search buttons */

document.querySelectorAll(".quick-items button").forEach(button => {

  button.addEventListener("click", () => {

    if (!searchInput) return;

    searchInput.value = button.dataset.item;

    runSearch();

  });

});


/* -----------------------------
   MOBILE MENU
----------------------------- */

const menuButton = $("menuBtn");
const nav = $("nav");

if (menuButton && nav) {

  menuButton.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

}

document.querySelectorAll("nav a").forEach(link => {

  link.addEventListener("click", () => {

    if (nav) {
      nav.classList.remove("open");
    }

  });

});


/* -----------------------------
   QUIZ
----------------------------- */

function renderQuiz() {

  if (quizIndex >= quizQuestions.length) {

    const data = getData();

    data.attempts++;
    data.best = Math.max(data.best, quizScore);

    saveData(data);
    updateStats();

    $("quizProgress").textContent = "Quiz complete!";
    $("quizScore").textContent = `Score: ${quizScore}/10`;

    $("quizContent").innerHTML = `
      <div class="question">
        You scored ${quizScore}/10 🎉
      </div>

      <p class="result-help">
        Try again to improve your score.
        Your best score is saved on this device.
      </p>
    `;

    $("nextBtn").disabled = true;

    return;
  }

  const questionData = quizQuestions[quizIndex];

  const question = questionData[0];
  const answer = questionData[1];
  const options = questionData[2];

  $("quizProgress").textContent =
    `Question ${quizIndex + 1} of ${quizQuestions.length}`;

  $("quizScore").textContent =
    `Score: ${quizScore}`;

  $("nextBtn").disabled = true;

  selected = false;

  $("quizContent").innerHTML = `
    <div class="question">
      ${question}
    </div>

    <div class="options">

      ${options.map(option => `
        <button class="option" data-answer="${option}">
          ${option}
        </button>
      `).join("")}

    </div>
  `;

  document.querySelectorAll(".option").forEach(button => {

    button.addEventListener("click", () => {

      if (selected) return;

      selected = true;

      const correct =
        button.dataset.answer === answer;

      if (correct) {
        quizScore++;
      }

      document.querySelectorAll(".option").forEach(option => {

        if (option.dataset.answer === answer) {
          option.classList.add("correct");
        }

        if (
          option === button &&
          !correct
        ) {
          option.classList.add("wrong");
        }

      });

      $("quizScore").textContent =
        `Score: ${quizScore}`;

      $("nextBtn").disabled = false;

    });

  });

}

if ($("nextBtn")) {

  $("nextBtn").addEventListener("click", () => {

    if (!selected) return;

    quizIndex++;

    renderQuiz();

  });

}

if ($("restartQuiz")) {

  $("restartQuiz").addEventListener("click", () => {

    quizIndex = 0;
    quizScore = 0;

    renderQuiz();

  });

}


/* -----------------------------
   TIPS
----------------------------- */

const tips = [
  "Keep recyclable materials clean and dry where your local system accepts them.",
  "When unsure about an item, check your local waste collection instructions instead of guessing.",
  "Put a simple picture or label near each household bin to make sorting quicker.",
  "Teach everyone at home the same basic waste categories.",
  "Start with a few common items and build the habit gradually."
];

if ($("newTip")) {

  $("newTip").addEventListener("click", () => {

    $("dailyTip").textContent =
      tips[Math.floor(Math.random() * tips.length)];

  });

}


/* -----------------------------
   RESET PROGRESS
----------------------------- */

if ($("resetData")) {

  $("resetData").addEventListener("click", () => {

    localStorage.removeItem("wastewiseData");

    updateStats();

    toast("Your local prototype progress was reset.");

  });

}


/* -----------------------------
   START WEBSITE
----------------------------- */

updateStats();
renderQuiz();
