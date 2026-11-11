/* =========================================================
   최예지 포트폴리오 — 동작
   ---------------------------------------------------------
   1. 공통 준비
   2. 반짝이 · 꽃잎 만들기
   3. 문 클릭 → 원이 번지며 세계로 이동
   4. 세계 페이지 그리기
   5. 기획서 뷰어 (스크롤·버튼으로 넘기기)
   6. 영상 창 · 기획서 확대 창
   7. 키보드 (Esc 닫기, 방향키 넘기기)
   8. 프로필 (세계 하단 카드 · 입구 프로필 창)
   9. 타이틀 i 위에 별 놓기
   10. 입구 그림을 화면 높이에 맞추기
   ========================================================= */


/* ===== 1. 공통 준비 ===== */
var WORLDS = { pink: PINK, blue: BLUE };          /* js/data.js의 내용 */
var $ = function (s) { return document.querySelector(s); };
var W = $("#w"), M = $("#m"), MB = $("#mb");
var reduceMotion = matchMedia("(prefers-reduced-motion:reduce)").matches;
var desktop = matchMedia("(min-width:901px) and (hover:hover)");  /* 넓은 화면 + 마우스: 스크롤로 기획서 넘김 */
var cur = "pink", IDX = 0, N = 0, pin = null;


/* ===== 2. 반짝이 · 꽃잎 만들기 =====
   fx(넣을 곳, 반짝이 개수, 꽃잎 개수) */
function fx(el, sparkles, petals) {
  if (!el || reduceMotion) return;
  var h = "", i;
  for (i = 0; i < sparkles; i++) h += '<span class="sp" style="left:' + Math.random() * 100 + '%;top:' + Math.random() * 100 + '%;--s:' + (4 + Math.random() * 8) + 'px;animation-delay:-' + Math.random() * 3 + 's;animation-duration:' + (2 + Math.random() * 3) + 's"></span>';
  for (i = 0; i < petals; i++) h += '<span class="pt" style="left:' + Math.random() * 100 + '%;animation-duration:' + (9 + Math.random() * 8) + 's;animation-delay:-' + Math.random() * 12 + 's"></span>';
  el.innerHTML = h;
}
document.querySelectorAll("#entry .fx").forEach(function (e) { fx(e, 18, 8); });


/* ===== 3. 문 클릭 → 원이 번지며 세계로 이동 ===== */
function go(k, x, y) {
  var cv = $("#cv"), pk = k === "pink";
  if (reduceMotion) { show(k); return; }
  cv.style.cssText = "opacity:1;background:" + (pk ? "#FFD0E0" : "#2A6FD6");   /* 번지는 원 색 */
  var from = "circle(0 at " + x + "px " + y + "px)", to = "circle(150% at " + x + "px " + y + "px)";
  cv.animate([{ clipPath: from }, { clipPath: to }], { duration: pk ? 750 : 600, easing: "cubic-bezier(.7,0,.3,1)", fill: "forwards" }).onfinish = function () {
    show(k);
    cv.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450, fill: "forwards" }).onfinish = function () { cv.style.opacity = 0; };
  };
}
document.querySelectorAll(".hit").forEach(function (h) {
  h.onclick = function (e) {
    var r = h.getBoundingClientRect();
    go(h.dataset.w, e.detail ? e.clientX : r.left + r.width / 2, e.detail ? e.clientY : r.top + r.height / 2);
  };
});


