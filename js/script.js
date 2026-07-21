/* =========================================================
   script.js
   - 성격 유형 테스트 (human-test → human-test-result)
   - 인간 유사도 시험 (ghost-exam → ghost-exam-result)
   핵심 개념 3가지:
   1) 버튼 클릭 감지  : addEventListener('click', ...)
   2) 화면 글자 바꾸기 : element.textContent = '...'
   3) 점수 세기       : 변수에 +1
   ========================================================= */


/* ===========================================================
   1. 성격 유형 테스트 (human-test.html)
   질문에 답하면 유형(A/B/C) 점수가 쌓이고,
   가장 높은 유형을 결과 페이지로 넘깁니다.
   =========================================================== */

// 보기 4개의 색(=유형) 순서는 모든 문항에서 동일합니다.
//  0=파랑(직진형) 1=흰색(감성형) 2=노랑(자유형) 3=빨강(분석형)
var typeKeys = ["blue", "white", "yellow", "red"];

// 10문항. answers는 항상 [직진, 감성, 자유, 분석] 순서.
var humanQuestions = [
  {
    q: "소중한 사람이 갑자기 연락을 끊었다. 나는?",
    answers: [
      "계속 연락을 시도한다. 이유를 알아야만 한다.",
      "언젠가 돌아오길 기다린다. 그 사람을 잊을 수가 없다.",
      "새로운 인연을 찾아 떠난다. 머물러 있지 않는다.",
      "이유를 분석하고 내가 할 수 있는 일을 한다.",
    ],
  },
  {
    q: "주말에 갑자기 시간이 비었다. 나는?",
    answers: [
      "바로 약속을 잡고 나간다.",
      "추억의 장소를 다시 찾는다.",
      "즉흥적으로 어디든 떠난다.",
      "밀린 일을 정리하고 계획을 세운다.",
    ],
  },
  {
    q: "처음 간 모임에서 나는?",
    answers: [
      "먼저 다가가 말을 건다.",
      "분위기를 살피며 천천히 마음을 연다.",
      "편한 사람하고만 어울린다.",
      "사람들을 관찰하며 파악한다.",
    ],
  },
  {
    q: "중요한 결정을 앞두고 있다. 나는?",
    answers: [
      "일단 저지르고 본다.",
      "마음이 가는 쪽을 따른다.",
      "그때그때 느낌대로 정한다.",
      "장단점을 따져 결정한다.",
    ],
  },
  {
    q: "친구가 고민을 털어놓는다. 나는?",
    answers: [
      "해결책을 바로 제시한다.",
      "같이 마음 아파하며 공감한다.",
      "기분 전환을 시켜준다.",
      "원인을 짚어 정리해준다.",
    ],
  },
  {
    q: "스트레스를 받으면 나는?",
    answers: [
      "몸을 움직여 푼다.",
      "음악을 들으며 감정을 흘려보낸다.",
      "훌쩍 어딘가로 떠난다.",
      "원인을 찾아 해결한다.",
    ],
  },
  {
    q: "여행 계획을 짤 때 나는?",
    answers: [
      "일단 표부터 끊는다.",
      "가고 싶었던 곳을 떠올린다.",
      "무계획이 곧 계획이다.",
      "동선과 일정을 꼼꼼히 짠다.",
    ],
  },
  {
    q: "갈등이 생겼을 때 나는?",
    answers: [
      "정면으로 부딪혀 푼다.",
      "서로 상처받지 않게 조심한다.",
      "거리를 두고 피한다.",
      "상황을 객관적으로 따진다.",
    ],
  },
  {
    q: "새로운 일을 시작할 때 나는?",
    answers: [
      "부딪히며 배운다.",
      "의미와 마음을 먼저 본다.",
      "흥미가 끌리는 대로 한다.",
      "정보를 모아 준비한다.",
    ],
  },
  {
    q: "하루를 마칠 때 나는?",
    answers: [
      "내일 할 일을 떠올린다.",
      "오늘의 감정을 돌아본다.",
      "별생각 없이 푹 쉰다.",
      "하루를 점검하고 기록한다.",
    ],
  },
];

// 유형별 결과 정보 (어울리는 귀신 = 유형 귀신 필터)
var humanTypes = {
  blue:   { name: "직진형", info: "생각보다 행동이 앞서는 추진력의 소유자입니다.", ghosts: ["몽달귀신", "도깨비"] },
  white:  { name: "감성형", info: "마음과 추억을 무엇보다 소중히 여기는 사람입니다.", ghosts: ["처녀귀신", "우렁각시"] },
  yellow: { name: "자유형", info: "얽매이지 않고 흐르는 대로 사는 사람입니다.", ghosts: ["그슨대", "신지께"] },
  red:    { name: "분석형", info: "차분히 따지고 파악하는 이성적인 사람입니다.", ghosts: ["구미호", "동자삼"] },
};

