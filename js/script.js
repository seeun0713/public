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

  /* 사이드바에 들어갈 항목.
     title 은 큰 글씨(분류), links 는 그 아래 작은 글씨(페이지)입니다.
     same 에는 "이 페이지도 같은 항목으로 친다"는 상세 페이지 주소를 적습니다.
     "유명 한국 괴물"은 아직 페이지가 없어서 제목만 있습니다. */
  var sections = [
    {
      title: "악의 없는 귀신",
      links: [
        { label: "귀신 도감", href: "human-encyclopedia.html", same: ["human-encyclopedia-detail.html"] },
        { label: "귀신 대응 규칙", href: "human-rules.html" },
        { label: "귀신 유형 테스트", href: "human-test.html", same: ["human-test-result.html"] },
      ],
    },
    {
      title: "착한 귀신",
      links: [
        { label: "착한 귀신상", href: "ghost-archive.html", same: ["ghost-archive-dongjasam.html"] },
        { label: "공존에 관한 조례", href: "ghost-rules.html" },
        { label: "인간 유사도 시험", href: "ghost-exam.html", same: ["ghost-exam-result.html"] },
      ],
    },
    { title: "유명 한국 괴물", links: [] },
  ];

  // 지금 보고 있는 페이지 파일 이름 (예: "human-encyclopedia.html")
  var here = location.pathname.split("/").pop() || "index.html";

  /* --- 사이드바 만들기 --- */
  var wrap = document.createElement("div");
  wrap.className = "side-nav";
  wrap.hidden = true;

  var dim = document.createElement("div"); // 뒤쪽을 살짝 어둡게 덮는 막
  dim.className = "side-nav-dim";
  wrap.appendChild(dim);

  var panel = document.createElement("nav"); // 오른쪽 검정 패널
  panel.className = "side-nav-panel";
  panel.setAttribute("aria-label", "사이트 메뉴");

  var inner = document.createElement("div");
  inner.className = "side-nav-inner";
  panel.appendChild(inner);

  sections.forEach(function (section, i) {
    if (i > 0) inner.appendChild(document.createElement("hr")); // 항목 사이 구분선

    var box = document.createElement("div");
    box.className = "side-nav-group";

    var title = document.createElement("h2");
    title.textContent = section.title;
    box.appendChild(title);

    if (section.links.length > 0) {
      var list = document.createElement("ul");
      section.links.forEach(function (item) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.label;

        // 지금 보고 있는 페이지면 흰색으로 강조하고, 그 분류 제목도 함께 흰색으로
        var isHere = item.href === here || (item.same || []).indexOf(here) !== -1;
        if (isHere) {
          a.classList.add("current");
          a.setAttribute("aria-current", "page");
          title.classList.add("current");
        }

        li.appendChild(a);
        list.appendChild(li);
      });
      box.appendChild(list);
    }

    inner.appendChild(box);
  });

  wrap.appendChild(panel);
  document.body.appendChild(wrap);

  /* --- 열고 닫기 --- */
  function openMenu(fromButton) {
    // 패널은 머리말(헤더) 바로 아래에서 시작합니다. 페이지마다 헤더 높이가
    // 달라서, 누른 버튼이 속한 <header>의 아래쪽 위치를 그때그때 재서 씁니다.
    var header = fromButton && fromButton.closest("header");
    var top = header ? Math.max(header.getBoundingClientRect().bottom, 0) : 0;
    wrap.style.setProperty("--side-nav-top", top + "px");

    wrap.hidden = false;
    toggles.forEach(function (btn) { btn.setAttribute("aria-expanded", "true"); });
  }
  function closeMenu() {
    wrap.hidden = true;
    toggles.forEach(function (btn) { btn.setAttribute("aria-expanded", "false"); });
  }

  toggles.forEach(function (btn) {
    btn.setAttribute("aria-expanded", "false");
    // ☰ 를 다시 누르면 닫히도록 (열림/닫힘 토글)
    btn.addEventListener("click", function () {
      if (wrap.hidden) openMenu(btn); else closeMenu();
    });
  });

  dim.addEventListener("click", closeMenu); // 어두운 곳을 누르면 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();    // Esc 키로도 닫기
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
   7. 귀신 도감 상세 페이지 (human-encyclopedia-detail.html)

   GHOSTS 에 귀신별 내용을 적어 두고, 주소의 ?ghost=... 값에
   맞는 것을 골라 화면을 채웁니다.

   ★ 새 귀신을 추가하려면 GHOSTS 에 한 덩어리만 더 적으면 됩니다.
     rows   : 정보표 줄. color 는 white / blue / yellow 중 하나.
     level  : 공존 난이도 (별 5개 중 몇 개)
     stats  : 능력치. [힘, 서사성, 개성, 지능, 친화력] 순서로 0~1 사이 값.
     texts  : 아래쪽 설명 상자. color 는 white / yellow.
   =========================================================== */