/* ===== 4. 세계 페이지 그리기 ===== */
function show(k) {
  cur = k;
  var d = WORLDS[k], other = k === "pink" ? "blue" : "pink";
  N = d.docs.length; IDX = -1;

  var scenes = d.scenes.map(function (s, i) {
    return '<figure><img src="' + s[0] + '" alt="장면 ' + (i + 1) + '" loading="lazy"><figcaption class="mo">' + String(i + 1).padStart(2, "0") + '</figcaption></figure>';
  }).join("");
  var chapters = d.chapters.map(function (c) { return '<button class="ch" data-i="' + c[1] + '">' + c[0] + '</button>'; }).join("");

  W.dataset.w = k;
  W.innerHTML =
    '<div class="fx"></div>' +
    /* 상단 바 */
    '<div class="bar"><button id="bk">입구</button><button id="ot">' + d.otherLabel + '</button></div>' +
    /* 영상 썸네일 + 제목 */
    '<div class="scr">' +   /* 첫 화면: 썸네일 + 정보 + 띠지 (화면 높이만큼 차지) */
    '<div class="wrap hero">' +
      '<div class="gl tw"><button class="thumb" id="th" aria-label="영상 재생"><img src="' + d.thumbnail + '" alt="' + d.title + ' 영상 썸네일"><span class="play"></span></button></div>' +
      '<div class="it"><h2 class="t">' + d.title + '</h2><p class="lead">' + d.subtitle + '</p>' +
        '<div class="intent"><span>기획 의도</span><p>' + d.point + '</p></div>' +   /* 기획 의도 (제목과 정보 카드 사이) */
        /* 작품 정보 (역할 · 툴 · 기간) — 툴은 data.js의 " · " 기준으로 배지가 돼요 */
        '<dl class="meta"><dt>역할</dt><dd>' + d.role + '</dd>' +
        '<dt>툴</dt><dd>' + d.tools.split(" · ").map(function (t) { return '<span class="tb">' + t + '</span>'; }).join("") + '</dd>' +
        '<dt>기간</dt><dd>' + d.period + '</dd></dl></div>' +
    '</div>' +
    /* 움직이는 띠지 (끊김 없이 돌도록 두 번 이어 붙임) */
    '<div class="strip" aria-label="영상 속 장면"><div class="tr">' + scenes + scenes + '</div></div>' +
    '</div>' +
    '<div class="wrap">' +
      /* 기획서 뷰어 */
      '<div class="sec"><h3>기획서</h3><div id="pin"><div class="stg">' +
        '<div class="chs" id="chs">' + chapters + '</div>' +
        '<div class="sl" id="sl"><button class="nv p" aria-label="이전 장">‹</button><img alt=""><button class="nv n" aria-label="다음 장">›</button></div>' +
        '<div class="pg"><i id="pgi"></i><span class="mo" id="pgn"></span></div>' +
        '<p class="hint">이미지를 누르면 크게 볼 수 있어요</p>' +
      '</div></div>' +
      (d.note ? '<p class="note">' + d.note + '</p>' : '') +   /* 작품 안내 문구 (기획서 바로 아래) */
      '</div>' +
      /* 프로필 카드 + 더 많은 작품 버튼 */
      profileCard() +
      '<div class="morew"><button class="more" id="more">더 많은 작품이 궁금하다면?</button></div>' +
    '</div>';

  $("#entry").style.display = "none";
  W.style.display = "block";
  $("#pb").style.display = "none"; profile(false);   /* 프로필 버튼은 입구에서만 */
  fx($("#w>.fx"), 16, 6);
  scrollTo(0, 0);
  pin = $("#pin"); layViewer(); setPage(0, false);

  /* 버튼 연결 */
  $("#bk").onclick = function () { W.style.display = "none"; $("#entry").style.display = "block"; $("#pb").style.display = ""; profile(false); stars(); fitEntry(); };
  $("#ot").onclick = function (e) { var r = e.currentTarget.getBoundingClientRect(); go(other, r.left + r.width / 2, r.top + r.height / 2); };
  $("#th").onclick = openVideo;
  $("#chs").onclick = function (e) { var b = e.target.closest(".ch"); if (b) nav(+b.dataset.i); };
  $("#sl .p").onclick = function (e) { e.stopPropagation(); nav(IDX - 1); };
  $("#sl .n").onclick = function (e) { e.stopPropagation(); nav(IDX + 1); };
  $("#sl img").onclick = function () { $("#z img").src = this.src; $("#z").classList.add("on"); };
  var sx = 0;   /* 모바일: 옆으로 밀어서 넘기기 */
  $("#sl").addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
  $("#sl").addEventListener("touchend", function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) nav(IDX + (dx < 0 ? 1 : -1)); });
  $("#more").onclick = function () { toast("작품 목록 페이지는 준비 중이에요"); };   /* 작품 목록 페이지가 생기면 여기서 연결 */
}


/* ===== 5. 기획서 뷰어 =====
   좌우 화살표, 챕터 버튼, 키보드 방향키(←→), 모바일 밀기로 넘겨요 */
function layViewer() { if (pin) pin.style.height = "auto"; }

