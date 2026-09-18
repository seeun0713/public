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
     same 에는 "이 페이지도 같은 항목으로 친다"는 상세 페이지 주소를 적습니다. */
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
        { label: "착한 귀신상", href: "ghost-archive.html", same: ["ghost-archive-detail.html"] },
        { label: "공존에 관한 조례", href: "ghost-rules.html" },
        { label: "인간 유사도 시험", href: "ghost-exam.html", same: ["ghost-exam-result.html"] },
      ],
    },
    {
      title: "유명 한국 괴물",
      links: [
        { label: "괴물 도감", href: "famous-encyclopedia.html", same: ["famous-encyclopedia-detail.html"] },
      ],
    },
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
    // 페이지 장식 중 사이드바와 겹치는 것을 CSS 에서 감출 수 있도록 표시를 남깁니다
    document.body.classList.add("side-nav-open");
    toggles.forEach(function (btn) { btn.setAttribute("aria-expanded", "true"); });
  }
  function closeMenu() {
    wrap.hidden = true;
    document.body.classList.remove("side-nav-open");
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
    video: "assets/videos/신기원요_2.mp4",
    rows: [
      { label: "이름", value: "신기원요", color: "white" },
      { label: "생전", value: "관아에 소속되어 사신들을 대접하던 관기(기생)였다.", color: "blue" },
      { label: "죽음", value: "한밤중 화장실에 가던 중 아전에게 성폭력을 당할 위기에 처했고, 이에 저항하다 살해되었다. 이후 시신은 토막 나 땅에 묻혔다.", color: "white" },
      { label: "한", value: "억울하게 죽임을 당한 것과 자신의 죽음을 아무도 밝혀주지 못한 억울함이 한으로 남아 이승을 떠나지 못했다.", color: "yellow" },
    ],
    level: 4,
    stats: [0.76, 0.53, 0.53, 0.53, 0.15],   // 시안(node 467:11678) 꼭짓점 좌표에서 계산
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
    video: "assets/videos/수살귀_모션_2.mp4",
    rows: [
      { label: "이름", value: "수살귀", color: "white" },
      { label: "생전", value: "물가 가까이에서 살던 평범한 사람이었다. 이름도 사연도 물에 씻겨 남아 있지 않다.", color: "blue" },
      { label: "죽음", value: "물에 빠져 익사했다. 죽은 뒤로도 몸에서는 물이 떨어지고, 긴 머리에서 물비린내와 한기가 가시지 않는다.", color: "white" },
      { label: "한", value: "혼자 남겨진 외로움과, 제 자리를 대신해 줄 누군가를 아직 찾지 못했다는 미련이 그를 물가에 붙들어 두었다.", color: "yellow" },
    ],
    level: 5,
    stats: [0.85, 0.5, 0.55, 0.6, 0.15],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "본래 물을 벗어날 수 없는 존재이므로, 물가에서 한 걸음 떨어져 있는 것만으로 대부분 피할 수 있다.",
          "다만 비가 오거나 홍수로 물이 불어나면 활동 범위가 함께 넓어진다. 물이 불어난 날에는 물가 자체를 멀리한다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "햇빛에 반짝이는 수면, 흐린 날 들려오는 울음소리, 발목을 붙드는 감각. 셋 중 하나라도 느껴지면 곧바로 물에서 나온다.",
          "사람을 해하려는 목적만을 가진 악귀다. 사연을 들어주거나 한을 풀어주는 방식으로 달랠 수 있는 상대가 아니다.",
        ],
      },
    ],
  },

  arang: {
    name: "아랑",
    image: "images/dogam2-hover-arang.png",
    video: "assets/videos/아랑_모션_3.mp4",
    rows: [
      { label: "이름", value: "아랑", color: "white" },
      { label: "생전", value: "조선 명종 대 밀양에 살던 여인으로, 아름답고 기품 있기로 이름이 났다. 16세기 미혼 여성이 입던 긴 저고리 한복 차림이었다.", color: "blue" },
      { label: "죽음", value: "관청 통인이 품은 흑심에 저항하다 억울하게 살해당했다. 그 죽음의 진상은 오래도록 묻힌 채였다.", color: "white" },
      { label: "한", value: "사법 체계가 끝내 밝히지 못한 자신의 죽음과 살인범의 정체를 세상에 알리지 못한 것이 한으로 남았다.", color: "yellow" },
    ],
    level: 2,
    stats: [0.35, 1, 0.7, 0.85, 0.6],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "새로 부임한 부사들처럼 등을 돌리지 말고 그의 말을 끝까지 듣는다. 아랑이 원하는 것은 복수가 아니라 증언이다.",
          "밝혀지지 않은 죽음의 진상을 함께 좇아 기록으로 남기면, 그는 더 나타날 이유가 없어져 조용히 물러난다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "가슴에 칼을 꽂은 모습에 놀라 달아나면, 그는 다음 사람 앞에 다시 같은 모습으로 서야 한다. 겉모습만 보고 악귀로 단정하지 않는다.",
          "소복 차림의 처녀귀신으로 뭉뚱그려 부르는 것을 싫어한다. 그는 16세기를 살았던 한 사람으로 기억되기를 바란다.",
        ],
      },
    ],
  },

  maehwa: {
    name: "매화귀신",
    image: "images/dogam2-hover-maehwa.png",
    video: "assets/videos/매화귀신_모션.mp4",
    rows: [
      { label: "이름", value: "매화귀신", color: "white" },
      { label: "생전", value: "백 년 넘게 한자리를 지켜 온 매화나무였다. 오랜 세월이 쌓여 영물이 되었다.", color: "blue" },
      { label: "죽음", value: "사람처럼 죽어 귀신이 된 것이 아니라, 나무인 채로 령을 얻어 백발 노인의 모습을 갖추었다. 피부는 나무껍질처럼 검고 깡말랐으며, 흰 머리와 수염이 옷의 윗부분을 모두 가릴 만큼 길다.", color: "white" },
      { label: "한", value: "만물에 령이 깃들어 있음을 잊은 세상, 그리고 사람의 무분별한 자연 파괴와 무례함에 대한 서운함이 남아 있다.", color: "yellow" },
    ],
    level: 3,
    stats: [0.8, 0.6, 0.9, 0.75, 0.45],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "먼저 예를 갖추면 그에 걸맞은 대우가 돌아온다. 오래된 나무 앞에서 옷매무새를 고치고 인사하던 옛 습관이 곧 공존의 방법이다.",
          "꽃가지를 꺾지 않고, 뿌리 주변을 함부로 파헤치지 않는다. 사군자의 매화답게 그는 지켜지는 선을 중요하게 여긴다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "성격이 매우 깐깐하고 고지식하다. 가벼운 반말이나 장난도 무례로 받아들여진다.",
          "자신을 함부로 대하거나 다치게 한 사람에게는 목숨을 거두는 저주를 내린다. 흰 매화 꽃잎이 유난히 많이 흩날린다면 이미 노한 것이다.",
        ],
      },
    ],
  },

  geolsin: {
    name: "걸신",
    image: "images/dogam2-hover-geolsin.png",
    video: "assets/videos/걸신_모션.mp4",
    rows: [
      { label: "이름", value: "걸신", color: "white" },
      { label: "생전", value: "끼니를 잇지 못하고 빌어먹으며 떠돌던 거지였다.", color: "blue" },
      { label: "죽음", value: "끝내 굶주림을 이기지 못하고 숨을 거두었다. 죽은 뒤에도 배고픔만은 그대로 남았다.", color: "white" },
      { label: "한", value: "한 번도 배불리 먹어보지 못한 것이 한이 되어, 아무에게나 씌어 그 사람의 입으로 대신 먹으려 한다.", color: "yellow" },
    ],
    level: 1,
    stats: [0.3, 0.4, 0.6, 0.35, 0.7],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "걸신이 들리면 한동안 음식을 계속 먹게 된다. 억지로 굶기려 들지 말고 먹여서 한을 풀어주는 것이 예로부터 전해지는 방법이다.",
          "조왕신이나 터줏대신처럼 끝내 복을 주지는 않지만, 굶주림을 면하게 해 준다는 점에서 하급 잡귀치고는 너그럽게 받아들여져 왔다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "가리지 않고 씌므로 누구에게 붙었는지를 탓하지 않는다. 특히 영양이 부족한 사람에게 잘 붙는다.",
          "크게 거슬리는 귀신은 아니지만 폭식이 길어지면 몸이 상한다. 먹이되 끝을 정해 주는 것이 좋다.",
        ],
      },
    ],
  },

  cheonggun: {
    name: "청군여귀",
    image: "images/dogam2-hover-cheonggun.png",
    video: "assets/videos/청군여귀_모션_2.mp4",
    rows: [
      { label: "이름", value: "청군여귀", color: "white" },
      { label: "생전", value: "생전에 대해 전하는 바가 없다. 『천예록』은 서울 묵정동의 한 흉가에서 그를 마주친 이야기만 남겼다.", color: "blue" },
      { label: "죽음", value: "어떻게 죽었는지 알려지지 않았다. 다만 제 목숨을 상징하는 물건을 몸 밖에 따로 감추어 두었다.", color: "white" },
      { label: "한", value: "사람을 곁에 두고 싶지도, 혼자이고 싶지도 않은 마음으로 흉가에 머문다. 눈물을 흘릴 때면 늙고 추한 본모습이 드러난다.", color: "yellow" },
    ],
    level: 4,
    stats: [0.7, 0.55, 0.95, 0.8, 0.25],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "사람을 좋아하지는 않지만 먼저 칼을 휘두르는 일은 많지 않다. 거문고 소리가 들리면 방해하지 말고 조용히 물러난다.",
          "몸 밖에 감추어 둔 목숨의 물건을 찾아 태우면 온몸의 구멍에서 피를 쏟으며 죽는다. 되돌릴 수 없으니 마지막 수단으로만 생각한다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "키가 사람의 절반만 해서 찬장이나 다락 안에서도 움직인다. 좁은 곳이라고 안심하지 않는다.",
          "진짜 키를 속여 훨씬 큰 모습으로 보이기도 하고 나무 위로도 잘 올라간다. 눈에 보이는 크기와 높이를 믿지 않는다.",
        ],
      },
    ],
  },

  baekgwi: {
    name: "백귀",
    image: "images/dogam2-hover-baekgwi.png",
    video: "assets/videos/백귀_모션 2_1.mp4",
    rows: [
      { label: "이름", value: "백귀", color: "white" },
      { label: "생전", value: "사람이었는지조차 분명하지 않다. 『조선왕조실록』 1468년 기록에는 세조가 신하를 놀래려 꾸며 낸 모습으로 처음 등장한다.", color: "blue" },
      { label: "죽음", value: "죽음의 내력은 전하지 않는다. 태백산 신령 백두옹, 흰옷을 입은 산도깨비 소의산매 등 여러 이름으로 갈라져 전해질 뿐이다.", color: "white" },
      { label: "한", value: "특정한 원한이라기보다, 사람들이 '가장 무서운 것'을 떠올릴 때마다 되살아나는 형상 그 자체다.", color: "yellow" },
    ],
    level: 4,
    stats: [0.75, 0.9, 0.85, 0.5, 0.1],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "마주치는 것 자체가 위험하다. 오래된 나무 위에서 흰 기운이 피어오르거든 눈을 돌리고 그 자리를 뜬다.",
          "『임하필기』는 그를 본 사람이 오래 살지 못한다고 적었고, 꿈에 백두옹을 보면 죽는다는 말도 함께 전한다. 보지 않는 것이 최선의 공존이다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "위아래 옷을 벗고 머리를 풀어 헤친 채 머리에 흰 것을 이고 몽둥이를 든 모습. 조선 사람들이 떠올린 가장 무서운 형상이다.",
          "소의산매처럼 겁 없이 마주 보면 도망친다는 이야기도 있으나, 백두옹의 저주를 받으면 고을 사또가 줄줄이 죽어 나갔다고 한다. 시험하지 않는다.",
        ],
      },
    ],
  },

  jigwi: {
    name: "지귀",
    image: "images/dogam2-hover-jigwi.png",
    video: "assets/videos/지귀_모션_1.mp4",
    rows: [
      { label: "이름", value: "지귀", color: "white" },
      { label: "생전", value: "서라벌에 살던 평범한 남자였다. 선덕여왕을 향한 연심을 품었고, 그 소문이 왕에게까지 닿았다.", color: "blue" },
      { label: "죽음", value: "영묘사에서 왕을 기다리다 잠이 들어 끝내 깨어나지 못했다. 왕은 금팔찌를 두고 떠났다.", color: "white" },
      { label: "한", value: "아쉬움과 기쁨이 한데 뒤엉킨 마음에서 불이 일었다. 몽달귀신이면서도 불귀신이 된 것은 그만큼 한이 컸기 때문일 것이다.", color: "yellow" },
    ],
    level: 5,
    stats: [0.9, 0.8, 0.75, 0.4, 0.2],
    texts: [
      {
        title: "공존 방법",
        color: "white",
        lines: [
          "신라에서는 술사에게 의뢰해 만든 주문을 집집마다 붙여 그가 다가오지 못하게 했다. 글로 경계를 긋는 것이 가장 오래된 방법이다.",
          "그의 불은 미움이 아니라 닿지 못한 마음에서 났다. 마음 자체를 부정하지 않되, 거리는 분명히 지킨다.",
        ],
      },
      {
        title: "주의 사항",
        color: "yellow",
        lines: [
          "몽달귀신으로 분류되지만 보통의 몽달귀신보다 훨씬 위험하다. 불이 옮아붙으면 되돌릴 수 없다.",
          "『대동운부군옥』과 『삼국유사』에 남은 이야기로, 실제 사건이 아니라 설화에서 비롯되었다. 이야기를 함부로 각색해 옮기지 않는다.",
        ],
      },
    ],
  },
};

