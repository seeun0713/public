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
   1. 귀신 유형 테스트 (human-test.html)  ─ 8유형 버전

   ▸ 버튼 색은 기존과 같은 의미를 유지합니다.
       0=파랑(직진) 1=흰색(감성) 2=노랑(자유) 3=빨강(원칙·분석)
   ▸ 색마다 귀신 2명이 들어 있고, 문항마다 A조 / B조 중 한 조가 나옵니다.
       A조: 지귀(파랑)  · 아랑(흰색)     · 걸신(노랑) · 신기원요(빨강)
       B조: 수살귀(파랑) · 청군여귀(흰색) · 백귀(노랑) · 매화귀신(빨강)
   ▸ A조 5문항, B조 5문항 → 귀신마다 최대 5점.
   ▸ 가장 많이 고른 귀신이 결과. 동점이면 더 나중 문항에서 고른 귀신.
   =========================================================== */

var typeKeys = ["blue", "white", "yellow", "red"];

var ghostSets = {
  A: ["jigwi", "arang", "geolsin", "singiwonyo"],
  B: ["susalgwi", "cheonggun", "baekgwi", "maehwa"],
};

// answers 는 항상 [파랑, 흰색, 노랑, 빨강] 순서
var humanQuestions = [
  {
    set: "A",
    q: "소중한 사람이 갑자기 연락을 끊었다. 나는?",
    answers: [
      "그 사람이 올 만한 곳에서 기다린다. 마음이 식질 않는다.",
      "내 얘기를 한 번만 들어줬으면 좋겠다. 오해는 풀고 싶다.",
      "일단 맛있는 걸 먹으며 기운부터 차린다.",
      "무슨 일이 있었는지 하나씩 짚어 진짜 이유를 알아낸다.",
    ],
  },
  {
    set: "B",
    q: "주말에 갑자기 시간이 비었다. 나는?",
    answers: [
      "바로 친구를 불러낸다. 혼자 있는 건 못 견딘다.",
      "방에서 음악을 듣는다. 그래도 연락은 좀 왔으면.",
      "아무에게도 말하지 않고 훌쩍 사라진다.",
      "오래된 나무가 있는 길을 산책하며 하루를 정돈한다.",
    ],
  },
  {
    set: "B",
    q: "처음 간 모임에서 나는?",
    answers: [
      "마음에 드는 한 사람 곁에 딱 붙어 있는다.",
      "구석에 있지만 누가 먼저 말 걸어주길 바란다.",
      "말은 거의 안 했는데 다들 나를 기억한다.",
      "인사부터 예의 바르게, 제대로 한다.",
    ],
  },
  {
    set: "A",
    q: "중요한 결정을 앞두고 있다. 나는?",
    answers: [
      "마음이 가는 쪽이면 앞뒤 안 가리고 뛰어든다.",
      "나중에 돌아봐도 떳떳할 선택인지 생각한다.",
      "지금 당장 제일 끌리는 걸 고른다.",
      "근거를 모으고 사실부터 확인한다.",
    ],
  },
  {
    set: "A",
    q: "친구가 억울한 일을 당했다. 나는?",
    answers: [
      "당장 달려가 내 일처럼 불같이 화를 낸다.",
      "친구의 이야기를 끝까지 듣고 믿어준다.",
      "고기부터 사준다. 배가 불러야 힘이 난다.",
      "증거를 모아 누가 잘못했는지 밝혀준다.",
    ],
  },
  {
    set: "B",
    q: "스트레스를 받으면 나는?",
    answers: [
      "아무나 붙잡고 끝까지 털어놓는다.",
      "혼자 울고 나서 아무렇지 않은 척한다.",
      "연락을 끊고 잠수를 탄다.",
      "방을 치우고 흐트러진 것부터 바로잡는다.",
    ],
  },
  {
    set: "A",
    q: "여행 계획을 짤 때 나는?",
    answers: [
      "가고 싶은 곳 딱 하나만 보고 바로 떠난다.",
      "그곳에 얽힌 옛이야기부터 찾아본다.",
      "맛집 지도부터 만든다.",
      "동선과 변수를 꼼꼼하게 확인한다.",
    ],
  },
  {
    set: "B",
    q: "누군가 나에게 선을 넘는 말을 했다. 나는?",
    answers: [
      "서운해도 멀어질까 봐 먼저 붙잡는다.",
      "겉으로는 웃지만 조용히 거리를 둔다.",
      "싸늘한 눈빛 한 번으로 분위기를 얼린다.",
      "그 자리에서 정중하지만 단호하게 짚는다.",
    ],
  },
  {
    set: "B",
    q: "주변 사람들이 말하는 나는?",
    answers: [
      "곁에 누가 꼭 있어야 하는 사람",
      "속을 잘 안 보여주는 사람",
      "도무지 알 수 없는 사람",
      "원칙이 분명하고 깐깐한 사람",
    ],
  },
  {
    set: "A",
    q: "딱 하나의 소원이 이루어진다면?",
    answers: [
      "좋아하는 사람을 한 번만 더 만나고 싶다.",
      "내 이야기가 오래도록 기억되면 좋겠다.",
      "배 터지게 먹고 푹 자고 싶다.",
      "묻혀 있던 진실이 모두 밝혀지면 좋겠다.",
    ],
  },
];