function startHumanTest() {
  var answersEl = document.getElementById("test-answers");
  if (!answersEl) return; // 이 페이지가 아니면 중단

  var counterEl = document.getElementById("test-counter");
  var fillEl = document.getElementById("test-progress-fill");
  var qnumEl = document.getElementById("test-qnum");
  var questionEl = document.getElementById("test-question");
  var prevBtn = document.getElementById("test-prev");

  var total = humanQuestions.length;
  var current = 0;
  var chosen = []; // 각 문항에서 고른 유형 key 저장 (이전 버튼 지원)

  function showQuestion() {
    var item = humanQuestions[current];

    counterEl.textContent = (current + 1) + "/" + total;
    fillEl.style.width = ((current + 1) / total) * 100 + "%";
    qnumEl.textContent = "Q" + (current + 1) + ".";
    questionEl.textContent = item.q;
    prevBtn.disabled = current === 0;

    answersEl.innerHTML = "";
    item.answers.forEach(function (text, index) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "typetest-answer " + typeKeys[index]; // 색(유형)
      btn.textContent = text;
      btn.addEventListener("click", function () {
        chosen[current] = typeKeys[index]; // 고른 유형 저장
        if (current < total - 1) {
          current += 1;
          showQuestion();
        } else {
          finishHumanTest();
        }
      });
      answersEl.appendChild(btn);
    });
  }

  prevBtn.addEventListener("click", function () {
    if (current > 0) {
      current -= 1;
      showQuestion();
    }
  });

  function finishHumanTest() {
    // 가장 많이 고른 유형 찾기
    var counts = { blue: 0, white: 0, yellow: 0, red: 0 };
    for (var i = 0; i < chosen.length; i++) counts[chosen[i]] += 1;

    var best = "blue";
    typeKeys.forEach(function (key) {
      if (counts[key] > counts[best]) best = key;
    });

    localStorage.setItem("humanResultType", best);
    window.location.href = "human-test-result.html";
  }

  showQuestion();
}


/* ===========================================================
   2. 테스트 결과 (human-test-result.html)
   저장된 유형을 읽어 화면에 표시합니다.
   =========================================================== */
function showHumanResult() {
  var typeEl = document.getElementById("result-type");
  if (!typeEl) return; // 이 페이지가 아니면 중단

  var infoEl = document.getElementById("result-info");
  var ghostsEl = document.getElementById("result-ghosts");

  var type = localStorage.getItem("humanResultType") || "blue";
  var data = humanTypes[type];

  typeEl.textContent = data.name;
  infoEl.textContent = data.info;

  // 어울리는 귀신 카드 만들기
  ghostsEl.innerHTML = "";
  data.ghosts.forEach(function (name) {
    var card = document.createElement("article");
    card.className = "card";
    card.innerHTML =
      '<div class="card-image">이미지</div>' +
      '<h2 class="card-title">' + name + "</h2>";
    ghostsEl.appendChild(card);
  });
}


/* ===========================================================
   3. 인간 유사도 시험 (ghost-exam.html)
   "인간다운" 답을 고를수록 유사도 점수가 올라갑니다.
   =========================================================== */
