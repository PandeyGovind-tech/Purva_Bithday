// ===============================
// PURVA WEBSITE CUSTOMIZATION
// ===============================
const musicFile    = "music/birthday-song.mp3"; // Put your song at this path.
// ===============================

const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- Images: hide broken ones so the placeholder shows; keep natural ratio in gallery ---- */
$$('img').forEach(im => {
  const ok = () => { const f = im.closest('.nat'); if (f) f.style.aspectRatio = 'auto'; };
  im.addEventListener('error', () => im.style.display = 'none');
  im.addEventListener('load', ok);
  if (im.complete) im.naturalWidth ? ok() : im.style.display = 'none';
});

/* ---- Music (never forced; first click/tap tries to start it) ---- */
const audio = new Audio(musicFile); audio.loop = true; audio.volume = .6;
const mb = $('#music'); let armed = true;
const setM = on => { mb.classList.toggle('on', on); mb.setAttribute('aria-pressed', on); };
audio.addEventListener('play', () => setM(true)); audio.addEventListener('pause', () => setM(false));
const tryPlay = () => audio.play().catch(() => {});
mb.addEventListener('click', () => { armed = false; audio.paused ? tryPlay() : audio.pause(); });
addEventListener('pointerdown', e => { if (armed && !e.target.closest('#music')) { armed = false; tryPlay(); } });

/* ---- Navigation ---- */
const nav = $('#nav'), bg = $('.hero-bg');
addEventListener('scroll', () => {
  nav.classList.toggle('show', scrollY > innerHeight * .6);
  if (!calm && scrollY < innerHeight) bg.style.transform = `translateY(${scrollY * .3}px)`; // parallax
}, { passive: true });
$('#burger').onclick = () => nav.classList.toggle('open');
$$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
const spy = new IntersectionObserver(es => es.forEach(e => e.isIntersecting &&
  $$('#nav a').forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + e.target.id))), { rootMargin: '-45% 0px -50% 0px' });
$$('#nav a').forEach(a => { const s = $(a.getAttribute('href')); if (s) spy.observe(s); });
$('#enter').onclick = () => $('#letter').scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });

/* ---- Scroll reveal ---- */
const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15 });
$$('.rv').forEach((el, i) => { el.style.transitionDelay = (i % 4) * .12 + 's'; rio.observe(el); });

/* ---- Floating gold particles ---- */
const cv = $('#stars'), cx = cv.getContext('2d'); let W, H, P = [];
function rs() { W = cv.width = innerWidth; H = cv.height = innerHeight;
  P = Array.from({ length: W < 600 ? 35 : 70 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .3, v: Math.random() * .12 + .03, a: Math.random() * 6 })); }
function tick() { cx.clearRect(0, 0, W, H);
  P.forEach(p => { if (!calm) { p.y -= p.v; p.a += .01; } if (p.y < 0) p.y = H;
    cx.fillStyle = `rgba(230,195,130,${.25 + .35 * Math.abs(Math.sin(p.a))})`; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); });
  if (!calm) requestAnimationFrame(tick); }
addEventListener('resize', rs); rs(); tick();

/* ---- Gallery lightbox ---- */
const items = $$('.gal figure'), lb = $('#lb'), li = $('#lb img'), lp = $('#lbph'); let cur = 0;
function show(i) { cur = (i + items.length) % items.length; const f = items[cur];
  li.style.display = 'block'; lp.style.display = 'none';
  li.onerror = () => { li.style.display = 'none'; lp.style.display = 'grid'; lp.textContent = f.dataset.label; };
  li.src = $('img', f).getAttribute('src'); $('#lbcap').textContent = f.dataset.cap || ''; }
items.forEach((f, i) => f.addEventListener('click', () => { show(i); lb.classList.add('show'); document.body.style.overflow = 'hidden'; }));
const closeLb = () => { lb.classList.remove('show'); document.body.style.overflow = ''; };
$('#lbx').onclick = closeLb; $('#lbp').onclick = () => show(cur - 1); $('#lbn').onclick = () => show(cur + 1);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

/* ---- Surprise overlay ---- */
const ov = $('#ov'), steps = $$('#ov .st'), cc = $('#conf'), ctx = cc.getContext('2d');
let timers = [], hv, parts = [], raf = 0;
function burst(n) { for (let i = 0; i < n; i++) parts.push({ x: cc.width / 2, y: cc.height * .4, vx: (Math.random() - .5) * 14, vy: Math.random() * -13 - 3, s: Math.random() * 7 + 4, c: ['#d9b878', '#e8a0b4', '#f6d3dc', '#b3243f'][i % 4] });
  if (!raf) raf = requestAnimationFrame(draw); }
function draw() { ctx.clearRect(0, 0, cc.width, cc.height);
  parts = parts.filter(p => p.y < cc.height + 20); parts.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .22; p.vx *= .99; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, p.s, p.s * .6); });
  raf = parts.length ? requestAnimationFrame(draw) : 0; }
function heart() { const h = document.createElement('span'); h.className = 'heart'; h.textContent = '❤'; h.style.left = Math.random() * 100 + '%';
  h.style.fontSize = 14 + Math.random() * 22 + 'px'; h.style.animationDuration = 7 + Math.random() * 6 + 's'; $('#hearts').appendChild(h); setTimeout(() => h.remove(), 13000); }
function stop() { timers.forEach(clearTimeout); timers = []; clearInterval(hv); $('#hearts').innerHTML = ''; parts = []; }
function play() { stop(); cc.width = innerWidth; cc.height = innerHeight; steps.forEach(s => s.classList.remove('in'));
  if (!calm) hv = setInterval(heart, 600);
  [500, 2500, 4300, 6000, 11000].forEach((t, i) => timers.push(setTimeout(() => { steps[i].classList.add('in'); if (!calm && (i === 1 || i === 2)) burst(120); }, t))); }
$('#open').onclick = () => { ov.classList.add('show'); document.body.style.overflow = 'hidden'; play(); };
$('#again').onclick = play;
const closeOv = () => { ov.classList.remove('show'); document.body.style.overflow = ''; stop(); };
$('#ovx').onclick = closeOv;

/* ---- Keyboard ---- */
addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeLb(); closeOv(); }
  if (lb.classList.contains('show')) { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); }
});