var GHOSTS = {
  singiwonyo: {
    name: "신기원요",
    image: "images/dogam2-hover-singiwonyo.png",
    // 동영상 파일을 images/ 에 넣으면 그림 대신 이 영상이 재생됩니다.
    // (파일이 없으면 위 image 가 그대로 보입니다.)
    video: "images/singiwonyo.mp4",
    rows: [
      { label: "이름", value: "신기원요", color: "white" },
      { label: "생전", value: "관아에 소속되어 사신들을 대접하던 관기(기생)였다.", color: "blue" },
      { label: "죽음", value: "한밤중 화장실에 가던 중 아전에게 성폭력을 당할 위기에 처했고, 이에 저항하다 살해되었다. 이후 시신은 토막 나 땅에 묻혔다.", color: "white" },
      { label: "한", value: "억울하게 죽임을 당한 것과 자신의 죽음을 아무도 밝혀주지 못한 억울함이 한으로 남아 이승을 떠나지 못했다.", color: "yellow" },
    ],
    level: 4,
    stats: [1, 1, 1, 1, 1],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "신기원요가 전하는 이야기를 외면하지 않고 죽음의 진실을 밝혀주는 것이 가장 중요하다.",
          "그의 한이 어디에서 비롯되었는지 이해하고 억울함을 풀어주는 것이 공존의 시작이다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "신기원요는 자신의 죽음에 대한 억울함을 품고 있는 존재이므로, 그의 사연을 가볍게 여기거나 함부로 자극하지 않는다.",
          "귀신 자체를 두려워하기보다 그가 전하려는 이야기에 귀 기울이는 것이 중요하다.",
        ],
      },
    ],
  },

  susalgwi: {
    name: "수살귀",
    image: "images/dogam2-hover-susalgwi.png",
    rows: [
      { label: "이름", value: "수살귀", color: "white" },
      { label: "지역", value: "불특정", color: "blue" },
      { label: "죽음", value: "익사", color: "white" },
      { label: "목적", value: "자신을 대체할 희생양 찾기, 외로움에 친구 찾기", color: "yellow" },
    ],
    level: 5,
    stats: [1, 1, 1, 1, 1],
    texts: [
      {
        title: "특성 및 스토리",
        color: "white",
        lines: [
          "몸에서 물 떨어짐, 긴머리, 물비린내, 한기. 활동범위-물을 벗어날 수 없음. 비나 홍수로 인해 활동범위가 늘어날 수 있음.",
          "익사시키는 방법은 크게 3가지로 회오리를 일으키거나 발을 잡아 물 안에 가두는 방법, 햇빛으로 수면을 반짝여 유혹하는 방법, 흐리거나 비오는 날 울음소리를 이용해 홀리는 방법이 있다.",
        ],
      },
    ],
  },

  /* 아래 여섯 마리는 아직 설명 글을 받지 못했습니다.
     이름/그림만 있고, 글이 들어오면 위와 같은 모양으로 채우면 됩니다. */
  geolsin:   { name: "걸신",     image: "images/dogam2-hover-geolsin.png" },
  jigwi:     { name: "지귀",     image: "images/dogam2-hover-jigwi.png" },
  baekgwi:   { name: "백귀",     image: "images/dogam2-hover-baekgwi.png" },
  arang:     { name: "아랑",     image: "images/dogam2-hover-arang.png" },
  maehwa:    { name: "매화귀신", image: "images/dogam2-hover-maehwa.png" },
  cheonggun: { name: "청군여귀", image: "images/dogam2-hover-cheonggun.png" },
};