function setupGhostDetail() {
  var infoBox = document.getElementById("gd-info");
  if (!infoBox) return; // 상세 페이지가 아니면 중단

  // 주소에서 ?ghost=... 값을 꺼냅니다. 없으면 수살귀를 보여줍니다.
  var key = new URLSearchParams(location.search).get("ghost") || "susalgwi";
  if (!GHOSTS[key]) key = "susalgwi";
  var ghost = GHOSTS[key];

  // --- 앞/뒤 귀신으로 넘어가기 ---
  // 도감 목록에 카드가 놓인 순서와 같게 두었습니다.
  buildPager({
    order: ["susalgwi", "geolsin", "jigwi", "singiwonyo", "baekgwi", "arang", "maehwa", "cheonggun"],
    key: key,
    page: "human-encyclopedia-detail.html",
    noun: "귀신",
    nameOf: function (k) { return GHOSTS[k].name; },
    keys: true,
  });

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

  // 노리개 매듭 — 공존 난이도(별 개수)에 따라 셋 중 하나를 답니다.
  //   별 4~5개 → 빨강 / 별 2~3개 → 노랑 / 별 0~1개 → 초록
  // 셋은 색만 다른 게 아니라 매듭 모양과 가로세로 비율이 서로 달라서,
  // 피그마 원본 크기를 같은 비율(0.4016배)로 줄인 값을 각각 넣어 줍니다.
  var knot = document.getElementById("gd-knot");
  if (knot) {
    var stars = ghost.level || 0;
    var knots = {
      red:    { file: "images/detail-knot-red.svg",    width: 180,   height: 440.7 },
      yellow: { file: "images/detail-knot-yellow.svg", width: 166.9, height: 443.6 },
      green:  { file: "images/detail-knot-green.svg",  width: 134,   height: 439.5 },
    };
    var pick = knots[stars >= 4 ? "red" : stars >= 2 ? "yellow" : "green"];

    knot.src = pick.file;
    knot.parentNode.style.width = pick.width + "px";
    knot.parentNode.style.height = pick.height + "px";
  }

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

    var radar = makeRadar(ghost.stats);
    stats.appendChild(radar.svg);
    infoBox.appendChild(stats);

    // 페이지에 들어오면 도형이 가운데에서 자라나고, 마우스를 올리면 다시 재생됩니다
    radar.play();
    stats.addEventListener("mouseenter", radar.play);
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
   8. 유명 한국 괴물 상세 페이지 (famous-encyclopedia-detail.html)

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
    art: { left: 71.1, top: -141.4, width: 583.1, height: 777.4 },
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

  cheonyeo: {
    name: "처녀귀신",
    image: "images/famous-cheonyeo.png",
    art: { left: 55.0, top: -92.5, width: 536.3, height: 715.1 },
    rows: [
      { label: "이름", value: "처녀귀신" },
      { label: "종류", value: "원귀" },
      { label: "지역", value: "우물가 · 옛집 · 마을 어귀" },
      { label: "능력", value: "현신 / 꿈에 들기 / 한의 전이" },
      { label: "생김새", wide: true, value: "길게 풀어헤친 검은 머리에 흰 소복을 입은 여인의 모습으로 전해진다. 얼굴은 머리카락에 가려 잘 드러나지 않으며, 발이 땅에 닿지 않는다고도 한다." },
      { label: "특징", wide: true, value: "살아생전 풀지 못한 한을 품고 이승에 머무는 존재다. 먼저 해를 끼치기보다 자신의 사연을 알아줄 사람을 기다리며, 한이 풀리면 조용히 떠난다." },
    ],
    level: 4,
    texts: [
      {
        title: "인간과의 관계",
        body: "무섭게 나타나지만 목적은 해를 입히는 것이 아니라 억울함을 알리는 데 있다. 이야기 속에서 처녀귀신을 만난 사람은 대개 도망치다 화를 입고, 도리어 말을 들어준 사람은 무사히 넘어간다. 두려움을 견디고 사연을 들어주는 것이 유일한 해법으로 전해진다.",
      },
      {
        title: "대표적인 이야기",
        body: "고을에 부임하는 원님마다 첫날 밤에 죽어 나가던 관아 이야기가 널리 알려져 있다. 겁을 이기고 끝까지 자리를 지킨 새 원님이 나타난 처녀귀신의 사연을 듣고 묻힌 억울함을 밝혀 주자, 그 뒤로는 아무 일도 일어나지 않았다고 한다.",
      },
    ],
    bars: [
      { label: "한", value: 97 },
      { label: "공포", value: 74 },
      { label: "힘", value: 41 },
      { label: "출몰", value: 68 },
      { label: "개성", value: 55 },
    ],
  },

  dalgyal: {
    name: "달걀귀신",
    image: "images/famous-dalgyal.png",
    art: { left: 63.1, top: -90.9, width: 524.7, height: 699.6 },
    rows: [
      { label: "이름", value: "달걀귀신" },
      { label: "종류", value: "귀신" },
      { label: "지역", value: "밤길 · 골목 · 외딴집" },
      { label: "능력", value: "얼굴 감추기 / 혼 빼놓기 / 뒤따라오기" },
      { label: "생김새", wide: true, value: "눈· 코· 입이 하나도 없이 달걀처럼 매끈한 얼굴을 하고 있다. 몸은 흰옷을 입은 평범한 사람의 모습이라, 마주 서기 전까지는 알아차리기 어렵다." },
      { label: "특징", wide: true, value: "직접 해를 끼쳤다는 이야기는 드물다. 다만 얼굴이 없다는 사실을 알아차린 순간의 공포가 워낙 커서, 놀라 달아나다 스스로 다치는 경우가 많다고 전해진다." },
    ],
    level: 3,
    texts: [
      {
        title: "인간과의 관계",
        body: "밤길에서 길을 묻거나 우는 소리를 내며 사람을 불러 세운다. 돌아본 사람이 마주하는 것은 아무것도 없는 민얼굴이다. 해치려는 뜻보다는 놀라는 모습을 보려는 장난에 가깝다는 해석도 있어, 못 본 척 지나가면 따라오지 않는다고 한다.",
      },
      {
        title: "대표적인 이야기",
        body: "밤늦게 돌아가던 사람이 길가에서 우는 여인을 달래다 얼굴을 보고 달아나는 이야기가 가장 널리 퍼져 있다. 가까스로 주막에 뛰어들어 사정을 말하자, 듣고 있던 주인이 \"그 얼굴이 이렇게 생겼습니까\" 하며 돌아보았다는 결말이 붙어 전해진다.",
      },
    ],
    bars: [
      { label: "한", value: 28 },
      { label: "공포", value: 88 },
      { label: "힘", value: 22 },
      { label: "출몰", value: 54 },
      { label: "개성", value: 94 },
    ],
  },

  eoduksini: {
    name: "어둑시니",
    image: "images/famous-eoduksini.png",
    art: { left: 52.5, top: -165.6, width: 589.4, height: 785.9 },
    rows: [
      { label: "이름", value: "어둑시니" },
      { label: "종류", value: "요괴" },
      { label: "지역", value: "어두운 골목 · 빈방 · 계단 아래" },
      { label: "능력", value: "어둠 속 증식 / 크기 변화 / 시선 감지" },
      { label: "생김새", wide: true, value: "형체가 뚜렷하지 않은 검은 덩어리다. 정해진 크기가 없어, 보는 사람이 올려다볼수록 위로 부풀고 내려다보면 다시 쪼그라든다." },
      { label: "특징", wide: true, value: "어둠 그 자체가 몸이라 불을 켜면 사라진다. 쳐다보는 시선을 먹고 자라기 때문에, 끝까지 올려다보면 결국 사람을 덮을 만큼 커진다고 전해진다." },
    ],
    level: 4,
    texts: [
      {
        title: "인간과의 관계",
        body: "먼저 다가오지 않고 어두운 자리에 가만히 있는다. 위험해지는 것은 사람이 그것을 알아보고 계속 올려다볼 때다. 반대로 시선을 내리거나 등을 돌리면 저절로 작아지므로, 무서워하지 않는 것이 곧 물리치는 방법이 된다.",
      },
      {
        title: "대표적인 이야기",
        body: "밤중에 마당 한구석의 검은 그림자를 본 사람이 겁에 질려 자꾸 고개를 들다, 그림자가 지붕을 넘을 만큼 커져 깔릴 뻔했다는 이야기가 전한다. 곁에 있던 노인이 \"내려다보라\" 이르자 그림자는 발밑까지 줄어들어 사라졌다고 한다.",
      },
    ],
    bars: [
      { label: "한", value: 18 },
      { label: "공포", value: 95 },
      { label: "힘", value: 72 },
      { label: "출몰", value: 61 },
      { label: "개성", value: 80 },
    ],
  },
};

