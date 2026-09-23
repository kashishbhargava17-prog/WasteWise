const wasteItems = [
  {
    keys: [
      "banana",
      "banana peel",
      "fruit peel",
      "vegetable peel",
      "food scrap",
      "food scraps",
      "leftover food",
      "vegetable waste",
      "fruit waste",
      "tea leaves",
      "coffee grounds"
    ],
    category: "Wet Waste",
    icon: "🍃",
    tip: "Food and biodegradable waste generally belongs with wet/organic waste. Follow your local collection rules."
  },

  {
    keys: [
      "newspaper",
      "news paper",
      "paper",
      "notebook",
      "book",
      "cardboard",
      "carton",
      "paper box",
      "magazine"
    ],
    category: "Dry / Recyclable",
    icon: "📦",
    tip: "Keep paper and cardboard clean and dry where your local system accepts them for recycling."
  },

  {
    keys: [
      "plastic bottle",
      "plastic bag",
      "plastic wrapper",
      "plastic container",
      "plastic cup",
      "plastic"
    ],
    category: "Plastic",
    icon: "🧴",
    tip: "Check local recycling instructions because accepted plastic types can vary."
  },

  {
    keys: [
      "battery",
      "batteries",
      "phone battery",
      "power bank",
      "charger",
      "earphones",
      "headphones",
      "keyboard",
      "mouse",
      "electronic",
      "e-waste",
      "ewaste"
    ],
    category: "E-waste / Special",
    icon: "🔋",
    tip: "Do not put batteries or electronic items in ordinary household bins. Use an appropriate e-waste collection point."
  },

  {
    keys: [
      "glass bottle",
      "glass jar",
      "jar"
    ],
    category: "Glass / Recyclable",
    icon: "🍾",
    tip: "Handle broken glass carefully and follow your local collection instructions."
  },

  {
    keys: [
      "diaper",
      "sanitary pad",
      "medical waste",
      "bandage"
    ],
    category: "Special / Other",
    icon: "⚠️",
    tip: "These items may require separate handling. Follow local disposal guidance."
  }
];


const quizQuestions = [

  [
    "Where would a banana peel usually go?",
    "Wet Waste",
    ["Wet Waste", "E-waste", "Paper", "Plastic"]
  ],

  [
    "What is a newspaper mainly classified as?",
    "Dry / Recyclable",
    ["Wet Waste", "Dry / Recyclable", "E-waste", "Special Waste"]
  ],

  [
    "Where should a household battery go?",
    "E-waste / Special",
    ["Wet Waste", "Paper", "E-waste / Special", "Food Waste"]
  ],

  [
    "Which item is plastic?",
    "Plastic",
    ["Banana peel", "Newspaper", "Plastic bottle", "Tea leaves"]
  ],

  [
    "What should you do when you are unsure?",
    "Check local guidance",
    ["Always guess", "Ignore it", "Check local guidance", "Mix everything"]
  ],

  [
    "What helps make segregation easier?",
    "Clear labels",
    ["Clear labels", "More confusion", "No bins", "Guessing"]
  ],

  [
    "Which is an example of wet waste?",
    "Food scraps",
    ["Food scraps", "Newspaper", "Battery", "Plastic bottle"]
  ],

  [
    "Which is an example of dry/recyclable waste?",
    "Cardboard",
    ["Cardboard", "Fruit peel", "Battery", "Leftover food"]
  ],

  [
    "Why is WasteWise useful?",
    "It helps identify categories",
    ["It creates waste", "It helps identify categories", "It replaces collection", "It burns waste"]
  ],

  [
    "What should you follow for actual disposal?",
    "Local waste rules",
    ["Random advice", "Local waste rules", "Only this website", "No rules"]
  ]

];


let quizIndex = 0;
let quizScore = 0;
let selected = false;


const $ = id => document.getElementById(id);


const getData = () => {
  return JSON.parse(
    localStorage.getItem("wastewiseData") ||
    '{"searched":0,"attempts":0,"best":0}'
  );
};


const saveData = data => {
  localStorage.setItem(
    "wastewiseData",
    JSON.stringify(data)
  );
};


function updateStats() {

  const data = getData();

  $("searchedCount").textContent = data.searched;

  $("quizAttempts").textContent = data.attempts;

  $("bestScore").textContent = `${data.best}/10`;

  $("itemCount").textContent = wasteItems.length;
}


function toast(message) {

  const t = $("toast");

  t.textContent = message;

  t.classList.add("show");

  setTimeout(() => {
    t.classList.remove("show");
  }, 2200);
}


function findWaste(raw) {

  const q = raw.trim().toLowerCase();

  if (!q) {
    return null;
  }

  for (const item of wasteItems) {

    if (
      item.keys.some(
        key => q.includes(key) || key.includes(q)
      )
    ) {
      return item;
    }

  }

  return {
    category: "Check Local Guidance",
    icon: "🔎",
    tip: "We don't have this item in the prototype yet. Add it to the list after testing, or check your local waste authority's instructions."
  };
}