function setPage(i, animate) {
  i = Math.max(0, Math.min(N - 1, i));
  if (i === IDX) return;
  var old = IDX; IDX = i;
  var im = $("#sl img");
  im.src = WORLDS[cur].docs[i];
  im.alt = "기획서 " + (i + 1) + "쪽";
  if (animate && !reduceMotion && old >= 0) {
    im.animate(cur === "pink"
      ? [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }]                       /* 분홍: 아래에서 떠오름 */
      : [{ opacity: 0, transform: "translateX(" + (i > old ? 40 : -40) + "px)" }, { opacity: 1, transform: "none" }], /* 파랑: 옆에서 밀려옴 */
      { duration: cur === "pink" ? 450 : 220, easing: "ease-out" });
  }
  var on = 0;
  WORLDS[cur].chapters.forEach(function (c, j) { if (i >= c[1]) on = j; });
  document.querySelectorAll(".ch").forEach(function (b, j) { b.classList.toggle("on", j === on); });
  $("#pgi").style.setProperty("--f", ((i + 1) / N * 100) + "%");
  $("#pgn").textContent = (i + 1) + " / " + N;
}
function nav(i) { setPage(i, true); }


/* ===== 6. 영상 창 · 기획서 확대 창 ===== */
function openVideo() {
  var v = WORLDS[cur].video;
  MB.innerHTML = !v
    ? '<img src="' + WORLDS[cur].thumbnail + '" alt=""><p>영상 링크를 연결하면 이곳에서 재생돼요</p>'
    : /\.mp4$/.test(v)
      ? '<video src="' + v + '" controls autoplay playsinline></video>'
      : '<iframe src="https://www.youtube.com/embed/' + v + '?autoplay=1" allow="autoplay;fullscreen" allowfullscreen title="영상"></iframe>';
  MB.style.setProperty("--r", cur === "pink" ? "28px" : "6px");
  M.classList.add("on");
  if (!reduceMotion) MB.animate(cur === "pink"
    ? [{ opacity: 0, transform: "translateY(40px) scale(.9)" }, { opacity: 1, transform: "none" }]
    : [{ opacity: 0, transform: "scaleX(.85)" }, { opacity: 1, transform: "none" }],
    { duration: cur === "pink" ? 550 : 220, easing: "ease-out" });
  $("#mx").focus();
}
function closeVideo() { M.classList.remove("on"); MB.innerHTML = ""; }
function closeZoom() { $("#z").classList.remove("on"); }
$("#mx").onclick = closeVideo;
M.onclick = function (e) { if (e.target === M) closeVideo(); };
$("#zx").onclick = closeZoom;
$("#z").onclick = function (e) { if (e.target.tagName !== "BUTTON") closeZoom(); };


/* ===== 7. 키보드 ===== */
addEventListener("keydown", function (e) {
  if (e.key === "Escape") { closeVideo(); closeZoom(); profile(false); return; }
  if (pin && W.style.display === "block" && !M.classList.contains("on") && !$("#z").classList.contains("on")) {
    if (e.key === "ArrowRight") nav(IDX + 1);
    if (e.key === "ArrowLeft") nav(IDX - 1);
  }
});


/* ===== 8. 프로필 (세계 하단 카드 · 입구의 프로필 창) =====
   내용은 js/data.js의 SITE.profile에서 가져와요 */