function setupFamousDetail() {
  var infoBox = document.getElementById("fg-info");
  if (!infoBox) return; // 이 페이지가 아니면 중단

  var key = new URLSearchParams(location.search).get("ghost") || "gumiho";
  if (!FAMOUS[key]) key = "gumiho";
  var ghost = FAMOUS[key];

  // 아래쪽 '이전 / 다음' 줄 (목록에 놓인 순서대로)
  buildPager({
    order: ["gumiho", "cheonyeo", "dalgyal", "eoduksini"],
    key: key,
    page: "famous-encyclopedia-detail.html",
    noun: "괴물",
    nameOf: function (k) { return FAMOUS[k].name; },
    keys: true,
  });

  document.title = ghost.name + " — 유명 한국 괴물";
  document.getElementById("fg-title").textContent = ghost.name;

  var img = document.getElementById("fg-image");
  img.src = ghost.image;
  img.alt = ghost.name + " 일러스트";

  // 그림 확대·위치 (먹이 그려진 영역을 그림 칸 높이에 맞춘 값)
  if (ghost.art) {
    img.style.setProperty("--art-left", ghost.art.left + "px");
    img.style.setProperty("--art-top", ghost.art.top + "px");
    img.style.setProperty("--art-width", ghost.art.width + "px");
    img.style.setProperty("--art-height", ghost.art.height + "px");
  }

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


/* 능력치 오각형 그래프를 그립니다. (Figma node 467:11679 / 467:11678)
   values 는 [힘, 서사성, 개성, 지능, 친화력] 순서의 0~1 값입니다.

   흰 오각형 판 위에 눈금이 깔리고, 그 위에 파란 능력치 도형이 얹힙니다.
   { svg, play } 를 돌려주며, play() 를 부르면 도형이 가운데에서
   제 크기까지 자라나는 모션이 다시 재생됩니다. */
function makeRadar(values) {
  // 그림판은 가로가 조금 더 넓습니다. 좌우에 축 이름("친화력", "서사성")이
  // 들어갈 자리를 비워둬야 글자가 잘리지 않기 때문입니다.
  var W = 400;
  var H = 320;
  var CX = 200;
  var CY = 165;
  var RADIUS = 130;    // 흰 오각형 판(=최대치)까지의 거리
  var NAMES = ["힘", "서사성", "개성", "지능", "친화력"];
  // 축 이름을 어느 쪽에 붙일지 (가운데 / 오른쪽으로 / 왼쪽으로)
  var ANCHORS = ["middle", "start", "middle", "middle", "end"];
  // 안쪽 눈금 오각형 (시안의 222.62 / 154.63 / 99.80 / 42.77 를 288.42 로 나눈 비율)
  var RINGS = [0.772, 0.536, 0.346, 0.148];
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
      .map(function (r, i) { return point(i, r).map(function (n) { return n.toFixed(1); }).join(","); })
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

  // 1) 흰 오각형 판 (최대치 자리)
  add("polygon", { points: polygonPoints([1, 1, 1, 1, 1]), fill: "#ffffff" });

  // 2) 안쪽 눈금 오각형 (가장 바깥 흰 판만 빼고 모두 같은 회색)
  RINGS.forEach(function (r) {
    add("polygon", {
      points: polygonPoints([r, r, r, r, r]),
      fill: "none",
      stroke: "#434343",
      "stroke-width": 1,
    });
  });

  // 3) 가운데 점
  add("circle", { cx: CX, cy: CY, r: 2, fill: "#000000" });

  // 4) 파란 능력치 도형 + 꼭짓점 점 (모션으로 자라나는 부분)
  var shape = add("polygon", {
    class: "gd-radar-shape",
    points: polygonPoints([0, 0, 0, 0, 0]),
    fill: "#002bff",
    "fill-opacity": 0.4,   // 반투명이라 뒤쪽 눈금선이 비쳐 보입니다
    stroke: "#000000",
    "stroke-width": 1,
    "stroke-linejoin": "round",
  });
  var dots = values.map(function () {
    return add("circle", { cx: CX, cy: CY, r: 2, fill: "#000000" });
  });

  // 5) 축 이름 — 오각형보다 조금 바깥(1.15배)에 놓습니다
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

  /* t = 0 이면 가운데 한 점, t = 1 이면 제 크기 */
  function draw(t) {
    shape.setAttribute("points", polygonPoints(values.map(function (v) { return v * t; })));
    values.forEach(function (v, i) {
      var p = point(i, v * t);
      dots[i].setAttribute("cx", p[0].toFixed(1));
      dots[i].setAttribute("cy", p[1].toFixed(1));
    });
  }

  var running = false;
  function play() {
    // 움직임을 줄이도록 설정한 사용자에게는 완성된 모습만 보여줍니다
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(1);
      return;
    }
    if (running) return;   // 재생 중에 또 부르면 무시
    running = true;

    var DURATION = 700;
    var startTime = null;
    function step(now) {
      if (!running) return;           // 안전장치가 이미 끝냈으면 중단
      if (startTime === null) startTime = now;
      var t = Math.min((now - startTime) / DURATION, 1);
      draw(1 - Math.pow(1 - t, 3));   // 끝으로 갈수록 천천히
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        running = false;
      }
    }
    requestAnimationFrame(step);

    // 안전장치: 어떤 이유로든 프레임이 안 돌면(배경 탭 등) 완성된 모습으로 맞춥니다.
    setTimeout(function () {
      if (running) { draw(1); running = false; }
    }, DURATION + 150);
  }

  draw(0);
  return { svg: svg, play: play };
}