function showResult(item, searched) {

  const box = $("finderResult");

  box.classList.remove("hidden");

  box.innerHTML = `
    <div class="result-row">

      <div class="result-icon">
        ${item.icon}
      </div>

      <div>

        <div class="result-category">
          ${item.category}
        </div>

        <h3>
          ${searched.replace(/</g, "&lt;")}
        </h3>

        <p class="result-help">
          ${item.tip}
        </p>

      </div>

    </div>
  `;
}


function runSearch() {

  const raw = $("searchInput").value;

  const item = findWaste(raw);

  if (!item) {

    $("finderResult").classList.add("hidden");

    $("finderResult").innerHTML = "";

    toast("Type an item first.");

    $("searchInput").focus();

    return;
  }

  const data = getData();

  data.searched++;

  saveData(data);

  updateStats();

  showResult(item, raw);
}


function focusFinder() {

  document
    .querySelector("#finder")
    .scrollIntoView({
      behavior: "smooth"
    });

  setTimeout(() => {
    $("searchInput").focus();
  }, 500);
}


/* SEARCH */

$("searchBtn").addEventListener(
  "click",
  runSearch
);


/* CLEAR BUTTON */

function clearSearch() {

  $("searchInput").value = "";

  $("finderResult").classList.add("hidden");

  $("finderResult").innerHTML = "";

  $("searchInput").focus();
}


$("clearSearch").addEventListener(
  "click",
  clearSearch
);


/* AUTOMATICALLY CLEAR OLD RESULT */

$("searchInput").addEventListener(
  "input",
  () => {

    if (!$("searchInput").value.trim()) {

      $("finderResult").classList.add("hidden");

      $("finderResult").innerHTML = "";
    }

  }
);


/* ENTER KEY */

$("searchInput").addEventListener(
  "keydown",
  event => {

    if (event.key === "Enter") {
      runSearch();
    }

  }
);


/* QUICK SEARCH BUTTONS */

document
  .querySelectorAll(".quick-items button")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        $("searchInput").value =
          button.dataset.item;

        runSearch();

      }
    );

  });


/* MOBILE MENU */

$("menuBtn").addEventListener(
  "click",
  () => {

    $("nav").classList.toggle("open");

  }
);


document
  .querySelectorAll("nav a")
  .forEach(link => {

    link.addEventListener(
      "click",
      () => {
        $("nav").classList.remove("open");
      }
    );

  });


/* QUIZ */

function renderQuiz() {

  if (quizIndex >= quizQuestions.length) {

    const data = getData();

    data.attempts++;

    data.best = Math.max(
      data.best,
      quizScore
    );

    saveData(data);

    updateStats();

    $("quizProgress").textContent =
      "Quiz complete!";

    $("quizScore").textContent =
      `Score: ${quizScore}/10`;

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


  const [
    question,
    answer,
    options
  ] = quizQuestions[quizIndex];


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

        <button
          class="option"
          data-answer="${option.replace(/"/g, "&quot;")}"
        >
          ${option}
        </button>

      `).join("")}

    </div>

  `;


  document
    .querySelectorAll(".option")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          if (selected) {
            return;
          }

          selected = true;

          const correct =
            button.dataset.answer === answer;


          if (correct) {
            quizScore++;
          }


          document
            .querySelectorAll(".option")
            .forEach(option => {

              if (
                option.dataset.answer === answer
              ) {

                option.classList.add(
                  "correct"
                );

              } else if (
                option === button &&
                !correct
              ) {

                option.classList.add(
                  "wrong"
                );

              }

            });


          $("quizScore").textContent =
            `Score: ${quizScore}`;

          $("nextBtn").disabled = false;

        }
      );

    });

}


$("nextBtn").addEventListener(
  "click",
  () => {

    if (selected) {

      quizIndex++;

      renderQuiz();

    }

  }
);


$("restartQuiz").addEventListener(
  "click",
  () => {

    quizIndex = 0;

    quizScore = 0;

    renderQuiz();

  }
);


/* TIPS */

const tips = [

  "Keep recyclable materials clean and dry where your local system accepts them.",

  "When unsure about an item, check your local waste collection instructions instead of guessing.",

  "Put a simple picture or label near each household bin to make sorting quicker.",

  "Teach everyone at home the same basic waste categories.",

  "Start with a few common items and build the habit gradually."

];


$("newTip").addEventListener(
  "click",
  () => {

    $("dailyTip").textContent =
      tips[
        Math.floor(
          Math.random() * tips.length
        )
      ];

  }
);


/* RESET PROGRESS */

$("resetData").addEventListener(
  "click",
  () => {

    localStorage.removeItem(
      "wastewiseData"
    );

    updateStats();

    toast(
      "Your local prototype progress was reset."
    );

  }
);


/* START */

updateStats();

renderQuiz();