// 10문항. 각 보기의 score(0~10)가 높을수록 "인간에 가깝다".
var ghostQuestions = [
  {
    q: "소중한 사람이 갑자기 연락을 끊었다. 나는?",
    answers: [
      { text: "계속 연락을 시도한다. 이유를 알아야만 한다.", score: 8 },
      { text: "언젠가 돌아오길 기다린다. 그 사람을 잊을 수가 없다.", score: 10 },
      { text: "새로운 인연을 찾아 떠난다. 머물러 있지 않는다.", score: 5 },
      { text: "이유를 분석하고 내가 할 수 있는 일을 한다.", score: 7 },
    ],
  },
  {
    q: "길에서 우는 아이를 봤다. 나는?",
    answers: [
      { text: "다가가 달래준다.", score: 10 },
      { text: "부모를 찾아준다.", score: 9 },
      { text: "왜 우는지 가만히 관찰한다.", score: 6 },
      { text: "그냥 지나친다.", score: 3 },
    ],
  },
  {
    q: "거울을 봤을 때 가장 먼저 드는 생각은?",
    answers: [
      { text: "오늘 표정이 좋아 보이네.", score: 9 },
      { text: "머리가 떴네, 정리하자.", score: 8 },
      { text: "별생각 없다.", score: 5 },
      { text: "거울 속에 내가 없다.", score: 0 },
    ],
  },
  {
    q: "친구가 선물을 줬다. 나는?",
    answers: [
      { text: "진심으로 고마워하며 답례를 생각한다.", score: 10 },
      { text: "어색하지만 고맙다고 한다.", score: 7 },
      { text: "왜 줬는지 의심한다.", score: 4 },
      { text: "받고 곧 잊어버린다.", score: 3 },
    ],
  },
  {
    q: "무서운 영화를 볼 때 나는?",
    answers: [
      { text: "같이 놀라고 소리친다.", score: 10 },
      { text: "손으로 눈을 가린다.", score: 8 },
      { text: "별로 안 무섭다.", score: 4 },
      { text: "귀신 입장이 이해된다.", score: 1 },
    ],
  },
  {
    q: "아침에 해가 뜨면?",
    answers: [
      { text: "상쾌하게 하루를 시작한다.", score: 10 },
      { text: "더 자고 싶다.", score: 7 },
      { text: "커튼을 친다.", score: 4 },
      { text: "햇빛이 따갑다, 그늘로 숨는다.", score: 1 },
    ],
  },
  {
    q: "누군가 내 이름을 부르면?",
    answers: [
      { text: "바로 돌아본다.", score: 10 },
      { text: "누구지? 하고 확인한다.", score: 8 },
      { text: "모른 척한다.", score: 4 },
      { text: "이름이 잘 기억나지 않는다.", score: 1 },
    ],
  },
  {
    q: "배고플 때 먹고 싶은 것은?",
    answers: [
      { text: "따뜻한 집밥.", score: 10 },
      { text: "매운 떡볶이.", score: 9 },
      { text: "아무거나.", score: 5 },
      { text: "향(香)이나 정성.", score: 0 },
    ],
  },
  {
    q: "비 오는 날 기분은?",
    answers: [
      { text: "차분하고 좋다.", score: 9 },
      { text: "빈대떡이 먹고 싶다.", score: 9 },
      { text: "그냥 그렇다.", score: 6 },
      { text: "활동하기 좋은 날이다.", score: 2 },
    ],
  },
  {
    q: "사람들과 함께 있을 때 나는?",
    answers: [
      { text: "대화를 즐기며 잘 어울린다.", score: 10 },
      { text: "조용히 듣는 편이다.", score: 7 },
      { text: "혼자가 편하다.", score: 4 },
      { text: "사람 곁에 있으면 기운이 빠진다.", score: 1 },
    ],
  },
];

function startGhostExam() {
  var quizBox = document.getElementById("quiz");
  if (!quizBox) return;
  if (!document.body.classList.contains("exam-page")) return; // 시험 페이지에서만

  var counterEl = document.getElementById("exam-counter");
  var fillEl = document.getElementById("exam-progress-fill");
  var qnumEl = document.getElementById("exam-qnum");
  var questionEl = document.getElementById("exam-question");
  var answersEl = document.getElementById("exam-answers");
  var prevBtn = document.getElementById("exam-prev");

  var total = ghostQuestions.length;
  var current = 0;
  var chosen = []; // 각 문항에서 고른 점수를 저장 (이전 버튼 지원)

  function showQuestion() {
    var item = ghostQuestions[current];

    // 상단 표시
    counterEl.textContent = (current + 1) + "/" + total;
    fillEl.style.width = ((current + 1) / total) * 100 + "%";
    qnumEl.textContent = "Q" + (current + 1) + ".";
    questionEl.textContent = item.q;
    prevBtn.disabled = current === 0;

    // 보기 버튼 만들기
    answersEl.innerHTML = "";
    item.answers.forEach(function (answer) {
      var btn = document.createElement("button");
      btn.className = "exam-answer";
      btn.type = "button";
      btn.textContent = answer.text;
      btn.addEventListener("click", function () {
        chosen[current] = answer.score; // 점수 저장
        if (current < total - 1) {
          current += 1;
          showQuestion();
        } else {
          finishGhostExam();
        }
      });
      answersEl.appendChild(btn);
    });
  }

  // 이전 버튼
  prevBtn.addEventListener("click", function () {
    if (current > 0) {
      current -= 1;
      showQuestion();
    }
  });

  function finishGhostExam() {
    // 모든 문항 점수 합산 → 백분율 (문항당 최대 10점)
    var sum = 0;
    for (var i = 0; i < chosen.length; i++) sum += chosen[i] || 0;
    var percent = Math.round((sum / (total * 10)) * 100);

    localStorage.setItem("ghostExamScore", percent);
    window.location.href = "ghost-exam-result.html";
  }

  showQuestion();
}