/* ===========================================================
   8-0. 상세 페이지 아래의 '이전 / 다음' 줄

   귀신 도감 · 착한 귀신상 · 유명 한국 괴물 세 상세 페이지가
   똑같은 모양과 동작을 함께 씁니다.
     order  : 목록 페이지에 놓인 순서 (맨 끝에서는 반대쪽 끝으로 돌아갑니다)
     page   : 넘어갈 페이지 주소
     noun   : 읽어 주는 이름에 쓸 말 ("귀신" / "괴물")
     nameOf : 키로 표시할 이름을 찾는 함수
     keys   : 키보드 ← → 로도 넘길지
   =========================================================== */
function buildPager(opts) {
  var prevEl = document.getElementById("gd-prev");
  var nextEl = document.getElementById("gd-next");
  if (!prevEl || !nextEl) return; // 이 줄이 없는 페이지면 중단

  var order = opts.order;
  var here = order.indexOf(opts.key);
  if (here < 0) here = 0;
  // 맨 끝에서 누르면 반대쪽 끝으로 돌아갑니다 (% 는 나머지 연산)
  var prevKey = order[(here - 1 + order.length) % order.length];
  var nextKey = order[(here + 1) % order.length];

  function linkTo(el, nameEl, target, label) {
    el.href = opts.page + "?ghost=" + target;
    el.setAttribute("aria-label", label + " " + opts.noun + ": " + opts.nameOf(target));
    if (nameEl) nameEl.textContent = opts.nameOf(target);
  }
  linkTo(prevEl, document.getElementById("gd-prev-name"), prevKey, "이전");
  linkTo(nextEl, document.getElementById("gd-next-name"), nextKey, "다음");

  // 키보드 ← → 로도 넘어갑니다
  if (opts.keys) {
    document.addEventListener("keydown", function (e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowLeft") location.href = prevEl.href;
      if (e.key === "ArrowRight") location.href = nextEl.href;
    });
  }
}