function setupGhostDetail() {
  var infoBox = document.getElementById("gd-info");
  if (!infoBox) return; // 상세 페이지가 아니면 중단

  // 주소에서 ?ghost=... 값을 꺼냅니다. 없으면 수살귀를 보여줍니다.
  var key = new URLSearchParams(location.search).get("ghost") || "susalgwi";
  var ghost = GHOSTS[key] || GHOSTS.susalgwi;

  // 제목
  document.title = ghost.name + " — 귀신 도감";
  document.getElementById("gd-title").textContent = ghost.name;

  // 왼쪽 큰 그림 — 동영상(video)이 있으면 동영상, 없으면 그림(image)
  var img = document.getElementById("gd-image");
  var video = document.getElementById("gd-video");
  img.src = ghost.image;
  img.alt = ghost.name + " 일러스트";

  if (ghost.video) {
    video.src = ghost.video;
    video.poster = ghost.image;   // 동영상이 뜨기 전/못 찾을 때 보여줄 그림
    video.setAttribute("aria-label", ghost.name + " 영상");
    video.hidden = false;
    img.hidden = true;

    // 움직임을 줄이도록 설정한 사용자에게는 자동재생하지 않고 그림만 보여줍니다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.autoplay = false;
      video.removeAttribute("autoplay");
      video.pause();
    }
  }

  // --- 정보표 만들기 ---
  (ghost.rows || []).forEach(function (row) {
    var line = document.createElement("div");
    line.className = "gd-row " + row.color;

    var k = document.createElement("span");
    k.className = "k";
    k.textContent = row.label;

    var v = document.createElement("span");
    v.className = "v";
    v.textContent = row.value;

    line.appendChild(k);
    line.appendChild(v);
    infoBox.appendChild(line);
  });

  // 공존 난이도 (빨간 줄 + 별)
  if (ghost.level) {
    var levelRow = document.createElement("div");
    levelRow.className = "gd-row red";
    var lk = document.createElement("span");
    lk.className = "k";
    lk.textContent = "공존 난이도";
    var lv = document.createElement("span");
    lv.className = "stars";
    // 채운 별 + 빈 별 (예: ★★★★☆)
    lv.textContent = "★".repeat(ghost.level) + "☆".repeat(5 - ghost.level);
    levelRow.appendChild(lk);
    levelRow.appendChild(lv);
    infoBox.appendChild(levelRow);
  }

  // 능력치 상자
  if (ghost.stats) {
    var stats = document.createElement("div");
    stats.className = "gd-stats";

    // 배경 문양 4줄 × 7개
    var pattern = document.createElement("div");
    pattern.className = "gd-pattern";
    for (var i = 0; i < 28; i++) pattern.appendChild(document.createElement("i"));
    stats.appendChild(pattern);

    var label = document.createElement("p");
    label.className = "gd-stats-label";
    label.textContent = "능력치";
    stats.appendChild(label);

    stats.appendChild(makeRadar(ghost.stats));
    infoBox.appendChild(stats);
  }

  // 아직 글을 받지 못한 귀신이면, 빈 검정 화면 대신 안내를 보여줍니다
  if (!ghost.rows) {
    var empty = document.createElement("div");
    empty.className = "gd-empty";
    empty.textContent = ghost.name + "의 기록은 아직 정리 중입니다.";
    infoBox.appendChild(empty);
  }

  // --- 아래쪽 설명 상자 ---
  var sectionBox = document.getElementById("gd-sections");
  (ghost.texts || []).forEach(function (text) {
    var section = document.createElement("section");
    section.className = "gd-section " + text.color;

    var h2 = document.createElement("h2");
    h2.textContent = text.title;
    section.appendChild(h2);

    var body = document.createElement("div");
    body.className = "body";
    text.lines.forEach(function (line) {
      var p = document.createElement("p");
      p.textContent = line;
      body.appendChild(p);
    });
    section.appendChild(body);

    sectionBox.appendChild(section);
  });
}

