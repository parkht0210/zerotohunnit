(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (str) => String(str).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));

  /* ---------- Stats ---------- */
  const stats = $("#stats");
  if (stats && window.SITE) {
    stats.innerHTML = SITE.stats
      .map((s) => `<li><strong>${esc(s.num)}<small>${esc(s.unit)}</small></strong><span>${esc(s.label)}</span></li>`)
      .join("");
  }

  /* ---------- Nav ---------- */
  const nav = $(".nav");
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  const toTop = $(".to-top");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }));
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);
    toTop.classList.toggle("is-show", window.scrollY > 800);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // 현재 섹션 메뉴 강조
  const links = $$('.nav__menu a[href^="#"]:not(.btn)');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-current", l.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const t = $(l.getAttribute("href")); if (t) spy.observe(t); });

  /* ---------- Lecture tabs ---------- */
  const tabs = $$(".tab");
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((t) => { t.classList.toggle("is-active", t === tab); t.setAttribute("aria-selected", t === tab); });
    $$(".panel").forEach((p) => { p.hidden = p.id !== tab.dataset.tab; p.classList.toggle("is-active", !p.hidden); });
  }));

  /* ---------- Orgs ---------- */
  const orgs = $("#orgs");
  if (orgs && window.ORGS) orgs.innerHTML = ORGS.map((o) => `<span>${esc(o)}</span>`).join("");

  /* ---------- Image placeholders ---------- */
  function loadPh(el) {
    const src = el.dataset.img;
    if (!src) return;
    el.dataset.label = src.split("/").pop();
    const img = new Image();
    img.onload = () => { el.style.backgroundImage = `url("${src}")`; el.classList.add("is-loaded"); };
    img.src = src;
  }

  /* ---------- Consulting cases ---------- */
  const TYPE_LABEL = { system: "노션 업무 시스템", homepage: "회사 홈페이지", portfolio: "포트폴리오" };
  const casesEl = $("#cases");
  function renderCases(filter) {
    const list = (window.CASES || []).filter((c) => filter === "all" || c.type === filter);
    casesEl.innerHTML = list.map((c) => `
      <article class="case">
        <div class="ph" data-img="${esc(c.img || "")}"></div>
        <div class="case__body">
          <p class="case__type">${esc(TYPE_LABEL[c.type] || "")}</p>
          <h4>${esc(c.title)}</h4>
          <p class="case__client">${esc(c.client)}</p>
          <p>${esc(c.desc)}</p>
          <ul class="chips">${(c.tags || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </div>
      </article>`).join("");
    $$(".ph", casesEl).forEach(loadPh);
  }
  if (casesEl) renderCases("all");

  /* ---------- Lecture history ---------- */
  const PAGE = 16;
  const historyEl = $("#history");
  const moreBtn = $("#historyMore");
  const countEl = $("#lectureCount");
  let lecFilter = "all";
  let shown = PAGE;
  function renderHistory() {
    const list = (window.LECTURES || []).filter((l) => lecFilter === "all" || l.c.includes(lecFilter));
    historyEl.innerHTML = list.map((l, i) => `
      <li${i >= shown ? " hidden" : ""}>
        <time>${esc(l.d)}</time>
        <div><strong>${esc(l.t)}</strong>${l.o ? `<small>${esc(l.o)}</small>` : ""}</div>
      </li>`).join("");
    countEl.textContent = `${list.length}건 표시`;
    moreBtn.hidden = list.length <= PAGE;
    moreBtn.textContent = shown >= list.length ? "접기" : `더보기 (${list.length - shown}건)`;
  }
  if (historyEl) {
    renderHistory();
    moreBtn.addEventListener("click", () => {
      const total = historyEl.children.length;
      if (shown >= total) { shown = PAGE; renderHistory(); $("#lectureFilter").scrollIntoView({ block: "start" }); }
      else { shown += PAGE * 2; renderHistory(); }
    });
  }

  /* ---------- Filters ---------- */
  function bindFilter(wrapSel, cb) {
    const wrap = $(wrapSel);
    if (!wrap) return;
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest(".chip-btn");
      if (!b) return;
      $$(".chip-btn", wrap).forEach((x) => x.classList.toggle("is-active", x === b));
      cb(b.dataset.filter);
    });
  }
  bindFilter("#caseFilter", renderCases);
  bindFilter("#lectureFilter", (f) => { lecFilter = f; shown = PAGE; renderHistory(); });

  /* ---------- Reviews ---------- */
  const REVIEW_PAGE = 6;
  const reviewsEl = $("#reviews");
  const reviewMore = $("#reviewMore");
  let revFilter = "all";
  let revShown = REVIEW_PAGE;
  function renderReviews() {
    const CAT = window.CATEGORIES || {};
    const list = (window.REVIEWS || []).filter((r) => revFilter === "all" || r.c === revFilter);
    reviewsEl.innerHTML = list.map((r, i) => `
      <article class="review"${i >= revShown ? " hidden" : ""}>
        <div class="review__quote" aria-hidden="true">“</div>
        <p class="review__hl">${esc(r.hl)}</p>
        <p class="review__body">${esc(r.body)}</p>
        <div class="review__foot">
          <div>
            <p class="review__who">${esc(r.role)} : ${esc(r.who)}</p>
            <p class="review__course">${esc(r.org)} · ${esc(r.course)} · ${esc(r.d)}</p>
          </div>
          <span class="review__tag">${esc((CAT[r.c] || {}).label || "")}</span>
        </div>
      </article>`).join("");
    reviewMore.hidden = list.length <= REVIEW_PAGE;
    reviewMore.textContent = revShown >= list.length ? "접기" : `후기 더보기 (${list.length - revShown}개)`;
  }
  if (reviewsEl) {
    renderReviews();
    reviewMore.addEventListener("click", () => {
      const total = reviewsEl.children.length;
      if (revShown >= total) { revShown = REVIEW_PAGE; renderReviews(); $("#review").scrollIntoView(); }
      else { revShown = total; renderReviews(); }
    });
  }
  bindFilter("#reviewFilter", (f) => { revFilter = f; revShown = REVIEW_PAGE; renderReviews(); });

  $$(".ph[data-img]").forEach(loadPh);

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Contact form ---------- */
  const form = $("#contactForm");
  const msg = $("#formMsg");
  const FIELDS = [["name", "이름"], ["org", "소속"], ["email", "이메일"], ["phone", "연락처"], ["category", "문의 분야"],
    ["schedule", "희망 일정"], ["target", "예상 인원·대상"], ["budget", "예산 범위"], ["message", "문의 내용"]];

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form__msg";
    let ok = true;
    $$("[required]", form).forEach((el) => {
      const bad = el.type === "checkbox" ? !el.checked : !el.value.trim() || (el.type === "email" && !el.checkValidity());
      el.classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = "필수 항목(*)과 개인정보 수집 동의를 확인해 주세요."; msg.classList.add("is-err"); return; }

    const data = Object.fromEntries(new FormData(form));
    const endpoint = (window.SITE && SITE.formEndpoint) || "";

    if (endpoint) {
      try {
        const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error();
        form.reset();
        msg.textContent = "문의가 접수되었어요. 2영업일 안에 회신드릴게요!";
        msg.classList.add("is-ok");
      } catch {
        msg.textContent = "전송에 실패했어요. 잠시 후 다시 시도하거나 이메일로 문의해 주세요.";
        msg.classList.add("is-err");
      }
      return;
    }

    // formEndpoint가 비어 있으면 메일 앱으로 연결
    const subject = `[제로투헌잇 문의] ${data.category} - ${data.name}${data.org ? " (" + data.org + ")" : ""}`;
    const body = FIELDS.map(([k, label]) => `■ ${label}\n${data[k] || "-"}`).join("\n\n");
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    msg.textContent = "메일 앱이 열리면 내용을 확인한 뒤 발송해 주세요.";
    msg.classList.add("is-ok");
  });
  $$("input, select, textarea", form).forEach((el) => el.addEventListener("input", () => el.classList.remove("is-invalid")));
})();