/* ===========================================================
   8-1. 귀신 도감 목록 카드의 글리치 (human-encyclopedia.html)

   호버 그림과 똑같은 그림 두 장을 더 깔아 둡니다.
   CSS 가 한 장은 청록, 한 장은 빨강으로 물들여 가로 띠 단위로
   좌우로 어긋나게 움직입니다 (색이 갈라지는 RGB 분리 효과).

   그림 주소와 잘라내기 위치(left/top)가 카드마다 달라서
   CSS 만으로는 복제할 수 없어 여기서 복제합니다.
   원본을 그대로 복제하므로 새로 내려받는 파일은 없습니다.
   =========================================================== */
function setupGlitch() {
  var cards = document.querySelectorAll(".dogam-card.reveal");
  if (cards.length === 0) return; // 이 페이지가 아니면 중단

  cards.forEach(function (card) {
    var hoverImg = card.querySelector(".dogam-photo-img.on-hover");
    if (!hoverImg) return;

    ["a", "b"].forEach(function (which) {
      var layer = hoverImg.cloneNode(false);   // left/top 이 담긴 style 까지 함께 복사됩니다
      layer.className = "dogam-photo-img on-hover glitch " + which;
      layer.setAttribute("aria-hidden", "true");
      layer.alt = "";
      hoverImg.parentNode.insertBefore(layer, hoverImg.nextSibling);
    });
  });
}


/* ===========================================================
   8-2. 착한 귀신상 상세 페이지 (ghost-archive-detail.html)

   ★ 새 귀신을 추가하려면 ARCHIVE 에 한 덩어리만 더 적으면 됩니다.
     art   : 그림을 얼마나 키워서 어디를 보여줄지 (그림창 319×609 기준 %)
     tag   : 기사 맨 위의 수상 사유 한 줄
     pages : 신문 기사 1면·2면. indent 는 왼쪽 화살표 자리를 비우는 들여쓰기.
     modal : '자세히 보기' 팝업 내용
   =========================================================== */