function profileCard() {
  var p = SITE.profile;
  var badges = function (list, cls) { return list.map(function (t) { return '<span class="bd' + (cls || "") + '">' + t + '</span>'; }).join(""); };
  return '<section class="pf"><h3>프로필</h3><div class="pfc gl">' +
    /* 위: 사진 | 소개 + 스킬 */
    '<div class="pfa">' +
      '<img class="pfi" src="' + p.photo + '" alt="' + p.name + ' 캐릭터 일러스트">' +
      '<div><p class="pfn">' + p.name + '</p><p class="pft">' + p.title + '</p><p class="pfr">' + p.sub + '</p>' +
      '<p class="pfe"><span class="mo">Contact :</span> ' + SITE.email + '</p><p class="pfq">' + p.intro + '</p>' +
      '<div class="sk">' + p.skills.map(function (s) { return '<div><b>' + s[0] + '</b><div>' + badges(s[1]) + '</div></div>'; }).join("") + '</div></div>' +
    '</div>' +
    /* 아래: 경력 | 교육 */
    '<div class="pfg"><div>' +
      '<p class="pfh">경력</p><ul class="pfl">' + p.careers.map(function (c) {
        return '<li><span class="per mo">' + c[0] + '</span><b>' + c[1] + '</b><small>' + c[2] + '</small>' + (c[3].length ? '<div>' + badges(c[3], " m") + '</div>' : '') + '</li>';
      }).join("") + '</ul>' +
    '</div><div>' +
      '<p class="pfh">교육</p><ul class="pfl">' + p.education.map(function (e) {
        return '<li><span class="per mo">' + e[0] + '</span><b>' + e[1] + '</b><small>' + e[3] + '</small>' + (e[2] ? '<small class="full">' + e[2] + '</small>' : '') + '</li>';
      }).join("") + '</ul>' +
    '</div></div>' +
  '</div></section>';
}
function fillProfilePanel() {
  var p = SITE.profile;
  $("#pp").innerHTML = '<h4>' + p.name + '</h4><p class="pi">' + p.title + '<br>' + p.sub + '</p><p class="l">' + p.intro + '</p><ul>' +
    p.careers.map(function (c) { return '<li><b>' + c[1] + '</b><small>' + c[0] + ' · ' + c[2] + '</small></li>'; }).join("") +
    '<li><a href="mailto:' + SITE.email + '">' + SITE.email + '</a></li></ul>';
}
fillProfilePanel();
function toast(msg) {   /* 화면 아래 잠깐 뜨는 안내 */
  var t = $("#toast");
  if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add("on");
  clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove("on"); }, 2200);
}
function profile(open) {
  var p = $("#pp");
  p.classList.toggle("on", open === undefined ? !p.classList.contains("on") : open);
  $("#pb").setAttribute("aria-expanded", p.classList.contains("on"));
}
$("#pb").onclick = function () { profile(); };


/* ===== 9. 타이틀 i 위에 별 놓기 =====
   글자 위치를 재서 별을 놓아요. .62 = 글자 너비 중 가로 위치, .3 = 높이 중 세로 위치, .025 = 오른쪽 미세 조정 */
var STAR = '<svg viewBox="0 0 24 24"><path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" fill="#fff"/></svg>';
function stars() {
  document.querySelectorAll(".tt").forEach(function (tt) {
    if (!tt.offsetParent) return;
    tt.querySelectorAll(".sx").forEach(function (e) { e.remove(); });
    var node = tt.querySelector(".rest").firstChild, text = node.textContent, r0 = tt.getBoundingClientRect(), fs = parseFloat(getComputedStyle(tt).fontSize);
    for (var i = 0; i < text.length; i++) {
      if (text[i] !== "i") continue;
      var rg = document.createRange(); rg.setStart(node, i); rg.setEnd(node, i + 1);
      var r = rg.getBoundingClientRect(), e = document.createElement("span");
      e.className = "sx"; e.innerHTML = STAR;
      e.style.left = (r.left + r.width * .62 - r0.left + fs * .025) + "px";
      e.style.top = (r.top + r.height * .3 - r0.top) + "px";
      tt.appendChild(e);
    }
  });
}


/* ===== 10. 입구 그림을 화면 높이에 맞추기 =====
   화면이 낮아 안내 창이 잘리면: ① 그림을 위로 올리고 ② 그래도 넘치면 안내 창을 끌어올려요 */
function fitEntry() {
  document.querySelectorAll("#entry .st").forEach(function (st) {
    if (!st.offsetParent) return;
    st.style.setProperty("--sy", "0px"); st.style.setProperty("--lm", "0px");
    var bottom = function () { var b = 0; st.querySelectorAll(".lb").forEach(function (l) { b = Math.max(b, l.getBoundingClientRect().bottom); }); return b; };
    var over = bottom() - (innerHeight - 16), maxShift = Math.max(0, (st.getBoundingClientRect().height - innerHeight) / 2);
    st.style.setProperty("--sy", Math.max(0, Math.min(over, maxShift)) + "px");
    var rest = bottom() - (innerHeight - 16);
    if (rest > 0) st.style.setProperty("--lm", rest + "px");
  });
}

var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
fontsReady.then(function () { stars(); fitEntry(); });
addEventListener("resize", function () { stars(); fitEntry(); });
fitEntry();