/* ===========================================================
   4. 시험 결과 (ghost-exam-result.html)
   점수에 따라 등급을 발급하고 증명서에 표시합니다.
   =========================================================== */
function showGhostResult() {
  var scoreEl = document.getElementById("result-score");
  if (!scoreEl) return;

  var gradeEl = document.getElementById("result-grade");
  var certGradeEl = document.getElementById("cert-grade");

  var percent = Number(localStorage.getItem("ghostExamScore") || 0);

  // 점수 → 등급
  var grade;
  if (percent >= 80) grade = "정식 인간";
  else if (percent >= 50) grade = "견습 인간";
  else if (percent >= 20) grade = "수상한 인간";
  else grade = "그냥 귀신";

  scoreEl.textContent = percent;
  gradeEl.textContent = grade;
  certGradeEl.textContent = grade;
}


/* ===========================================================
   5. 공통 메뉴 (☰ 햄버거)
   class="menu-toggle" 버튼을 누르면 모든 페이지로 갈 수 있는
   메뉴가 열립니다. 메뉴 HTML은 여기서 만들어 붙입니다.
   =========================================================== */
function setupMenu() {
  var toggles = document.querySelectorAll(".menu-toggle");
  if (toggles.length === 0) return; // 메뉴 버튼이 없는 페이지면 중단

  // 메뉴에 들어갈 링크 목록 (제목, 주소)
  var links = [
    { label: "🏠 홈", href: "index.html", home: true },
    { group: "인간" },
    { label: "귀신 도감", href: "human-encyclopedia.html" },
    { label: "귀신 대응 규칙", href: "human-rules.html" },
    { label: "귀신 유형 테스트", href: "human-test.html" },
    { group: "귀신" },
    { label: "착한 귀신 아카이브", href: "ghost-archive.html" },
    { label: "인간 세상 규칙 (공존에 관한 조례)", href: "ghost-rules.html" },
    { label: "인간 유사도 시험", href: "ghost-exam.html" },
  ];

  // 오버레이 + 메뉴 만들기
  var overlay = document.createElement("div");
  overlay.className = "nav-overlay";

  var menu = document.createElement("nav");
  menu.className = "nav-menu";

  var closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "nav-close";
  closeBtn.textContent = "✕";
  closeBtn.setAttribute("aria-label", "메뉴 닫기");
  menu.appendChild(closeBtn);

  links.forEach(function (item) {
    if (item.group) {
      var h = document.createElement("h3");
      h.textContent = item.group;
      menu.appendChild(h);
    } else {
      var a = document.createElement("a");
      a.href = item.href;
      a.textContent = item.label;
      if (item.home) a.className = "home";
      menu.appendChild(a);
    }
  });

  overlay.appendChild(menu);
  document.body.appendChild(overlay);

  function openMenu() { overlay.classList.add("open"); }
  function closeMenu() { overlay.classList.remove("open"); }

  // ☰ 버튼들 → 열기
  toggles.forEach(function (btn) {
    btn.addEventListener("click", openMenu);
  });
  // ✕ 또는 바깥 어두운 영역 클릭 → 닫기
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeMenu();
  });
}


/* ===========================================================
   6. 귀신 도감 검색 (human-encyclopedia.html)
   검색창에 입력하면 이름이 맞는 카드만 보여줍니다.
   =========================================================== */
function setupDogamSearch() {
  var input = document.getElementById("dogam-search-input");
  if (!input) return; // 이 페이지가 아니면 중단

  var cards = document.querySelectorAll("#dogam-grid .dogam-card");

  input.addEventListener("input", function () {
    var keyword = input.value.trim().toLowerCase();
    cards.forEach(function (card) {
      var nameEl = card.querySelector(".dogam-card-name");
      var name = nameEl ? nameEl.textContent.toLowerCase() : "";
      // 검색어가 이름에 포함되면 보이고, 아니면 숨김
      card.style.display = name.indexOf(keyword) !== -1 ? "" : "none";
    });
  });
}


/* ===========================================================
   페이지가 열리면 알맞은 기능을 실행합니다.
   (각 함수는 자기 페이지가 아니면 알아서 중단됩니다.)
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  startHumanTest();
  showHumanResult();
  startGhostExam();
  showGhostResult();
  setupMenu();
  setupDogamSearch();
});