var ARCHIVE = {
  dongjasam: {
    name: "동자삼",
    image: "images/dj-illust.png",
    art: "left: -4.99%; top: -4.82%; width: 212.48%; height: 139.06%;",
    tag: "[돋보이는 자기 희생 정신]",
    pages: [
      {
        headline: "“사라진 아들, 기적처럼 귀환… 정체는 ‘산삼 요괴’ 의혹”",
        subhead: "강원도 산간 마을에서 기이한 사건 발생",
        paras: [
          "최근 한 산간 마을에서 죽은 줄 알았던 아이가 멀쩡한 모습으로 돌아오는 기이한 사건이 발생했다.",
          "해당 가정은 병든 노모를 살리기 위해 한 승려의 말에 따라 아들을 삶는 극단적 선택을 한 것으로 알려졌다. 그러나 장례를 치르기도 전, 아이는 아무 일도 없었던 듯 귀가했다.",
          "마을 주민들 사이에서는 “그 아이는 진짜가 아니었다”는 소문이 퍼지고 있다. 특히 일부 노인들은 “천 년 묵은 산삼이 아이로 변해 시험을 내린 것”이라며 이른바 ‘동자삼’ 설화를 언급하고 있다.",
          "전문가들은 이를 민간 신앙과 전설이 결합된 사례로 보고 있으나, 일부는 실제로 설명되지 않는 치유 효과가 있었다는 점에서 추가 조사가 필요하다는 입장이다.",
        ],
      },
      {
        headline: "“밤마다 불 끄던 의문의 남성… 동굴 속 ‘거대 산삼’ 발견 후 재산 급증”",
        subhead: "한 농가 며느리의 집요한 추적 끝에 밝혀진 정체",
        indent: true,
        paras: [
          "충청 지역 한 농가에서 정체불명의 남성을 추적한 끝에 거대 산삼을 발견했다는 주장이 제기돼 관심이 모이고 있다.",
          "해당 사건은 며느리 A씨가 밤마다 반복되는 이상 현상을 의심하면서 시작됐다. A씨에 따르면, 집안의 불이 매일 밤 원인 없이 꺼졌고 그때마다 한 남성이 근처를 서성이는 모습이 목격됐다.이상함을 느낀 A씨는 남성의 옷자락에 몰래 실을 묶어 이동 경로를 추적했다.실은 산속 깊은 동굴까지 이어졌고, 그 끝에서 발견된 것은—사람 크기를 훨씬 웃도는 대형 산삼이었다. A씨는 이를 채취해 집으로 가져왔고, 이후 해당 가정은 급격한 경제적 변화를 겪은 것으로 전해졌다.",
          "마을 주민들은 “그 남자는 사람이 아니라 산삼이 변한 존재였을 것”이라며 이른바 ‘동자삼’ 설화를 언급하고 있다. 일부 주민은 “불을 끈 행위 자체가 인간을 시험하기 위한 것이었을 것”이라는 해석도 내놓고 있다.",
          "전문가들은 이번 사례가 전통 설화와 민간 신앙이 반영된 이야기일 가능성이 높다고 보면서도, 실제 재산 증가와의 연관성에 대해서는 “설명하기 어려운 부분이 있다”고 밝혔다.",
        ],
      },
    ],
    modal: [
      {
        title: "정체",
        items: [
          "어린아이 크기의 산삼이 오랜 세월을 살아 영물화된 존재",
          "주로 천 년 이상 생존하거나, 산신령의 주술로 각성",
        ],
      },
      {
        title: "변신 능력",
        items: [
          "인간으로 변신 가능 (주로 남자 아이 형태, 드물게 성인 남성)",
          "여성으로 변신하는 사례는 보고되지 않음.",
          "일반적으로 낮엔 인간, 밤엔 산삼으로 존재하며 단, 반대로 변하는 개체도 존재",
        ],
      },
      {
        title: "행동 및 성향",
        items: [
          "인간 친화적이며 호기심이 많음.",
          "술, 팥죽 등 인간 음식 선호",
          "인간 세계를 체험하는 것을 즐김.",
          "일부 개체는 특정 목적 없이 자유롭게 인간 생활을 즐김.",
        ],
      },
      {
        title: "선별 기준",
        items: [
          "효성이 깊은 자, 지혜로운 자에게 접근하며 이후 희생, 판단력, 문제 해결 능력 등의 시험을 부여하고, 시험 통과 시: 재물, 건강, 생명 등의 복을 내림",
        ],
      },
    ],
  },

  changbu: {
    name: "창부대신",
    image: "images/arc-changbu.png",
    art: "left: -26.33%; top: 0%; width: 152.66%; height: 100%;",
    tag: "[탁월한 액운 차단 능력]",
    pages: [
      {
        headline: "“굿판마다 나타난 흰옷의 악사… 그해 마을 흉년 사라져”",
        subhead: "전남 일대에서 반복 목격, 주민들 “창부대신” 지목",
        paras: [
          "전남 일대 여러 마을에서 굿판이 벌어질 때마다 초대받지 않은 악사가 나타난다는 목격담이 잇따르고 있다.",
          "주민들에 따르면 이 악사는 흰 도포에 갓을 쓰고 구슬 장식을 늘어뜨린 차림으로, 마당 한쪽에서 조용히 피리를 불다 굿이 끝나면 인사 없이 사라진다. 얼굴을 또렷이 기억하는 사람은 아무도 없었다.",
          "특이한 점은 그가 다녀간 마을마다 그해 흉년과 역병이 비켜 갔다는 것이다. 한 마을 이장은 “그 소리가 들리는 동안은 아무도 아프지 않았다”고 말했다.",
          "민속학계는 이를 광대와 악사의 수호신으로 알려진 ‘창부대신’ 신앙이 구전 속에 남은 형태로 보고 있다. 다만 여러 마을에서 같은 날 목격됐다는 증언에 대해서는 설명을 내놓지 못하고 있다.",
        ],
      },
      {
        headline: "“광대 없는 빈 마당에서 들려온 피리 소리… 돌던 역병 멎어”",
        subhead: "의원들 “원인을 설명하기 어렵다”",
        indent: true,
        paras: [
          "역병이 번지던 한 고을에서 사흘 밤 내리 피리 소리가 들렸고, 그 뒤 환자가 급격히 줄었다는 기록이 전해져 관심이 모이고 있다.",
          "당시 마을은 광대패의 출입을 금하고 있었다. 소리가 난 마당에는 아무도 없었으며, 다음 날 아침 멍석 위에 놓인 낡은 피리 한 자루만이 발견됐다는 것이 주민들의 공통된 증언이다.",
          "주민들은 “창부대신이 대신 놀아 주고 액운을 거둬 간 것”이라고 입을 모은다. 실제로 이 마을에서는 지금도 굿을 시작하기 전에 빈 자리 하나를 비워 두는 관습이 남아 있다.",
          "의원들은 계절 변화에 따른 자연적 소강 가능성을 제시하면서도, 인접 고을과의 뚜렷한 차이에 대해서는 “설명하기 어려운 부분이 있다”고 밝혔다.",
        ],
      },
    ],
    modal: [
      {
        title: "정체",
        items: [
          "광대·악사·예인을 지키는 무속의 신격",
          "떠돌이 예인이 죽은 뒤 신으로 모셔진 것으로 전해짐",
        ],
      },
      {
        title: "능력",
        items: [
          "소리로 액운을 흩어 놓음.",
          "역병·흉년·구설 등 마을 단위의 재앙을 미리 걷어 감.",
          "얼굴이 기억되지 않으며, 같은 시각 여러 곳에서 목격되기도 함.",
        ],
      },
      {
        title: "행동 및 성향",
        items: [
          "흥이 있는 자리를 좋아하며 먼저 나서지 않음.",
          "사례를 받지 않고 이름을 밝히지 않음.",
          "굿·잔치·놀이판에 스스로 찾아옴.",
        ],
      },
      {
        title: "선별 기준",
        items: [
          "재주를 뽐내기보다 함께 즐기는 자리를 만든 사람에게 나타나며, 흥을 나눌 줄 아는 마을에 한 해 동안의 액운을 막아 주는 복을 내림",
        ],
      },
    ],
  },

  sinjikke: {
    name: "신지께",
    image: "images/arc-sinjikke.png",
    art: "left: -26.33%; top: 0%; width: 152.66%; height: 100%;",
    tag: "[모범적인 인명 구조 활동]",
    pages: [
      {
        headline: "“풍랑 직전 뱃머리 막아선 인어… 어선 열두 척 전원 귀항”",
        subhead: "거문도 어민들 “신지께가 길을 막았다”",
        paras: [
          "남해 먼바다에서 조업 중이던 어선들이 정체불명의 존재에 가로막혀 회항한 뒤, 몇 시간 만에 그 해역에 큰 풍랑이 몰아친 사실이 확인됐다.",
          "어민들의 증언은 한결같았다. 긴 머리에 흰 저고리를 입은 여인의 상반신이 물 위로 솟아 뱃머리 앞을 가로막고, 손을 들어 뭍 쪽을 가리켰다는 것이다. 허리 아래는 물고기의 지느러미였다고 한다.",
          "그물을 거두고 돌아선 열두 척은 모두 무사했다. 반면 “미신”이라며 조업을 이어간 배 한 척은 돛대를 잃고 간신히 귀항했다.",
          "이 지역에서는 예부터 이 존재를 ‘신지께’라 불러 왔다. 어촌계는 “해를 끼친 적이 한 번도 없다”며 신지께를 보면 즉시 뱃머리를 돌린다는 오랜 규칙을 다시 확인했다.",
        ],
      },
      {
        headline: "“그물에 걸린 신지께 풀어 준 어부, 이듬해 최대 어획”",
        subhead: "“해치지 않았다” 목격자 증언 잇따라",
        indent: true,
        paras: [
          "지난 겨울 그물에 걸린 신지께를 바다로 돌려보낸 어부 B씨의 사연이 뒤늦게 알려지며 화제가 되고 있다.",
          "B씨에 따르면 당시 그물에는 사람의 상체를 한 존재가 걸려 있었고, 겁에 질린 선원들이 작살을 들었으나 B씨가 이를 막고 그물을 직접 끊었다고 한다. 풀려난 존재는 물속으로 들어가기 전 잠시 배를 돌아보았다는 것이 선원들의 공통된 진술이다.",
          "이듬해 B씨의 배는 같은 해역에서 유례없는 어획량을 기록했다. 인근 배들이 빈 그물을 올리는 동안에도 B씨의 그물만은 가득 찼다는 증언이 이어지고 있다.",
          "어촌계는 “바다가 보답한 것”이라 해석하고 있으나, 수산 당국은 해류 변화에 따른 어군 이동 가능성을 함께 살피고 있다고 밝혔다.",
        ],
      },
    ],
    modal: [
      {
        title: "정체",
        items: [
          "남해 먼바다에 사는 인어 형상의 바다 영물",
          "상반신은 사람, 하반신은 물고기의 모습",
        ],
      },
      {
        title: "능력",
        items: [
          "풍랑·해일 등 바다의 변고를 미리 알아챔.",
          "뱃길을 막아서는 방식으로 위험을 알림.",
          "말을 하지 않고 몸짓으로만 뜻을 전함.",
        ],
      },
      {
        title: "행동 및 성향",
        items: [
          "사람을 해치지 않으며 먼저 다가오지도 않음.",
          "안개 낀 새벽과 해 질 무렵에 주로 나타남.",
          "붙잡히면 저항하지 않고 가만히 있음.",
        ],
      },
      {
        title: "선별 기준",
        items: [
          "바다를 함부로 대하지 않는 사람, 잡은 것을 되돌려 줄 줄 아는 사람 앞에 나타나며 그 배에 한 해 동안 무사 항해와 넉넉한 어획을 내림",
        ],
      },
    ],
  },

  geogugoe: {
    name: "거구괴&청의동자",
    image: "images/arc-geogugoe.png",
    art: "left: -26.33%; top: 0%; width: 152.66%; height: 100%;",
    tag: "[위기 상황 속 기지 발휘]",
    pages: [
      {
        headline: "“아이를 삼킨 거대한 입… 그러나 아이는 멀쩡히 걸어 나왔다”",
        subhead: "깊은 산길에서 벌어진 기이한 사건",
        paras: [
          "산길에서 실종됐던 아이가 하루 만에 아무런 상처 없이 돌아오는 일이 벌어져 주민들이 술렁이고 있다.",
          "함께 있던 일행은 “산 전체가 입처럼 벌어졌고 아이가 그 안으로 빨려 들어갔다”고 진술했다. 거대한 이빨과 두 눈을 보았다는 증언도 여럿 나왔다.",
          "돌아온 아이는 “안은 어둡지 않았고, 푸른 옷을 입은 또래 아이가 손을 잡고 길을 알려 줬다”고 말했다. 주민들은 이 아이를 ‘청의동자’라 부르고 있다.",
          "민속학계는 거구괴를 다른 세계로 통하는 문으로, 청의동자를 그 문을 지키는 길잡이로 보는 해석을 내놓고 있다. 삼켜진 사람이 해를 입었다는 기록은 아직 발견되지 않았다.",
        ],
      },
      {
        headline: "“괴물의 입속에서 길 잃은 이들 잇따라 구조… 푸른 옷 아이의 정체는”",
        subhead: "“거구괴는 문(門), 청의동자는 길잡이” 해석 제기",
        indent: true,
        paras: [
          "산에서 조난된 사람들이 거구괴의 입으로 들어갔다가 엉뚱한 마을 어귀로 나왔다는 진술이 잇따르고 있다.",
          "생환자들의 증언에는 공통점이 있다. 입안은 캄캄하지 않았고, 푸른 옷을 입은 아이가 앞서 걸으며 뒤를 돌아보았다는 것이다. 아이는 말이 없었고, 갈림길마다 한쪽을 손으로 가리켰다고 한다.",
          "다만 아이를 따라가지 않고 제 길을 고집한 사람은 며칠씩 헤매다 원래 자리로 되돌아왔다는 진술도 함께 나온다. 주민들은 “묻지 말고 따라가야 한다”고 입을 모은다.",
          "전문가들은 거구괴의 위협적인 겉모습과 실제 역할이 정반대라는 점에 주목하고 있다. 한 연구자는 “겁을 주어 함부로 산에 들지 못하게 하려는 장치였을 것”이라고 설명했다.",
        ],
      },
    ],
    modal: [
      {
        title: "정체",
        items: [
          "거구괴: 산 하나를 삼킬 만큼 큰 입을 가진 존재",
          "청의동자: 그 입안에서 길을 안내하는 푸른 옷의 아이",
          "둘은 늘 함께 나타나며 따로 목격된 기록이 없음.",
        ],
      },
      {
        title: "능력",
        items: [
          "삼킨 사람을 다른 곳으로 옮겨 놓음.",
          "안으로 들어간 사람은 시간이 거의 흐르지 않은 채 돌아옴.",
          "청의동자는 말 없이 손짓만으로 길을 일러 줌.",
        ],
      },
      {
        title: "행동 및 성향",
        items: [
          "겉모습은 험하나 사람을 물거나 씹지 않음.",
          "길을 잃은 사람, 해가 진 뒤 산에 남은 사람 앞에 나타남.",
          "따라오지 않는 사람은 억지로 끌지 않음.",
        ],
      },
      {
        title: "선별 기준",
        items: [
          "두려움 속에서도 안내를 믿고 따르는 사람을 무사히 내보내며, 산을 함부로 헤치지 않은 사람에게는 지름길과 산의 은덕을 내림",
        ],
      },
    ],
  },

  uureong: {
    name: "우렁각시",
    image: "images/arc-uureong.png",
    art: "left: -26.33%; top: 0%; width: 152.66%; height: 100%;",
    tag: "[묵묵한 헌신의 표본]",
    pages: [
      {
        headline: "“빈집에 차려진 밥상… 주인 없는 부엌의 정체”",
        subhead: "홀로 살던 농부 A씨 집에서 반복 발생",
        paras: [
          "홀로 농사를 짓던 A씨의 집에서 매일 따뜻한 밥상이 차려져 있다는 진정이 접수돼 이웃들의 관심이 쏠리고 있다.",
          "A씨에 따르면 들일을 마치고 돌아오면 밥과 국이 김을 내고 있었고, 빨래와 마당까지 정돈돼 있었다. 집에는 아무도 드나든 흔적이 없었다.",
          "이웃들은 A씨가 며칠 전 논에서 주워 와 물독에 넣어 둔 커다란 우렁이를 지목하고 있다. 밥상이 차려지기 시작한 시점과 정확히 일치한다는 것이다.",
          "민속학계는 이를 ‘우렁각시’ 설화의 전형적인 전개로 보고 있다. 다만 설화에서 우렁각시는 정체가 드러나는 순간 떠나는 것으로 전해져, 이후 상황에 대한 우려도 함께 나오고 있다.",
        ],
      },
      {
        headline: "“우렁 껍데기 사라진 뒤 여인도 사라져”",
        subhead: "“기다리지 못한 것이 화근” 주민들 탄식",
        indent: true,
        paras: [
          "밥상의 주인을 확인하려다 여인을 잃었다는 A씨의 사연이 알려지며 안타까움을 사고 있다.",
          "A씨는 부엌에 숨어 있다가 물독에서 나오는 여인을 발견하고 그 자리에서 껍데기를 감췄다고 진술했다. 여인은 “아직 사흘이 남았다”고 말했으나 A씨는 듣지 않았다는 것이다.",
          "이튿날 아침 물독의 껍데기는 사라졌고 여인도 함께 자취를 감췄다. 마당에는 마지막으로 차려진 밥상 하나만 식은 채 남아 있었다고 전해진다.",
          "주민들은 “조금만 더 기다렸으면 될 일”이라며 안타까워하고 있다. 이 마을에서는 지금도 논에서 큰 우렁이를 보면 그대로 두고 지나가는 관습이 남아 있다.",
        ],
      },
    ],
    modal: [
      {
        title: "정체",
        items: [
          "오래 묵은 우렁이가 사람의 모습을 얻은 존재",
          "논·물독 등 물이 고인 자리에 머무름.",
        ],
      },
      {
        title: "변신 능력",
        items: [
          "사람이 없을 때에만 여인의 모습으로 나옴.",
          "껍데기를 잃으면 사람의 모습을 유지하지 못함.",
          "정해진 날수를 채워야 완전히 사람이 될 수 있음.",
        ],
      },
      {
        title: "행동 및 성향",
        items: [
          "생색을 내지 않고 살림을 돌봄.",
          "정체를 드러내는 것을 극도로 꺼림.",
          "먼저 말을 걸지 않으며, 들키면 곧 떠남.",
        ],
      },
      {
        title: "선별 기준",
        items: [
          "작은 생물을 함부로 대하지 않은 사람의 집에 머무르며, 끝까지 재촉하지 않고 기다린 사람에게만 남아 평생의 살림과 복을 함께함",
        ],
      },
    ],
  },
};

