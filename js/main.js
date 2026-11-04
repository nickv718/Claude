/* =========================================================
   HERA RENTAL — interactions
   ========================================================= */
(() => {
  "use strict";

  /* ---------- Fleet data (edit here) ---------- */
  // "model" = the vehicle in the photo, shown as "ή παρόμοιο" (or similar).
  const FLEET = [
    { id: "small",  type: "cars", name: "Μικρό αυτοκίνητο",  tag: "Πόλη",            desc: "Ευέλικτο στην πόλη. Εύκολο παρκάρισμα και χαμηλή κατανάλωση για τις καθημερινές σας μετακινήσεις.", img: "car1", model: "Toyota Aygo X", specs: [["Ιδανικό για", "Πόλη"], ["Θέσεις", "4–5"], ["Τύπος", "Mini"]] },
    { id: "medium", type: "cars", name: "Μεσαίο αυτοκίνητο", tag: "Καθημερινότητα",  desc: "Άνεση σε κάθε διαδρομή — από την πόλη μέχρι το ταξίδι του Σαββατοκύριακου.",                     img: "car2", model: "Mercedes-Benz A-Class", specs: [["Ιδανικό για", "Κάθε διαδρομή"], ["Θέσεις", "5"], ["Τύπος", "Hatchback"]] },
    { id: "large",  type: "cars", name: "Μεγάλο αυτοκίνητο", tag: "Ταξίδι",          desc: "Χώρος για κάθε ταξίδι. Περισσότερη άνεση, περισσότερος χώρος, περισσότερη απόλαυση.",            img: "car3", model: "BMW Σειρά 4 Gran Coupé", specs: [["Ιδανικό για", "Ταξίδια"], ["Θέσεις", "5"], ["Τύπος", "Sedan / Coupé"]] },
    { id: "ev",     type: "cars", name: "Ηλεκτρικά",          tag: "Zero emissions",  desc: "Σύγχρονη ηλεκτρική μετακίνηση. Αθόρυβη, οικονομική και φιλική προς το περιβάλλον.",              img: "car5", model: "Tesla Model 3", specs: [["Κινητήρας", "100% ηλεκτρικός"], ["Θέσεις", "5"], ["Εκπομπές", "0 g/km"]] },
    { id: "suv",    type: "cars", name: "Crossover / SUV",    tag: "Υπερυψωμένο",     desc: "Άνεση και υπερυψωμένη οδήγηση, με την ευελιξία που χρειάζεστε σε κάθε δρόμο.",                  img: "car4", model: "Peugeot 408", specs: [["Ιδανικό για", "Οικογένεια"], ["Θέσεις", "5"], ["Τύπος", "Crossover"]] },
    { id: "vanS",   type: "vans", name: "Μικρά Van",          tag: "Επαγγελματικά",   desc: "Ευέλικτες επαγγελματικές λύσεις για διανομές και μεταφορές μέσα στην πόλη.",                      img: "car6", model: "Dacia Dokker Van", specs: [["Χρήση", "Διανομές"], ["Θέσεις", "2"], ["Τύπος", "Μικρό Van"]] },
    { id: "vanM",   type: "vans", name: "Μεσαία Van",         tag: "Επαγγελματικά",   desc: "Περισσότερος χώρος φόρτωσης για την επιχείρησή σας, με την άνεση ενός επιβατικού.",              img: "car7", model: "Opel Vivaro", specs: [["Χρήση", "Μεταφορές"], ["Θέσεις", "3"], ["Τύπος", "Μεσαίο Van"]] },
    { id: "vanL",   type: "vans", name: "Μεγάλα Van",         tag: "Επαγγελματικά",   desc: "Για μετακομίσεις και μεγάλα φορτία. Μέγιστος χώρος, χωρίς συμβιβασμούς.",                       img: "car8", model: "Fiat Ducato", specs: [["Χρήση", "Μετακομίσεις"], ["Θέσεις", "3"], ["Τύπος", "Μεγάλο Van"]] },
  ];

  // Where "Βρείτε όχημα" sends the search. Leave empty to show the email/phone summary.
  // Example: "https://herarental.gr/booking/" → params are appended as a query string.
  const BOOKING_URL = "";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover:hover) and (pointer:fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";

  /* ---------- Build showroom slides ---------- */
  const track = $("#showTrack");
  const index = $("#showIndex");
  FLEET.forEach((v, i) => {
    const s = document.createElement("article");
    s.className = "slide";
    s.dataset.id = v.id;
    s.setAttribute("aria-label", v.name);
    s.innerHTML = `
      <div class="slide__num" aria-hidden="true">${pad(i + 1)}</div>
      <div class="slide__info">
        <div class="slide__tag"><span>${pad(i + 1)} /</span> ${v.tag}</div>
        <h3 class="slide__name">${v.name}</h3>
        <p class="slide__desc">${v.desc}</p>
        <div class="slide__specs">${v.specs.map(([k, val]) => `<div><small>${k}</small><b>${val}</b></div>`).join("")}</div>
        <a href="#booking" class="btn btn--primary magnetic" data-pick="${v.id}"><span>Κράτηση</span><i>→</i></a>
        <p class="slide__model">π.χ. ${v.model} ή παρόμοιο</p>
      </div>
      <div class="slide__stage">
        <div class="slide__car">
          <div class="slide__plat"></div>
          <img src="assets/cars/${v.img}.webp" alt="${v.name} — ${v.model} ή παρόμοιο" loading="${i < 2 ? "eager" : "lazy"}">
          <img class="refl" src="assets/cars/${v.img}.webp" alt="" aria-hidden="true" loading="lazy">
          <div class="slide__hud" aria-hidden="true"><i></i><i></i><i></i><i></i><span>HR-${pad(i + 1)} · ${v.type === "vans" ? "VAN" : "CAR"}</span></div>
        </div>
      </div>`;
    track.appendChild(s);

    const b = document.createElement("button");
    b.type = "button";
    b.textContent = `${pad(i + 1)} ${v.name.split(" ")[0]}`;
    b.dataset.i = i;
    index.appendChild(b);
  });

  /* ---------- Booking form ---------- */
  const form = $("#bookForm");
  const catSel = $("#category");
  const segBtns = $$(".seg__btn");
  const pill = $(".seg__pill");
  let vehType = "cars";

  function fillCategories(type, selectId) {
    catSel.innerHTML = `<option value="">Όλες οι κατηγορίες</option>` +
      FLEET.filter(v => v.type === type).map(v => `<option value="${v.id}">${v.name}</option>`).join("");
    if (selectId) catSel.value = selectId;
  }
  function setType(type, selectId) {
    vehType = type;
    segBtns.forEach(b => {
      const on = b.dataset.type === type;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on);
    });
    movePill();
    fillCategories(type, selectId);
  }
  function movePill() {
    const a = $(".seg__btn.is-active");
    if (!a) return;
    pill.style.width = a.offsetWidth + "px";
    pill.style.transform = `translateX(${a.offsetLeft - 5}px)`;
  }
  segBtns.forEach(b => b.addEventListener("click", () => setType(b.dataset.type)));
  window.addEventListener("resize", movePill);

  // times 08:00–20:00 every 30'
  $$(".time").forEach(sel => {
    for (let h = 8; h <= 20; h++) for (const m of [0, 30]) {
      if (h === 20 && m) continue;
      const t = `${pad(h)}:${pad(m)}`;
      sel.add(new Option(t, t, false, t === "10:00"));
    }
  });

  const dFrom = $("#dFrom"), dTo = $("#dTo");
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = new Date();
  const start = new Date(today); start.setDate(start.getDate() + 1);
  const end = new Date(start); end.setDate(end.getDate() + 4);
  dFrom.min = iso(today); dFrom.value = iso(start);
  dTo.min = iso(start); dTo.value = iso(end);
  function updDays() {
    const a = new Date(dFrom.value), b = new Date(dTo.value);
    if (b <= a) { const n = new Date(a); n.setDate(n.getDate() + 1); dTo.value = iso(n); }
    dTo.min = dFrom.value;
    const days = Math.max(1, Math.round((new Date(dTo.value) - new Date(dFrom.value)) / 864e5));
    $("#days").textContent = days;
    return days;
  }
  dFrom.addEventListener("change", updDays);
  dTo.addEventListener("change", updDays);
  updDays();

  $("#sameReturn").addEventListener("change", e => {
    $("#dropWrap").classList.toggle("is-hidden", e.target.checked);
    $(".book__grid").classList.toggle("has-drop", !e.target.checked);
  });
  // whole field clickable → open native picker
  $$(".fld").forEach(f => f.addEventListener("click", e => {
    const inp = $("input,select", f);
    if (e.target === inp) return;
    if (inp.showPicker) { try { inp.showPicker(); } catch (_) { inp.focus(); } } else inp.focus();
  }));

  const fmt = v => new Date(v).toLocaleDateString("el-GR", { day: "numeric", month: "short", year: "numeric" });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const fd = new FormData(form);
    const cat = FLEET.find(v => v.id === fd.get("category"));
    const data = {
      type: vehType,
      category: fd.get("category") || "",
      pickup: fd.get("pickup"),
      dropoff: $("#sameReturn").checked ? fd.get("pickup") : fd.get("dropoff"),
      from: fd.get("from"), fromTime: fd.get("fromTime"),
      to: fd.get("to"), toTime: fd.get("toTime"),
      age30to65: fd.get("age") ? "yes" : "no",
    };
    if (BOOKING_URL) { location.href = BOOKING_URL + "?" + new URLSearchParams(data); return; }
    const catName = cat ? cat.name : (vehType === "vans" ? "Επαγγελματικό όχημα" : "Αυτοκίνητο");
    const txt = `${catName} · ${fmt(data.from)} ${data.fromTime} → ${fmt(data.to)} ${data.toTime} · ${data.pickup}`;
    $("#bookText").textContent = txt;
    const body = `Γεια σας,\n\nΘα ήθελα προσφορά για ενοικίαση:\n\nΚατηγορία: ${catName}\nΠαραλαβή: ${data.pickup}, ${fmt(data.from)} ${data.fromTime}\nΕπιστροφή: ${data.dropoff}, ${fmt(data.to)} ${data.toTime}\nΗμέρες: ${updDays()}\nΟδηγός 30–65 ετών: ${data.age30to65 === "yes" ? "Ναι" : "Όχι"}\n\nΟνοματεπώνυμο:\nΤηλέφωνο:\n`;
    $("#bookMail").href = `mailto:info@herarental.gr?subject=${encodeURIComponent("Αίτημα κράτησης – " + catName)}&body=${encodeURIComponent(body)}`;
    const r = $("#bookResult");
    r.hidden = false;
    if (hasGsap && !reduce) gsap.fromTo(r, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .5, ease: "power3.out" });
  });

  setType("cars");

  /* ---------- Menu ---------- */
  const burger = $("#burger");
  function toggleMenu(open) {
    const o = open ?? !document.body.classList.contains("menu-open");
    document.body.classList.toggle("menu-open", o);
    burger.setAttribute("aria-expanded", o);
    $("#menu").setAttribute("aria-hidden", !o);
  }
  burger.addEventListener("click", () => toggleMenu());
  $$("#menu a").forEach(a => a.addEventListener("click", () => toggleMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") toggleMenu(false); });

  /* ---------- Open-now indicator (Europe/Athens) ---------- */
  (function openNow() {
    const el = $("#openNow");
    const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Athens", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(new Date());
    const g = t => parts.find(p => p.type === t).value;
    const day = g("weekday"), mins = +g("hour") * 60 + +g("minute");
    const close = ["Sat", "Sun"].includes(day) ? 15 * 60 : 18 * 60;
    const open = mins >= 9 * 60 && mins < close;
    el.classList.add(open ? "is-open" : "is-closed");
    el.textContent = open ? `Ανοιχτά τώρα · κλείνει ${pad(close / 60)}:00` : "Κλειστά τώρα · ανοίγει 09:00";
  })();
  $("#yr").textContent = new Date().getFullYear();

  /* ---------- Reviews drag-to-scroll ---------- */
  (function dragRail() {
    const rail = $("#revRail");
    let down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener("pointerdown", e => { if (e.pointerType !== "mouse") return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add("is-drag"); });
    window.addEventListener("pointermove", e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; rail.scrollLeft = sl - dx; });
    window.addEventListener("pointerup", () => { down = false; rail.classList.remove("is-drag"); });
    rail.addEventListener("click", e => { if (moved) e.preventDefault(); }, true);
  })();

  /* ---------- Without GSAP / reduced motion: graceful fallback ---------- */
  const loader = $("#loader");
  if (!hasGsap || reduce) {
    document.documentElement.classList.add("no-pin");
    loader.style.display = "none";
    document.body.classList.add("is-loaded");
    $$("[data-count]").forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || ""));
    $$("[data-pick]").forEach(a => a.addEventListener("click", () => { const v = FLEET.find(f => f.id === a.dataset.pick); setType(v.type, v.id); }));
    $$("#showIndex button").forEach(b => b.addEventListener("click", () => track.children[b.dataset.i].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })));
    return;
  }

  /* =========================================================
     GSAP
     ========================================================= */
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });

  /* ---------- Loader → intro ---------- */
  const intro = gsap.timeline({ paused: true });
  intro
    .from(".hero__h1 .w", { yPercent: 115, duration: 1.1, stagger: .08, ease: "power4.out" })
    .from(".hero__title .eyebrow", { y: 16, opacity: 0, duration: .7 }, "<.2")
    .fromTo("#heroCar", { xPercent: -130, skewX: -10, filter: "blur(8px)" }, { xPercent: 0, skewX: 0, filter: "blur(0px)", duration: 1.5, ease: "expo.out" }, "<-.2")
    .to(".hero__lights span", { opacity: 1, duration: .15, repeat: 3, yoyo: true, ease: "none" }, "-=.6")
    .to(".hero__lights span", { opacity: .9, duration: .3 })
    .from([".hero__hud > *", ".speedo"], { opacity: 0, y: 10, duration: .6, stagger: .1 }, "-=1")
    .from(".book", { y: 60, opacity: 0, duration: 1 }, "-=.9")
    .add(() => streakBurst(26), 0.5);

  const counter = { v: 0 };
  gsap.to(counter, {
    v: 100, duration: 1.3, ease: "power2.inOut",
    onUpdate() { $("#loaderNum").textContent = pad(Math.round(counter.v), 3); $("#loaderBar").style.width = counter.v + "%"; },
    onComplete() {
      gsap.to(loader, { yPercent: -100, duration: .8, ease: "power4.inOut", onComplete: () => { loader.style.display = "none"; document.body.classList.add("is-loaded"); } });
      intro.play(0);
    },
  });
  loader.style.animation = "none"; // GSAP owns it now

  /* ---------- Light streaks ---------- */
  const streaks = $("#streaks");
  function streakBurst(n) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement("i");
      s.className = "streak";
      const w = gsap.utils.random(80, 380);
      s.style.width = w + "px";
      s.style.top = gsap.utils.random(35, 92) + "%";
      streaks.appendChild(s);
      gsap.fromTo(s, { x: innerWidth + 50, opacity: 0 }, {
        x: -w - 50, opacity: gsap.utils.random(.3, 1), duration: gsap.utils.random(.4, 1.1), delay: gsap.utils.random(0, .9), ease: "none",
        onComplete: () => s.remove(),
      });
    }
  }

  /* ---------- Hero scroll: car accelerates, speedometer ---------- */
  const speedEl = $("#speed"), speedBar = $("#speedBar");
  gsap.timeline({
    scrollTrigger: {
      trigger: ".hero", start: "top top", end: "bottom top", scrub: .6,
      onUpdate(self) {
        const kmh = Math.round(self.progress * 180);
        speedEl.textContent = pad(kmh, 3);
        speedBar.style.width = self.progress * 100 + "%";
        if (Math.abs(self.getVelocity()) > 1200 && Math.random() > .75) streakBurst(3);
      },
    },
  })
    .to(".hero__title", { yPercent: -40, opacity: 0, ease: "none" }, 0)
    .to("#heroCar", { xPercent: 70, scale: 1.25, ease: "power1.in" }, 0)
    .to(".hero__grid", { opacity: .3, ease: "none" }, 0)
    .to(".hero__glow", { scale: 1.4, opacity: .5, ease: "none" }, 0);

  // Mouse parallax on hero car (desktop)
  if (finePointer) {
    const car = $("#heroCar img");
    const rx = gsap.quickTo(car, "rotationY", { duration: .8 }), ry = gsap.quickTo(car, "y", { duration: .8 });
    gsap.set(car, { transformPerspective: 1200 });
    $(".hero").addEventListener("pointermove", e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      rx(nx * 10); ry(ny * 12);
    });
  }

  /* ---------- Header behaviour ---------- */
  const hdr = $("#hdr");
  let lastY = 0;
  ScrollTrigger.create({
    start: 0, end: "max",
    onUpdate(self) {
      const y = self.scroll();
      hdr.classList.toggle("is-scrolled", y > 40);
      hdr.classList.toggle("is-hidden", y > 400 && y > lastY && !document.body.classList.contains("menu-open"));
      lastY = y;
      $("#fab").classList.toggle("is-visible", y > innerHeight * 1.2 && !inView($("#booking")) && !inView($("#contact")) && !inView($(".show__pin"), .5));
    },
  });
  function inView(el, f = 0) { const r = el.getBoundingClientRect(); return r.top < innerHeight * (1 - f) && r.bottom > innerHeight * f; }

  // active nav link
  $$(".hdr__nav a").forEach(a => {
    const sec = $(a.getAttribute("href"));
    if (!sec) return;
    ScrollTrigger.create({ trigger: sec, start: "top 50%", end: "bottom 50%", onToggle: s => a.classList.toggle("is-active", s.isActive) });
  });

  /* ---------- Marquee: constant drift + scroll velocity skew ---------- */
  const mq = $("#marquee");
  const mqLoop = gsap.to(mq, { xPercent: -50, duration: 28, ease: "none", repeat: -1 });
  let skew = gsap.quickTo(mq, "skewX", { duration: .4 });
  ScrollTrigger.create({
    trigger: ".marquee", start: "top bottom", end: "bottom top",
    onUpdate(self) {
      const v = self.getVelocity();
      mqLoop.timeScale(gsap.utils.clamp(-6, 6, 1 + v / 400));
      skew(gsap.utils.clamp(-12, 12, v / -250));
    },
    onLeave: () => { mqLoop.timeScale(1); skew(0); },
    onLeaveBack: () => { mqLoop.timeScale(1); skew(0); },
  });

  /* ---------- Showroom: pinned horizontal scroll ---------- */
  const slides = $$(".slide");
  const idxBtns = $$("#showIndex button");
  const N = slides.length;
  let active = -1;
  function setActive(i) {
    if (i === active) return;
    active = i;
    idxBtns.forEach((b, j) => b.classList.toggle("is-active", j === i));
    $("#showCount").textContent = `${pad(i + 1)} / ${pad(N)}`;
  }
  const dist = () => track.scrollWidth - innerWidth;
  const showTween = gsap.to(track, {
    x: () => -dist(), ease: "none",
    scrollTrigger: {
      trigger: ".showroom", pin: ".show__pin", start: "top top",
      end: () => "+=" + dist() * 1.1, scrub: .8, invalidateOnRefresh: true, anticipatePin: 1,
      snap: { snapTo: 1 / (N - 1), duration: { min: .2, max: .6 }, delay: .08, ease: "power2.inOut" },
      onUpdate(self) {
        $("#showProg").style.width = (12.5 + self.progress * 87.5) + "%";
        setActive(Math.round(self.progress * (N - 1)));
      },
    },
  });
  setActive(0);

  slides.forEach(s => {
    const car = $(".slide__car", s), num = $(".slide__num", s), info = $(".slide__info", s);
    gsap.set(car, { transformPerspective: 1400 });
    gsap.timeline({ scrollTrigger: { trigger: s, containerAnimation: showTween, start: "left right", end: "right left", scrub: true } })
      .fromTo(car, { xPercent: 45, rotationY: -30, scale: .78 }, { xPercent: 0, rotationY: 0, scale: 1, ease: "power1.out" })
      .to(car, { xPercent: -45, rotationY: 30, scale: .78, ease: "power1.in" });
    gsap.fromTo(num, { xPercent: -30 }, { xPercent: 30, ease: "none",
      scrollTrigger: { trigger: s, containerAnimation: showTween, start: "left right", end: "right left", scrub: true } });
    gsap.from($$(".slide__tag, .slide__name, .slide__desc, .slide__specs, .slide .btn, .slide__model", info), {
      y: 40, opacity: 0, stagger: .06, duration: .7,
      scrollTrigger: { trigger: s, containerAnimation: showTween, start: "left 60%", toggleActions: "play none none reverse" },
    });
  });
  // first slide content should be visible immediately when pinned
  ScrollTrigger.create({ trigger: ".showroom", start: "top 70%", once: true,
    onEnter: () => gsap.to($$(".slide__info > *", slides[0]), { y: 0, opacity: 1, stagger: .06, duration: .7, overwrite: true }) });

  function goToSlide(i) {
    const st = showTween.scrollTrigger;
    const y = st.start + (st.end - st.start) * (i / (N - 1));
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  idxBtns.forEach(b => b.addEventListener("click", () => goToSlide(+b.dataset.i)));

  // "Κράτηση" on a car → preselect category
  $$("[data-pick]").forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const v = FLEET.find(f => f.id === a.dataset.pick);
    setType(v.type, v.id);
    const y = $("#booking").getBoundingClientRect().top + scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
    gsap.fromTo(".fld-cat", { boxShadow: "inset 0 0 0 2px #ff5a00" }, { boxShadow: "inset 0 0 0 1px rgba(255,255,255,.09)", duration: 2, delay: .8, clearProps: "boxShadow" });
  }));

  /* ---------- Generic reveals ---------- */
  $$(".reveal").forEach(el => {
    // split into lines by <br>, wrap words
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(l =>
      `<span style="display:block;overflow:hidden;padding-bottom:.06em"><span class="rv" style="display:inline-block">${l}</span></span>`).join("");
    gsap.from($$(".rv", el), { yPercent: 110, duration: 1, stagger: .1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 85%" } });
  });
  $$(".eyebrow").forEach(el => { if (el.closest(".hero")) return;
    gsap.from(el, { x: -20, opacity: 0, duration: .8, scrollTrigger: { trigger: el, start: "top 90%" } }); });

  // counters
  $$("[data-count]").forEach(el => {
    const o = { v: 0 }, to = +el.dataset.count, suf = el.dataset.suffix || "";
    gsap.to(o, { v: to, duration: 1.8, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 88%" },
      onUpdate: () => el.textContent = Math.round(o.v) + suf });
  });

  gsap.from(".feat", { y: 60, opacity: 0, duration: .9, stagger: .08, scrollTrigger: { trigger: ".feats", start: "top 82%" } });

  /* ---------- HERA FLEX: old car → new car swap on scroll ---------- */
  const flexTl = gsap.timeline({ scrollTrigger: { trigger: ".flex", start: "top 65%", end: "bottom 60%", scrub: .8 } });
  flexTl
    .fromTo(".flex__bigtext", { xPercent: 10 }, { xPercent: -40, ease: "none", duration: 1 }, 0)
    .fromTo(".flex__car--old", { xPercent: -50, opacity: 1 }, { xPercent: -160, opacity: 0, ease: "power2.in", duration: .45 }, .25)
    .fromTo(".flex__car--new", { xPercent: 60, opacity: 0 }, { xPercent: -50, opacity: 1, ease: "power2.out", duration: .45 }, .45)
    .fromTo(".flex__visual", { rotation: -8 }, { rotation: 0, ease: "none", duration: 1 }, 0);
  gsap.from(".flex__title, .flex__steps li, .flex .btn", { y: 50, opacity: 0, duration: .9, stagger: .08, scrollTrigger: { trigger: ".flex__copy", start: "top 75%" } });

  /* ---------- Reviews / CTA / Footer ---------- */
  gsap.from(".rev", { x: 120, opacity: 0, duration: 1, stagger: .08, scrollTrigger: { trigger: ".rev-rail", start: "top 85%" } });
  gsap.from(".cta__phone span", { yPercent: 100, opacity: 0, duration: 1, stagger: .1, ease: "power4.out", scrollTrigger: { trigger: ".cta", start: "top 70%" } });
  gsap.fromTo(".ftr__huge", { yPercent: 60 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: ".ftr", start: "top bottom", end: "bottom bottom", scrub: true } });

  /* ---------- Desktop: cursor, magnetic buttons, tilt cards ---------- */
  if (finePointer) {
    const cur = $("#cursor");
    const cx = gsap.quickTo(cur, "x", { duration: .25, ease: "power3" }), cy = gsap.quickTo(cur, "y", { duration: .25, ease: "power3" });
    window.addEventListener("pointermove", e => { cx(e.clientX); cy(e.clientY); });
    document.addEventListener("pointerover", e => cur.classList.toggle("is-hover", !!e.target.closest("a,button,select,input,label,.rev")));

    $$(".magnetic").forEach(m => {
      const mx = gsap.quickTo(m, "x", { duration: .5, ease: "elastic.out(1,.4)" }), my = gsap.quickTo(m, "y", { duration: .5, ease: "elastic.out(1,.4)" });
      m.addEventListener("pointermove", e => { const r = m.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .25); my((e.clientY - r.top - r.height / 2) * .35); });
      m.addEventListener("pointerleave", () => { mx(0); my(0); });
    });

    $$(".tilt").forEach(c => {
      gsap.set(c, { transformPerspective: 900 });
      const rx = gsap.quickTo(c, "rotationX", { duration: .5 }), ry = gsap.quickTo(c, "rotationY", { duration: .5 });
      c.addEventListener("pointermove", e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty("--mx", x * 100 + "%"); c.style.setProperty("--my", y * 100 + "%");
        rx((.5 - y) * 8); ry((x - .5) * 10);
      });
      c.addEventListener("pointerleave", () => { rx(0); ry(0); });
    });
  }

  // smooth anchor scrolling
  $$('a[href^="#"]:not([data-pick])').forEach(a => a.addEventListener("click", e => {
    const t = $(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    window.scrollTo({ top: t.getBoundingClientRect().top + scrollY - (a.getAttribute("href") === "#booking" ? 90 : 0), behavior: "smooth" });
  }));

  window.addEventListener("load", () => { ScrollTrigger.refresh(); movePill(); });
})();