/* ===========================================================
   8. 유명한 한국 귀신 상세 페이지 (famous-encyclopedia-detail.html)

   ★ 새 귀신을 추가하려면 FAMOUS 에 한 덩어리만 더 적으면 됩니다.
     rows  : 정보 줄. wide: true 면 이름표 폭을 넓게 씁니다.
     level : 위험도 (별 5개 중 몇 개)
     texts : 왼쪽 아래 설명 글
     bars  : 오른쪽 아래 막대 그래프. 0~100 사이 값.
   =========================================================== */
var FAMOUS = {
  gumiho: {
    name: "구미호",
    image: "images/famous-gumiho.png",
    rows: [
      { label: "이름", value: "구미호" },
      { label: "종류", value: "요괴" },
      { label: "지역", value: "산 · 숲 주변" },
      { label: "능력", value: "둔갑 / 매혹 / 장수 / 여우구슬" },
      { label: "생김새", wide: true, value: "아홉 개의 꼬리를 가진 여우의 모습으로 알려져 있다. 사람의 모습으로 둔갑할 수 있으며, 특히 아름다운 여성으로 변신하는 이야기가 널리 전해진다." },
      { label: "특징", wide: true, value: "오랜 세월을 살아온 여우가 신령한 힘을 얻어 인간의 모습으로 변신한 존재로 전해진다. 인간의 모습을 자유롭게 오가는 능력과 뛰어난 지혜를 가진 것이 특징이다." },
    ],
    level: 5,
    texts: [
      {
        title: "인간과의 관계",
        body: "전통 설화에서는 인간을 속이거나 해치는 요괴로 등장하는 경우가 많지만, 모든 이야기에서 동일하게 악한 존재로 그려지는 것은 아니다. 현대의 이야기에서는 인간과 사랑하고 가족을 이루거나 인간 사회에서 살아가는 존재로 재해석되기도 한다.",
      },
      {
        title: "대표적인 이야기",
        body: "구미호는 인간이 되기 위해 오랜 시간 수행하거나 인간과 관계를 맺는 존재로 여러 이야기에서 등장한다. 특히 인간으로 변신한 구미호가 사람과 사랑에 빠지거나 인간이 되고자 하는 욕망을 품는 이야기는 현대적으로도 반복해서 재해석되고 있다.",
      },
    ],
    bars: [
      { label: "한", value: 43 },
      { label: "공포", value: 66 },
      { label: "힘", value: 93 },
      { label: "출몰", value: 36 },
      { label: "개성", value: 85 },
    ],
  },
};

function setupFamousDetail() {
  var infoBox = document.getElementById("fg-info");
  if (!infoBox) return; // 이 페이지가 아니면 중단

  var key = new URLSearchParams(location.search).get("ghost") || "gumiho";
  var ghost = FAMOUS[key] || FAMOUS.gumiho;

  document.title = ghost.name + " — 유명한 한국 귀신";
  document.getElementById("fg-title").textContent = ghost.name;

  var img = document.getElementById("fg-image");
  img.src = ghost.image;
  img.alt = ghost.name + " 일러스트";

  // 정보 줄
  ghost.rows.forEach(function (row) {
    var line = document.createElement("div");
    line.className = "fg-row" + (row.wide ? " wide" : "");

    var k = document.createElement("span");
    k.className = "k";
    k.textContent = row.label;

    var v = document.createElement("span");
    v.className = "v";
    v.textContent = row.value;

    line.appendChild(k);
    line.appendChild(v);
    infoBox.appendChild(line);
  });

  // 위험도 (별)
  if (ghost.level) {
    var levelRow = document.createElement("div");
    levelRow.className = "fg-row wide";
    var lk = document.createElement("span");
    lk.className = "k";
    lk.textContent = "위험도";
    var lv = document.createElement("span");
    lv.className = "stars";
    lv.textContent = "★".repeat(ghost.level) + "☆".repeat(5 - ghost.level);
    levelRow.appendChild(lk);
    levelRow.appendChild(lv);
    infoBox.appendChild(levelRow);
  }

  // 왼쪽 아래 설명 글
  var textBox = document.getElementById("fg-texts");
  ghost.texts.forEach(function (text) {
    var section = document.createElement("section");
    var h2 = document.createElement("h2");
    h2.textContent = text.title;
    var p = document.createElement("p");
    p.textContent = text.body;
    section.appendChild(h2);
    section.appendChild(p);
    textBox.appendChild(section);
  });

  // 오른쪽 아래 막대 그래프
  var barBox = document.getElementById("fg-bars");
  ghost.bars.forEach(function (bar) {
    var row = document.createElement("div");
    row.className = "fg-bar";

    var k = document.createElement("span");
    k.className = "k";
    k.textContent = bar.label;

    var track = document.createElement("span");
    track.className = "track";
    var fill = document.createElement("span");
    fill.className = "fill";
    fill.style.width = bar.value + "%";
    track.appendChild(fill);

    row.appendChild(k);
    row.appendChild(track);
    barBox.appendChild(row);
  });
}