function setupArchiveDetail() {
  var nameBox = document.getElementById("arc-name");
  if (!nameBox) return; // 이 페이지가 아니면 중단

  var key = new URLSearchParams(location.search).get("ghost") || "dongjasam";
  if (!ARCHIVE[key]) key = "dongjasam";
  var ghost = ARCHIVE[key];

  // 아래쪽 '이전 / 다음' 줄 (목록에 놓인 순서대로).
  // 이 페이지는 본문 옆 화살표로 기사 1면·2면을 넘기기 때문에,
  // 키보드 ← → 가 어느 쪽을 뜻하는지 헷갈리지 않도록 여기서는 쓰지 않습니다.
  buildPager({
    order: ["dongjasam", "changbu", "sinjikke", "geogugoe", "uureong"],
    key: key,
    page: "ghost-archive-detail.html",
    noun: "귀신",
    nameOf: function (k) { return ARCHIVE[k].name; },
    keys: false,
  });

  document.title = ghost.name + " — 착한 귀신상";
  nameBox.textContent = ghost.name;
  document.getElementById("arc-tag").textContent = ghost.tag;

  var illust = document.getElementById("arc-illust");
  illust.src = ghost.image;
  illust.alt = ghost.name + " 일러스트";
  illust.setAttribute("style", ghost.art);

  // 신문 기사 1면 · 2면
  ghost.pages.forEach(function (page, i) {
    var box = document.getElementById("dj-page-" + (i + 1));
    if (!box) return;

    var h3 = document.createElement("h3");
    h3.className = "article-headline";
    h3.textContent = page.headline;

    var sub = document.createElement("p");
    sub.className = "article-subhead";
    sub.textContent = page.subhead;

    var line = document.createElement("hr");
    line.className = "rule thin";

    var text = document.createElement("div");
    text.className = "article-text" + (page.indent ? " indent" : "");
    page.paras.forEach(function (para) {
      var p = document.createElement("p");
      p.textContent = para;
      text.appendChild(p);
    });

    box.appendChild(h3);
    box.appendChild(sub);
    box.appendChild(line);
    box.appendChild(text);
  });

  // '자세히 보기' 팝업
  var modal = document.getElementById("dj-modal");
  if (modal) modal.setAttribute("aria-label", ghost.name + " 자세히 보기");

  var modalBody = document.getElementById("arc-modal-body");
  ghost.modal.forEach(function (group) {
    var section = document.createElement("section");

    var h4 = document.createElement("h4");
    h4.textContent = group.title;

    var ul = document.createElement("ul");
    group.items.forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });

    section.appendChild(h4);
    section.appendChild(ul);
    modalBody.appendChild(section);
  });
}