// 유형 결과 (key 는 GHOSTS 와 같음 → 상세 페이지 링크에 그대로 사용 가능)
var humanTypes = {
  jigwi: {
    ghost: "지귀",
    type: "불꽃 직진형",
    color: "blue",
    summary: "한번 마음이 가면 온몸으로 타오르는 사람",
    story: "선덕여왕을 기다리다 잠든 사이 끝내 닿지 못한 마음이 불이 된 지귀처럼, 당신은 좋아하는 것 앞에서 계산하지 않습니다.",
    intro: ["한번 마음이 향하면 속도를 줄이지 못하는 편입니다.", "재고 따지기보다 먼저 움직이고, 그 열기가 곁에 있는 사람에게까지 옮겨 붙습니다."],
    traitTitle: "뜨겁게 밀어붙이는 편이에요.",
    traits: ["한번 빠지면 다른 것이 잘 보이지 않습니다.", "좋아하는 마음을 오래 숨기지 못합니다.", "기다리는 시간이 길어지면 속이 타들어 갑니다.", "한번 정한 방향은 좀처럼 꺾지 않습니다."],
    advice: "마음은 그대로 두되 거리는 지키세요. 닿지 못한 마음이 나를 태우지 않도록.",
    good: "arang",
    bad: "maehwa",
  },
  susalgwi: {
    ghost: "수살귀",
    type: "끌어당김형",
    color: "blue",
    summary: "혼자 남겨지는 게 제일 무서운 사람",
    story: "물가에 홀로 남아 곁을 채워 줄 누군가를 기다리는 수살귀처럼, 당신은 사람을 곁에 붙잡아 두는 힘이 있습니다.",
    intro: ["곁에 사람이 있어야 비로소 마음이 놓이는 편입니다.", "한번 맺은 인연은 오래 붙들고, 그만큼 멀어지는 기척에 민감하게 반응합니다."],
    traitTitle: "사람을 오래 붙드는 편이에요.",
    traits: ["한번 맺은 인연은 끝까지 놓지 않습니다.", "혼자 있는 시간을 유난히 힘들어합니다.", "사람을 끌어당기는 묘한 기운이 있습니다.", "떠나려는 기색을 누구보다 먼저 알아챕니다."],
    advice: "붙잡은 손을 가끔 느슨하게 풀어 보세요. 물러서도 떠나지 않는 사람이 진짜 곁입니다.",
    good: "geolsin",
    bad: "baekgwi",
  },
  arang: {
    ghost: "아랑",
    type: "증언자형",
    color: "white",
    summary: "나를 정확히 알아주길 바라는 사람",
    story: "복수보다 증언을 원했던 아랑처럼, 당신은 뭉뚱그려지기보다 한 사람으로서 제대로 이해받고 싶어 합니다.",
    intro: ["뭉뚱그려지기보다 한 사람으로 제대로 이해받고 싶어 하는 편입니다.", "목소리를 높이기보다 사실을 차분히 쌓아 두었다가 필요한 순간에 꺼내 놓습니다."],
    traitTitle: "끝까지 들어주는 편이에요.",
    traits: ["남의 이야기를 중간에 자르지 않습니다.", "오해받는 상황을 가장 견디기 힘들어합니다.", "떳떳함과 기품을 중요하게 여깁니다.", "한번 한 말은 끝까지 책임지려 합니다."],
    advice: "당신의 이야기를 들어줄 사람은 생각보다 가까이 있어요. 먼저 말을 꺼내 보세요.",
    good: "singiwonyo",
    bad: "susalgwi",
  },
  cheonggun: {
    ghost: "청군여귀",
    type: "거문고 은둔형",
    color: "white",
    summary: "혼자이고 싶지도, 함께이고 싶지도 않은 사람",
    story: "흉가에서 홀로 거문고를 타면서도 사람을 완전히 밀어내지 못한 청군여귀처럼, 당신은 자기만의 방을 소중히 여기면서도 누군가를 기다립니다.",
    intro: ["자기만의 자리를 소중히 여기면서도 완전히 문을 닫지는 않는 편입니다.", "먼저 다가가지는 않지만, 다가온 사람은 조용히 오래 기억합니다."],
    traitTitle: "속을 천천히 여는 편이에요.",
    traits: ["속마음을 쉽게 보여주지 않습니다.", "혼자만의 취미와 감성이 깊습니다.", "겉모습과 실제 모습 사이에 틈이 있습니다.", "편해진 사람에게는 의외로 말이 많아집니다."],
    advice: "울어도 괜찮아요. 본모습을 보여줘도 곁에 남는 사람이 있습니다.",
    good: "maehwa",
    bad: "susalgwi",
  },
  geolsin: {
    ghost: "걸신",
    type: "욕구 솔직형",
    color: "yellow",
    summary: "채워져야 비로소 웃는 사람",
    story: "한 번도 배불리 먹어보지 못한 한을 품은 걸신처럼, 당신은 원하는 것에 솔직하고 작은 만족에서 큰 행복을 찾습니다.",
    intro: ["원하는 것 앞에서 솔직해지는 편입니다.", "작은 만족에서 큰 기쁨을 찾고, 그 기분을 주변에도 거리낌 없이 나눕니다."],
    traitTitle: "숨기지 않는 편이에요.",
    traits: ["먹는 것과 쉬는 것에 진심입니다.", "원하는 것을 돌려 말하지 않습니다.", "악의가 없어 미워하기 어렵습니다.", "기분이 좋으면 표정에 그대로 드러납니다."],
    advice: "채우되 끝을 정해 두세요. 적당히 배부를 때가 가장 행복합니다.",
    good: "susalgwi",
    bad: "maehwa",
  },
  baekgwi: {
    ghost: "백귀",
    type: "미스터리형",
    color: "yellow",
    summary: "정체를 알 수 없어서 더 궁금한 사람",
    story: "여러 이름으로 갈라져 전해질 뿐 정체가 분명하지 않은 백귀처럼, 사람들은 당신을 저마다 다르게 기억합니다.",
    intro: ["어디에도 오래 매이지 않는 편입니다.", "말수는 적지만 자리에 남는 인상이 뚜렷해, 보는 사람마다 다르게 기억합니다."],
    traitTitle: "쉽게 읽히지 않는 편이에요.",
    traits: ["말수는 적지만 존재감이 큽니다.", "얽매이는 것을 싫어해 불쑥 자리를 뜹니다.", "보는 사람마다 평가가 크게 갈립니다.", "속내를 굳이 설명하려 하지 않습니다."],
    advice: "가끔은 스스로 정체를 밝혀 보세요. 오해가 전설이 되기 전에.",
    good: "cheonggun",
    bad: "singiwonyo",
  },
  singiwonyo: {
    ghost: "신기원요",
    type: "진실 추적형",
    color: "red",
    summary: "억울한 일은 끝까지 밝혀야 하는 사람",
    story: "끔찍한 모습 뒤에 숨은 진실을 알리려 인간에게 도움을 청한 신기원요처럼, 당신은 묻힌 사실을 그냥 넘기지 못합니다.",
    intro: ["새로운 환경에서도 자신의 방식과 리듬을 유지하는 편입니다.", "타인에게 쉽게 휩쓸리기보다 스스로 생각하고 판단하며, 가까운 사람과 맺은 관계를 오래도록 소중하게 이어갑니다."],
    traitTitle: "섬세하게 관찰하는 편이에요.",
    traits: ["주변의 분위기나 사람의 변화를 빠르게 알아차립니다.", "먼저 나서기보다는 상황을 충분히 살핀 후 행동합니다.", "표현은 조용하지만 마음을 오래 간직하는 편입니다.", "가까운 사람에게는 생각보다 깊은 관심을 보입니다."],
    advice: "진실을 좇는 동안 나 자신도 돌봐 주세요. 모든 짐을 혼자 질 필요는 없어요.",
    good: "arang",
    bad: "baekgwi",
  },
  maehwa: {
    ghost: "매화귀신",
    type: "대쪽 선비형",
    color: "red",
    summary: "지켜야 할 선이 분명한 사람",
    story: "백 년을 한자리에서 버틴 매화나무의 령처럼, 당신은 예의와 원칙을 지키는 사람에게 그만큼의 대우를 돌려줍니다.",
    intro: ["지켜야 할 선이 분명한 편입니다.", "예의를 갖춘 사람에게는 그만큼 돌려주고, 선을 넘는 자리에서는 조용히 물러섭니다."],
    traitTitle: "선을 지키는 편이에요.",
    traits: ["예의 없는 행동을 오래 참지 못합니다.", "한번 정한 원칙은 잘 바꾸지 않습니다.", "자연과 오래된 것을 아낍니다.", "말보다 태도로 뜻을 전합니다."],
    advice: "가벼운 농담 하나쯤은 흘려보내도 괜찮아요. 꽃잎이 너무 많이 흩날리지 않게.",
    good: "cheonggun",
    bad: "geolsin",
  },
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
  var chosen = []; // 각 문항에서 고른 귀신 key

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
      btn.className = "typetest-answer " + typeKeys[index]; // 색
      btn.textContent = text;
      btn.addEventListener("click", function () {
        chosen[current] = ghostSets[item.set][index]; // 고른 귀신 저장
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
    // 귀신별 점수 세기
    var counts = {};
    chosen.forEach(function (key) {
      counts[key] = (counts[key] || 0) + 1;
    });

    // 가장 높은 점수. 동점이면 뒤쪽 문항에서 고른 귀신이 이깁니다.
    var best = chosen[chosen.length - 1];
    for (var i = chosen.length - 1; i >= 0; i--) {
      if (counts[chosen[i]] > counts[best]) best = chosen[i];
    }

    localStorage.setItem("humanResultType", best);
    window.location.href = "human-test-result.html";
  }

  showQuestion();
}


/* ===========================================================
   2. 테스트 결과 (human-test-result.html)
   저장된 귀신 key 를 읽어 화면에 표시합니다.
   key 는 GHOSTS 와 같아서 귀신 그림·상세 페이지를 그대로 가져다 씁니다.
   =========================================================== */
/* 귀신 그림(4096×2304)은 인물이 가운데 작게 그려져 있어 그대로 쓰면
   흰 여백만 보입니다. 도감 목록 카드와 똑같이 크게 늘려 인물 쪽만
   잘라 보여 주고, 그 잘라내기 값을 여기 모아 둡니다. */
var resultArt = {
  jigwi:      { left: "-343.06%", top: "-59.96%" },
  susalgwi:   { left: "-342.98%", top: "-76.43%" },
  arang:      { left: "-339.22%", top: "-77.4%" },
  cheonggun:  { left: "-341.76%", top: "-97.41%" },
  geolsin:    { left: "-342.98%", top: "-76.43%" },
  baekgwi:    { left: "-343.34%", top: "-81.56%" },
  singiwonyo: { left: "-353.06%", top: "-74.75%" },
  maehwa:     { left: "-361.69%", top: "-86.54%" },
};

/* 잘라낸 그림 한 장을 만듭니다. (바깥 칸 크기는 CSS 가 정합니다) */
function makeGhostArt(key, className) {
  var box = document.createElement("span");
  box.className = className;

  var img = document.createElement("img");
  if (GHOSTS[key]) img.src = GHOSTS[key].image;
  img.alt = "";
  if (resultArt[key]) {
    img.style.left = resultArt[key].left;
    img.style.top = resultArt[key].top;
  }

  box.appendChild(img);
  return box;
}

function showHumanResult() {
  var typeEl = document.getElementById("result-type");
  if (!typeEl) return; // 이 페이지가 아니면 중단

  var key = localStorage.getItem("humanResultType");
  if (!humanTypes[key]) key = "jigwi"; // 아직 풀지 않았거나 옛 값이면 기본값
  var data = humanTypes[key];

  // 유형 이름 · 귀신 이름 · 한 줄 요약
  document.body.setAttribute("data-result-color", data.color);
  document.title = data.ghost + " — 귀신 유형 테스트 결과";
  typeEl.textContent = data.type;
  document.getElementById("result-ghost").textContent = data.ghost;
  document.getElementById("result-summary").textContent = data.summary;
  document.getElementById("result-story").textContent = data.story;
  document.getElementById("result-advice").textContent = data.advice;

  // 결과 귀신 그림
  var artSlot = document.getElementById("result-art");
  artSlot.innerHTML = "";
  artSlot.appendChild(makeGhostArt(key, "art-window"));

  // 내 모습 (특징 세 줄)
  var traitsEl = document.getElementById("result-traits");
  traitsEl.innerHTML = "";
  data.traits.forEach(function (text) {
    var li = document.createElement("li");
    li.textContent = text;
    traitsEl.appendChild(li);
  });

  // 도감에서 이 귀신 보기
  var more = document.getElementById("result-more");
  more.href = "human-encyclopedia-detail.html?ghost=" + key;
  more.textContent = data.ghost + " 도감 보기";

  // 잘 맞는 귀신 / 상극인 귀신 카드
  var ghostsEl = document.getElementById("result-ghosts");
  ghostsEl.innerHTML = "";
  [
    { label: "잘 맞는 귀신", key: data.good },
    { label: "상극인 귀신", key: data.bad },
  ].forEach(function (item) {
    var mate = humanTypes[item.key];
    if (!mate) return;

    var card = document.createElement("a");
    card.className = "result-mate";
    card.href = "human-encyclopedia-detail.html?ghost=" + item.key;

    var label = document.createElement("span");
    label.className = "label";
    label.textContent = item.label;

    var name = document.createElement("span");
    name.className = "name";
    name.textContent = mate.ghost;

    var type = document.createElement("span");
    type.className = "type";
    type.textContent = mate.type;

    card.appendChild(label);
    card.appendChild(makeGhostArt(item.key, "art-window small"));
    card.appendChild(name);
    card.appendChild(type);
    ghostsEl.appendChild(card);
  });
}


/* ===========================================================
   3. 인간 유사도 시험 (ghost-exam.html)  ─ 귀신 입장 버전

   ▸ 귀신이 인간 세상에서 겪을 만한 상황 10가지.
   ▸ 보기마다 score(0~10). 높을수록 "인간답다".
     가장 인간다운 답이 늘 첫 번째에 오지 않도록 순서를 섞어 두었습니다.
   ▸ 합계(최대 100)가 곧 유사도 %. 8단계 등급으로 나뉩니다.
   ▸ 상황과 보기는 귀신 도감 · 착한 귀신상 · 공존에 관한 조례를 참고했습니다.
   =========================================================== */
var ghostQuestions = [
  {
    q: "새벽닭이 울고 해가 뜨기 시작했다. 나는?",
    answers: [
      { text: "그늘진 다락으로 스르르 물러난다.", score: 2 },
      { text: "창문을 열고 오늘 할 일을 떠올린다.", score: 10 },
      { text: "해가 뜨든 말든 우물 속에서 계속 운다.", score: 0 },
      { text: "이불을 머리끝까지 덮고 5분만 더 누워 있는다.", score: 8 },
    ],
  },
  {
    q: "밤길에서 마주친 사람이 나를 보고 비명을 질렀다. 나는?",
    answers: [
      { text: "더 가까이 다가가 얼굴을 들이민다.", score: 0 },
      { text: "얼굴이 안 보이게 머리카락을 앞으로 쓸어내린다.", score: 3 },
      { text: "놀라게 해서 미안하다고 사과하고 길을 비켜 준다.", score: 10 },
      { text: "뭐가 그렇게 무섭냐며 괜히 서운해한다.", score: 7 },
    ],
  },
  {
    q: "거울 앞에 섰다. 나는?",
    answers: [
      { text: "안색이 너무 창백하니 볼에 혈색을 좀 넣는다.", score: 6 },
      { text: "거울에 아무것도 비치지 않는다. 늘 그랬다.", score: 0 },
      { text: "오늘 머리 모양이 마음에 안 든다.", score: 10 },
      { text: "거울 속 나와 오래도록 눈싸움을 한다.", score: 3 },
    ],
  },
  {
    q: "어쩐지 배가 고픈 것 같다. 나는?",
    answers: [
      { text: "편의점 삼각김밥과 라면으로 한 끼를 해결한다.", score: 10 },
      { text: "지나가는 사람에게 씌어 그 입으로 대신 먹는다.", score: 0 },
      { text: "잔칫집을 기웃거리다 팥죽 한 그릇을 얻어먹는다.", score: 7 },
      { text: "제사상 향냄새만 맡아도 배가 부르다.", score: 2 },
    ],
  },
  {
    q: "마을에 잔치가 열려 풍악이 울린다. 나는?",
    answers: [
      { text: "지붕 위에서 몰래 내려다본다.", score: 4 },
      { text: "구경만 하다 누가 손을 끌면 못 이기는 척 들어간다.", score: 8 },
      { text: "풍악에 맞춰 촛불을 하나씩 꺼 버린다.", score: 0 },
      { text: "사람들 틈에 섞여 함께 장단을 맞춘다.", score: 10 },
    ],
  },
  {
    q: "강가에서 누군가 물에 빠져 허우적거린다. 나는?",
    answers: [
      { text: "발목을 붙잡는다. 드디어 내 자리를 대신할 사람이다.", score: 0 },
      { text: "119에 신고하고 주변에 큰 소리로 도움을 청한다.", score: 10 },
      { text: "뱃길을 막아서서 몸짓으로 위험을 알린다.", score: 6 },
      { text: "아무 일 없다는 듯 수면 아래로 가라앉는다.", score: 2 },
    ],
  },
  {
    q: "몰래 밥을 지어 둔 집의 주인이 \"누가 해 줬지?\" 하며 고마워한다. 나는?",
    answers: [
      { text: "숟가락을 공중에 띄워 대답을 대신한다.", score: 0 },
      { text: "쑥스러워서 다음에 말하기로 한다.", score: 7 },
      { text: "\"사실 제가 했어요\" 하고 웃으며 인사한다.", score: 10 },
      { text: "들키기 전에 우렁이 껍데기 속으로 숨는다.", score: 3 },
    ],
  },
  {
    q: "해 진 산길에서 길 잃은 아이를 만났다. 나는?",
    answers: [
      { text: "말없이 손짓으로 내려가는 길을 알려 준다.", score: 6 },
      { text: "아이 뒤를 조용히 따라가며 이름을 부른다.", score: 0 },
      { text: "큰 입을 벌려 한 번에 마을까지 옮겨 준다.", score: 3 },
      { text: "손을 꼭 잡고 마을 입구까지 데려다준다.", score: 10 },
    ],
  },
  {
    q: "누군가 나에게 \"무슨 사연이 있나요?\" 하고 묻는다. 나는?",
    answers: [
      { text: "하고 싶은 말은 많은데 자꾸 눈물부터 난다.", score: 8 },
      { text: "대답 대신 내가 죽던 날의 모습으로 나타난다.", score: 2 },
      { text: "차 한 잔을 앞에 두고 천천히 털어놓는다.", score: 10 },
      { text: "새로 부임한 사또처럼 기절시킨다.", score: 0 },
    ],
  },
  {
    q: "딱 하루, 진짜 사람이 될 수 있다면?",
    answers: [
      { text: "굳이? 귀신으로 사는 게 편하다.", score: 1 },
      { text: "그리운 사람을 찾아가 못다 한 말을 전한다.", score: 9 },
      { text: "사람들 사는 모습을 먼발치에서 구경만 한다.", score: 5 },
      { text: "친구들과 떡볶이를 먹고 노래방에서 목이 쉬도록 논다.", score: 10 },
    ],
  },
];

/* 8단계 등급.  min 이상이면 그 단계입니다 (위에서부터 가장 높은 단계를 찾음).
     ghost : 닮은 귀신 (link 로 도감 · 착한 귀신상 상세에 연결)
     doc   : 귀신 위원회가 발급하는 서류 이름
     law   : 공존에 관한 조례와 엮은 한 줄 판정
     next  : 다음 단계로 가기 위한 과제 (마지막 단계는 축하 문구) */
var ghostLevels = [
  {
    step: 1, min: 0, name: "원형 그대로의 귀신",
    ghost: "백귀", link: "human-encyclopedia-detail.html?ghost=baekgwi",
    doc: "인간 세계 출입 제한 통지서",
    summary: "사람들이 떠올리는 '가장 무서운 것' 그 자체",
    desc: "인간 흉내는커녕, 보는 것만으로 사람을 얼어붙게 만드는 존재감을 지녔습니다. 인간 세상보다는 전설 속이 더 편한 단계입니다.",
    law: "제5조(외형 제한) · 제6조(공포 강도 조절) 위반 우려",
    next: "공포 강도를 한 단계만 낮춰 보세요. 머리를 묶는 것부터 시작입니다.",
  },
  {
    step: 2, min: 13, name: "물가의 외톨이",
    ghost: "수살귀", link: "human-encyclopedia-detail.html?ghost=susalgwi",
    doc: "인간 접촉 주의 경고장",
    summary: "곁에 있고 싶은데, 방법이 '붙잡기'뿐",
    desc: "사람이 그립다는 마음은 인간과 꽤 닮았습니다. 다만 다가가는 방법이 아직 발목을 붙드는 것밖에 없습니다.",
    law: "제7조(접촉 원칙) — 직접 접촉 최소화 요망",
    next: "손 대신 말로 다가가는 연습을 해 보세요.",
  },
  {
    step: 3, min: 26, name: "배고픈 떠돌이",
    ghost: "걸신", link: "human-encyclopedia-detail.html?ghost=geolsin",
    doc: "임시 체류 불허 통지서",
    summary: "인간 세상의 즐거움은 아는데, 남의 몸을 빌려야 누린다",
    desc: "밥맛, 잔치의 흥 같은 인간의 기쁨을 알아보기 시작했습니다. 아직은 그걸 스스로 누리지 못하고 사람에게 씌어야 합니다.",
    law: "제9조(금지 행위) — 지속적인 간섭 주의",
    next: "남의 입 말고 내 숟가락으로 먹는 법을 익혀 보세요.",
  },
  {
    step: 4, min: 38, name: "문 닫은 은둔자",
    ghost: "청군여귀", link: "human-encyclopedia-detail.html?ghost=cheonggun",
    doc: "야간 한정 임시 체류증",
    summary: "사람이 궁금하지만, 아직 문을 열지 못했다",
    desc: "인간의 마음을 제법 이해합니다. 그런데 곁에 두자니 겁나고 혼자 있자니 외로워 흉가의 방문을 반쯤만 열어 둔 상태입니다.",
    law: "제3조(출몰 시간) 준수 우수",
    next: "거문고 소리 대신 먼저 인사 한마디를 건네 보세요.",
  },
  {
    step: 5, min: 51, name: "먼발치의 수호자",
    ghost: "신지께", link: "ghost-archive-detail.html?ghost=sinjikke",
    doc: "인간 관찰자 등록증",
    summary: "사람을 지킬 줄 알지만, 말 대신 몸짓으로",
    desc: "사람을 해치지 않고 위험하면 먼저 알아채 막아섭니다. 절반은 인간입니다. 다만 아직 말 대신 몸짓으로, 가까이 대신 먼발치에서 전합니다.",
    law: "제8조(허용 행위) 범위 안에서 모범적 활동",
    next: "몸짓 대신 말 한마디로 마음을 전해 보세요.",
  },
  {
    step: 6, min: 63, name: "숨은 살림꾼",
    ghost: "우렁각시", link: "ghost-archive-detail.html?ghost=uureong",
    doc: "견습 인간 증명서",
    summary: "사람처럼 살고 있지만, 들킬까 봐 조마조마",
    desc: "밥 짓고 살림하고 사람을 돌보는 일상이 몸에 익었습니다. 정해진 날수만 채우면 사람이 될 수 있는데, 정체를 들킬까 봐 아직 껍데기를 곁에 둡니다.",
    law: "제1조(목적) — 공존 모범 사례",
    next: "들켜도 떠나지 않기. 그게 사람이 되는 마지막 날수입니다.",
  },
  {
    step: 7, min: 76, name: "잔치판의 악사",
    ghost: "창부대신", link: "ghost-archive-detail.html?ghost=changbu",
    doc: "준인간 증명서",
    summary: "사람들 틈에서 함께 웃고 노래한다",
    desc: "사람들과 섞여 흥을 나누고 함께 즐길 줄 압니다. 누가 봐도 인간입니다. 딱 하나, 아직 이름을 밝히지 않았을 뿐.",
    law: "조례 전 조항 준수 — 표창 대상",
    next: "이름을 밝혀도 괜찮아요. 고맙다는 인사도 받아 보세요.",
  },
  {
    step: 8, min: 88, name: "낮에는 완벽한 인간",
    ghost: "동자삼", link: "ghost-archive-detail.html?ghost=dongjasam",
    doc: "정식 인간 자격 증명서",
    summary: "술과 팥죽을 좋아하는, 사실상 인간",
    desc: "인간 음식을 좋아하고 인간 세상을 체험하는 걸 즐깁니다. 밤이면 가끔 산삼으로 돌아간다는 것만 빼면 흠잡을 데 없는 인간입니다.",
    law: "인간 유사도 최상위 — 증명서 즉시 발급",
    next: "축하합니다! 이제 인간에게 복을 나눠 줄 차례입니다.",
  },
];

// 점수(%) → 등급 찾기
function getGhostLevel(percent) {
  var level = ghostLevels[0];
  ghostLevels.forEach(function (lv) {
    if (percent >= lv.min) level = lv;
  });
  return level;
}

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
  var chosen = []; // 각 문항에서 고른 점수 (이전 버튼 지원)

  function showQuestion() {
    var item = ghostQuestions[current];

    counterEl.textContent = (current + 1) + "/" + total;
    fillEl.style.width = ((current + 1) / total) * 100 + "%";
    qnumEl.textContent = "Q" + (current + 1) + ".";
    questionEl.textContent = item.q;
    prevBtn.disabled = current === 0;

    answersEl.innerHTML = "";
    item.answers.forEach(function (answer) {
      var btn = document.createElement("button");
      btn.className = "exam-answer";
      btn.type = "button";
      btn.textContent = answer.text;
      btn.addEventListener("click", function () {
        chosen[current] = answer.score;
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

  prevBtn.addEventListener("click", function () {
    if (current > 0) {
      current -= 1;
      showQuestion();
    }
  });

  function finishGhostExam() {
    // 합계 → 백분율 (문항당 최대 10점)
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
   ▸ 기존 결과 화면의 id(result-score / result-grade / cert-grade)는 그대로 채웁니다.
   ▸ 아래 id 가 화면에 있으면 함께 채웁니다 (없으면 건너뜀).
       result-step, result-summary, result-desc, result-ghost(링크),
       result-law, result-next, cert-doc
   ▸ 주소에 ?score=73 을 붙이면 그 점수로 바로 볼 수 있습니다 (디자인 확인용).
   =========================================================== */
function showGhostResult() {
  var scoreEl = document.getElementById("result-score");
  if (!scoreEl) return;

  var fromUrl = new URLSearchParams(location.search).get("score");
  var percent = Number(fromUrl !== null ? fromUrl : localStorage.getItem("ghostExamScore") || 0);
  percent = Math.max(0, Math.min(100, percent || 0));

  var level = getGhostLevel(percent);

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  setText("result-score", percent);
  setText("result-grade", level.step + "단계 · " + level.name);
  setText("cert-grade", level.name);
  setText("cert-doc", level.doc);
  setText("result-step", level.step + " / " + ghostLevels.length + "단계");
  setText("result-summary", level.summary);
  setText("result-desc", level.desc);
  setText("result-law", level.law);
  setText("result-next", level.next);

  var ghostEl = document.getElementById("result-ghost");
  if (ghostEl) {
    ghostEl.textContent = level.ghost;
    if (ghostEl.tagName === "A") ghostEl.href = level.link;
  }
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
      { label: "위험도", level: true },
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
      { label: "위험도", level: true },
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
      { label: "위험도", level: true },
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
      { label: "위험도", level: true },
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

  dokkaebi: {
    name: "도깨비",
    image: "images/famous-dokkaebi.png",
    // 새 그림의 먹 영역(x 306~1126, y 105~1428)을 기준으로 다시 잡은 값
    art: { left: 41.4, top: -46.4, width: 530.6, height: 707.5 },
    rows: [
      { label: "이름", value: "도깨비" },
      { label: "종류", value: "정령 · 요괴" },
      { label: "지역", value: "산길 · 고갯마루 · 오래된 빈집" },
      { label: "능력", value: "도깨비방망이 / 도깨비불 / 둔갑 / 씨름" },
      { label: "위험도", level: true },
      { label: "생김새", wide: true, value: "정해진 모습 없이 커다란 사내, 푸른 불빛, 키 큰 그림자 등으로 나타난다고 전해진다. 흔히 떠올리는 뿔 달린 모습은 근대 이후 굳어진 이미지라는 해석도 있다." },
      { label: "특징", wide: true, value: "오래 쓰다 버린 빗자루나 절굿공이 같은 물건에 혼이 깃들어 생긴다고 한다. 장난과 내기, 씨름을 좋아하고 메밀묵을 즐기며, 한번 한 약속은 고지식할 만큼 지킨다." },
    ],
    level: 2,
    texts: [
      {
        title: "인간과의 관계",
        body: "사람을 해치기보다 골탕 먹이거나 내기를 거는 쪽에 가깝다. 착하고 정직한 사람에게는 방망이로 금은보화를 내주고, 욕심을 부리는 사람은 혼쭐을 낸다. 어수룩한 면이 있어 꾀 많은 사람에게 도리어 속아 넘어가는 이야기도 많다.",
      },
      {
        title: "대표적인 이야기",
        body: "노래를 잘하는 혹부리 영감이 도깨비들 앞에서 노래를 부르자, 도깨비들은 그 소리가 혹에서 나온다고 믿고 금은보화와 혹을 바꿔 갔다. 이를 흉내 낸 욕심쟁이 영감은 거짓말이 들통나 혹을 하나 더 붙이고 돌아왔다고 한다.",
      },
    ],
    bars: [
      { label: "한", value: 12 },
      { label: "공포", value: 38 },
      { label: "힘", value: 81 },
      { label: "출몰", value: 72 },
      { label: "개성", value: 97 },
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
    order: ["gumiho", "cheonyeo", "dalgyal", "eoduksini", "dokkaebi"],
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

  // 정보 줄. level: true 인 줄에는 값 대신 별(위험도)이 들어갑니다.
  ghost.rows.forEach(function (row) {
    var line = document.createElement("div");
    line.className = "fg-row" + (row.wide || row.level ? " wide" : "");

    var k = document.createElement("span");
    k.className = "k";
    k.textContent = row.label;
    line.appendChild(k);

    if (row.level) {
      var stars = document.createElement("span");
      stars.className = "stars";
      stars.textContent = "★".repeat(ghost.level) + "☆".repeat(5 - ghost.level);
      line.appendChild(stars);
    } else {
      var v = document.createElement("span");
      v.className = "v";
      v.textContent = row.value;
      line.appendChild(v);
    }

    infoBox.appendChild(line);
  });

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
   8-1-2. 가만히 두면 저절로 홀리기 (human-encyclopedia.html)

   마우스를 움직이지도 누르지도 않은 채 한동안 두면,
   카드가 저 혼자 정체를 드러내며 글리치를 일으킵니다.

   한 장씩 이어받는 방식입니다. 한 장이 홀려 있는 동안(HOLD) 그 절반쯤
   지난 시점에 다음 장이 켜지므로(STEP), 늘 두 장이 겹쳐 있다가
   앞의 것이 꺼지는 식으로 맞물려 돌아갑니다. 다 같이 껐다 켜지지 않아
   흐름이 끊기지 않습니다.
       0.0초  A 켜짐
       2.8초  B 켜짐 (A 는 아직)
       5.6초  A 꺼짐, C 켜짐
       8.4초  B 꺼짐, D 켜짐 …
   마우스를 움직이거나 누르면 곧바로 원래대로 돌아가고 다시 셉니다.

   호버와 똑같은 모습을 쓰기 위해 카드에 haunted 클래스를 붙입니다.
   (css 의 .dogam-card.reveal:is(:hover, .haunted) 규칙)
   =========================================================== */
function setupIdleHaunt() {
  var cards = document.querySelectorAll(".dogam-card.reveal");
  if (cards.length === 0) return; // 이 페이지가 아니면 중단

  // 움직임을 줄이도록 설정한 사용자에게는 저절로 바뀌지 않게 둡니다.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var IDLE_TIME = 10000; // 10초 동안 아무 것도 안 하면 시작
  var HOLD = 5600;       // 한 장이 홀려 있는 시간 (글리치 두 바퀴 = 2.8초 × 2)
  var STEP = 2800;       // 다음 장이 켜지는 간격 (글리치 한 바퀴)
  var idleTimer = null;
  var stepTimer = null;
  var holdTimers = [];   // 켜 둔 카드를 끄기로 예약해 둔 것들
  var recent = [];       // 바로 직전에 나온 카드들 (연달아 다시 뽑히지 않게)

  function clearHaunt() {
    holdTimers.forEach(clearTimeout);
    holdTimers = [];
    recent = [];
    cards.forEach(function (card) { card.classList.remove("haunted"); });
  }

  // 지금 홀려 있지 않은 카드 중 하나를 켜고, HOLD 뒤에 끕니다.
  // 막 꺼진 카드가 곧바로 다시 뽑히면 제자리걸음처럼 보여서,
  // 최근에 나온 두 장은 후보에서 빼 둡니다.
  function hauntOne() {
    var pool = [];
    cards.forEach(function (card) {
      if (card.classList.contains("haunted")) return;
      if (recent.indexOf(card) >= 0) return;
      pool.push(card);
    });

    if (pool.length > 0) {
      var picked = pool[Math.floor(Math.random() * pool.length)];
      picked.classList.add("haunted");

      recent.push(picked);
      while (recent.length > 2) recent.shift();

      var off = setTimeout(function () {
        picked.classList.remove("haunted");
        var at = holdTimers.indexOf(off);
        if (at >= 0) holdTimers.splice(at, 1);
      }, HOLD);
      holdTimers.push(off);
    }

    stepTimer = setTimeout(hauntOne, STEP); // 다음 장은 겹쳐서 이어받습니다
  }

  function wake() {
    clearTimeout(idleTimer);
    clearTimeout(stepTimer);
    clearHaunt();
    idleTimer = setTimeout(hauntOne, IDLE_TIME);
  }

  ["mousemove", "mousedown", "click", "keydown", "wheel", "touchstart"].forEach(function (name) {
    window.addEventListener(name, wake, { passive: true });
  });
  document.addEventListener("scroll", wake, { passive: true });

  // 다른 탭에 가 있는 동안에는 세지 않습니다.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      clearTimeout(idleTimer);
      clearTimeout(stepTimer);
      clearHaunt();
    } else {
      wake();
    }
  });

  wake(); // 페이지가 열리면 30초부터 세기 시작
}


/* ===========================================================
   8-1-3. 조례 글자 모션 (ghost-rules.html)

   법전을 읽어 내려가면 군데군데 글자가 제멋대로 굽니다.
     타이핑 : 글자가 하나씩 차례로 켜집니다. (스크롤할 때마다 다시 재생)
     뒤집힘 : 무작위로 고른 낱말이 통째로 뒤집히고, 그대로 남습니다.

   ▸ 어느 줄에 걸릴지, 어느 낱말이 뒤집힐지는 열 때마다 무작위입니다.
   ▸ 타이핑은 화면에 들어올 때 재생하고 나가면 되돌리므로 오르내릴 때마다
     다시 보입니다. 뒤집힘은 한 번 넘어가면 되돌리지 않습니다.
   ▸ 글자를 <span> 으로 쪼개도 자리가 밀리지 않도록, 숨길 때 opacity 만
     건드리고 폭·줄바꿈에 영향을 주는 값은 쓰지 않습니다.
     (띄어쓰기는 쪼개지 않고 그대로 둡니다.)
   =========================================================== */
function setupOrdinanceMotion() {
  var doc = document.querySelector(".ordinance-doc");
  if (!doc) return; // 이 페이지가 아니면 중단
  if (!("IntersectionObserver" in window)) return;

  // 움직임을 줄이도록 설정한 사용자에게는 걸지 않습니다.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var PICK_LINE = 0.7;  // 줄을 고를 확률
  var PICK_WORD = 0.55; // '뒤집힘'에서 낱말을 고를 확률

  /* 글 안의 텍스트를 조각내어 <span class="ch"> 로 감쌉니다.
     byWord=false : 글자 하나씩 전부 감쌉니다 (타이핑용)
     byWord=true  : 띄어쓰기로 나눈 낱말 중 무작위로 고른 것만 감쌉니다 (뒤집힘용)
     감싸지 않은 부분과 띄어쓰기는 그대로 두어 줄바꿈이 달라지지 않게 합니다. */
  function wrapPieces(el, byWord) {
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    // 1) 먼저 조각을 내고, 감쌀 것을 정합니다.
    //    낱말 단위면 띄어쓰기를 경계로, 글자 단위면 한 글자씩 자릅니다.
    var split = nodes.map(function (node) {
      return (byWord ? node.nodeValue.split(/(\s+)/) : node.nodeValue.split("")).filter(function (p) {
        return p !== "";
      });
    });

    var picks = split.map(function (pieces) {
      return pieces.map(function (piece) {
        if (/^\s+$/.test(piece)) return false;       // 띄어쓰기는 건드리지 않습니다
        return byWord ? Math.random() < PICK_WORD : true;
      });
    });

    // 확률이 낮아 한 낱말도 안 걸리면 줄이 통째로 조용해집니다. 하나는 보장합니다.
    if (byWord) {
      var chosen = 0;
      picks.forEach(function (row) { row.forEach(function (p) { if (p) chosen++; }); });
      if (chosen === 0) {
        var spots = [];
        split.forEach(function (pieces, n) {
          pieces.forEach(function (piece, i) {
            if (!/^\s+$/.test(piece)) spots.push([n, i]);
          });
        });
        if (spots.length) {
          var spot = spots[Math.floor(Math.random() * spots.length)];
          picks[spot[0]][spot[1]] = true;
        }
      }
    }

    // 2) 정한 대로 감쌉니다. 감싸지 않은 조각은 그냥 글자로 둡니다.
    var order = 0;
    nodes.forEach(function (node, n) {
      var frag = document.createDocumentFragment();

      split[n].forEach(function (piece, i) {
        if (!picks[n][i]) {
          frag.appendChild(document.createTextNode(piece));
          return;
        }
        var span = document.createElement("span");
        span.className = "ch";
        span.textContent = piece;
        span.style.setProperty("--i", order++);
        frag.appendChild(span);
      });

      node.parentNode.replaceChild(frag, node);
    });
  }

  var lines = doc.querySelectorAll(".ordinance-article, .ordinance-clause, .ordinance-bullets li");
  var picked = [];

  lines.forEach(function (el) {
    if (Math.random() > PICK_LINE) return;

    var mode = Math.random() < 0.5 ? "type" : "flip";
    wrapPieces(el, mode === "flip");
    el.classList.add("om", "om-" + mode);
    picked.push(el);
  });

  if (picked.length === 0) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var isFlip = entry.target.classList.contains("om-flip");

      if (!entry.isIntersecting) {
        // 타이핑만 되돌려 다시 볼 수 있게 합니다.
        if (!isFlip) entry.target.classList.remove("play");
        return;
      }

      entry.target.classList.add("play");
      // 뒤집힌 낱말은 그대로 두므로 더 볼 필요가 없습니다.
      if (isFlip) io.unobserve(entry.target);
    });
  }, { threshold: 0 });

  picked.forEach(function (el) { io.observe(el); });
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
    image: "images/arc-dongjasam.png",
    art: "left: -15.86%; top: 16.77%; width: 133.83%; height: 87.63%;",
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
    art: "left: -26.39%; top: -3.32%; width: 154.07%; height: 100.88%;",
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
    art: "left: -24.31%; top: 8.54%; width: 124.42%; height: 81.47%;",
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
    art: "left: -12.67%; top: 9.76%; width: 123.29%; height: 80.72%;",
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
    art: "left: -4.58%; top: 10.61%; width: 107.57%; height: 70.43%;",
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
  setupIdleHaunt();
  setupOrdinanceMotion();
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