/* 능치 오각형 그래프를 그립니다.
   values 는 [힘, 서사성, 개성, 지능, 친화력] 순서의 0~1 값입니다. */
function makeRadar(values) {
  // 그림판은 가로가 조금 더 넓습니다. 좌우에 축 이름("친화력", "서사성")이
  // 들어갈 자리를 비워둬야 글자가 잘리지 않기 때문입니다.
  var W = 400;
  var H = 320;
  var CX = 200;
  var CY = 165;
  var RADIUS = 130;    // 가장 바깥 오각형까지의 거리
  var NAMES = ["힘", "서사성", "개성", "지능", "친화력"];
  // 축 이름을 어느 쪽에 붙일지 (가운데 / 오른쪽으로 / 왼쪽으로)
  var ANCHORS = ["middle", "start", "middle", "middle", "end"];
  var NS = "http://www.w3.org/2000/svg";

  // 꼭짓점 좌표 구하기 (맨 위에서 시작해 시계 방향으로 5개)
  function point(index, ratio) {
    var angle = (Math.PI * 2 * index) / 5 - Math.PI / 2;
    return [
      CX + Math.cos(angle) * RADIUS * ratio,
      CY + Math.sin(angle) * RADIUS * ratio,
    ];
  }
  function polygonPoints(ratios) {
    return ratios
      .map(function (r, i) { return point(i, r).map(Math.round).join(","); })
      .join(" ");
  }

  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "gd-radar");
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);

  function add(tag, attrs, text) {
    var el = document.createElementNS(NS, tag);
    for (var name in attrs) el.setAttribute(name, attrs[name]);
    if (text) el.textContent = text;
    svg.appendChild(el);
    return el;
  }

  // 1) 실제 능력치 오각형 (흰색으로 꽉 채움)
  add("polygon", { points: polygonPoints(values), fill: "#ffffff", stroke: "#ffffff", "stroke-width": 2 });

  // 2) 그 위에 눈금이 되는 동심 오각형과 축
  [1, 0.75, 0.5, 0.25].forEach(function (r) {
    add("polygon", { points: polygonPoints([r, r, r, r, r]), fill: "none", stroke: "#c9c9c9", "stroke-width": 1 });
  });
  for (var i = 0; i < 5; i++) {
    var p = point(i, 1);
    add("line", { x1: CX, y1: CY, x2: Math.round(p[0]), y2: Math.round(p[1]), stroke: "#c9c9c9", "stroke-width": 1 });
  }
  add("circle", { cx: CX, cy: CY, r: 3, fill: "#000000" });

  // 3) 축 이름 — 오각형보다 조금 바깥(1.15배)에 놓습니다
  NAMES.forEach(function (name, i) {
    var p = point(i, 1.15);
    add(
      "text",
      {
        x: Math.round(p[0]),
        y: Math.round(p[1]) + 7,
        fill: "#ffffff",
        "font-size": 19,
        "font-family": "Pretendard Variable, Pretendard, sans-serif",
        "text-anchor": ANCHORS[i],
      },
      name
    );
  });

  return svg;
}


/* ===========================================================
   페이지가 열리면 알맞은 기능을 실행합니다.
   (각 함수는 자기 페이지가 아니면 알아서 중단됩니다.)
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  setupGhostDetail();
  startHumanTest();
  showHumanResult();
  startGhostExam();
  showGhostResult();
  setupMenu();
  setupDogamSearch();
});