/* ===========================================================
   9. 팝업 열고 닫기

   data-modal-open="아이디" 가 붙은 버튼을 누르면
   그 아이디의 <dialog> 가 열립니다.
   Esc 로 닫기와 초점 가두기는 <dialog> 가 알아서 해주고,
   여기서는 "바깥 어두운 곳 클릭 → 닫기" 만 더해 줍니다.
   =========================================================== */
function setupModals() {
  var buttons = document.querySelectorAll("[data-modal-open]");
  if (buttons.length === 0) return; // 팝업이 없는 페이지면 중단

  buttons.forEach(function (btn) {
    var dialog = document.getElementById(btn.getAttribute("data-modal-open"));
    if (!dialog) return;

    btn.addEventListener("click", function () {
      dialog.showModal();
    });

    // 팝업 상자 바깥(어두운 부분)을 누르면 닫습니다.
    dialog.addEventListener("click", function (e) {
      var box = dialog.getBoundingClientRect();
      var inside =
        e.clientX >= box.left && e.clientX <= box.right &&
        e.clientY >= box.top && e.clientY <= box.bottom;
      if (!inside) dialog.close();
    });
  });
}



/* ===========================================================
   10. 기사 넘기기 (ghost-archive-detail.html)
   본문 옆 화살표로 1면 ↔ 2면을 오갑니다.
   =========================================================== */
function setupStoryPages() {
  var page1 = document.getElementById("dj-page-1");
  if (!page1) return; // 이 페이지가 아니면 중단

  var page2 = document.getElementById("dj-page-2");
  var next = document.getElementById("dj-next");
  var prev = document.getElementById("dj-prev");
  var pager = document.getElementById("dj-pager");

  function show(n) {
    page1.hidden = n !== 1;
    page2.hidden = n !== 2;
    next.hidden = n === 2;   // 2면에서는 오른쪽 화살표를 숨기고
    prev.hidden = n === 1;   // 1면에서는 왼쪽 화살표를 숨깁니다
    pager.textContent = n;
  }

  next.addEventListener("click", function () { show(2); });
  prev.addEventListener("click", function () { show(1); });
}

/* ===========================================================
   페이지가 열리면 알맞은 기능을 실행합니다.
   (각 함수는 자기 페이지가 아니면 알아서 중단됩니다.)
   =========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  setupGlitch();
  setupArchiveDetail();   // 기사·팝업 내용을 먼저 채운 뒤에 넘기기를 붙입니다
  setupModals();
  setupStoryPages();
  setupGhostDetail();
  setupFamousDetail();
  startHumanTest();
  showHumanResult();
  startGhostExam();
  showGhostResult();
  setupMenu();
  setupDogamSearch();
});
