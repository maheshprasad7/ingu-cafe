// ===== MOBILE DETECTION =====
const isMobile = window.innerWidth <= 1024 || 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// ===== CURSOR (Desktop Only) =====
if (!isMobile) {
  const cursor = document.createElement('div');
  cursor.classList.add('cursor');
  const cursorRing = document.createElement('div');
  cursorRing.classList.add('cursor-ring');
  document.body.appendChild(cursor);
  document.body.appendChild(cursorRing);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a,button,.cat-btn,.food-card,.masonry-item,.magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.transform = 'translate(-50%,-50%) scale(2)'; cursorRing.style.transform = 'translate(-50%,-50%) scale(1.5)'; });
    el.addEventListener('mouseleave', () => { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursorRing.style.transform = 'translate(-50%,-50%) scale(1)'; });
  });
}

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    gsap.to('#loader', { opacity: 0, duration: 0.6, onComplete: () => { document.getElementById('loader').style.display = 'none'; initHero(); } });
  }, 2200);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 80);
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progress-bar').style.width = pct + '%';
});

// ===== MOBILE MENU =====
document.getElementById('navToggle').onclick = () => document.getElementById('mobileMenu').classList.add('open');
document.getElementById('mobileClose').onclick = () => document.getElementById('mobileMenu').classList.remove('open');
document.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', () => document.getElementById('mobileMenu').classList.remove('open')));

// ===== HERO ANIMATION =====
function initHero() {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('#w1', { opacity: 1, y: 0, duration: 0.8 }, 0.2)
    .to('#w2', { opacity: 1, duration: 0.8 }, 0.7)
    .to('#w3', { opacity: 1, duration: 0.8 }, 1.2)
    .to('#heroTitle', { opacity: 1, y: 0, duration: 1 }, 1.8)
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8 }, 2.4)
    .to('.hero-btns', { opacity: 1, y: 0, duration: 0.8 }, 2.8);
  initScrollAnimations();
}

// ===== SCROLL REVEAL =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-up,.reveal-left,.reveal-right').forEach(el => observer.observe(el));

  // Parallax (Desktop only — scroll transforms cause jank on mobile)
  const pBg = document.getElementById('parallaxBg');
  if (pBg && !isMobile) {
    window.addEventListener('scroll', () => {
      const rect = pBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const pct = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        pBg.style.transform = `translateY(${(pct - 0.5) * 100}px)`;
      }
    });
  }

  // Split text animation for parallax
  const st = document.getElementById('splitText');
  if (st) {
    const txt = st.textContent;
    st.innerHTML = txt.split('').map(c => c === ' ' ? ' ' : `<span class="char">${c}</span>`).join('');
    const chars = st.querySelectorAll('.char');
    ScrollTrigger.create({
      trigger: st,
      start: 'top 75%',
      onEnter: () => {
        gsap.to(chars, { opacity: 1, y: 0, stagger: 0.04, duration: 0.6, ease: 'power2.out' });
      }
    });
  }

  // Counters
  const counters = document.querySelectorAll('.counter-num');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = parseInt(el.dataset.target);
        const isMillion = target >= 1000000;
        let start = 0, duration = 2000, step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { start = target; clearInterval(timer); }
          el.textContent = isMillion ? (start / 1000000).toFixed(1) : Math.floor(start);
        }, 16);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));
}

// ===== PARTICLES (Reduced on mobile for performance) =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
function resizeCanvas() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particleCount = isMobile ? 15 : 60;
for (let i = 0; i < particleCount; i++) {
  particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.5 + 0.3, vx: (Math.random() - 0.5) * 0.3, vy: -Math.random() * 0.5 - 0.1, o: Math.random() });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201,161,91,${p.o * 0.4})`;
    ctx.fill();
    p.x += p.vx; p.y += p.vy;
    if (p.y < -5) p.y = canvas.height + 5;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Mouse parallax on hero (Desktop only — causes jank on mobile)
if (!isMobile) {
  document.getElementById('hero').addEventListener('mousemove', e => {
    const cx = e.clientX / window.innerWidth - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    const img = document.querySelector('.hero-img');
    if (img) img.style.transform = `scale(1.05) translate(${cx * 15}px, ${cy * 10}px)`;
  });
}

// ===== DRAG SCROLL (Showcase) — Mouse + Touch support =====
const trackWrap = document.querySelector('.showcase-track-wrap');
let isDragging = false, startX = 0, scrollLeft = 0;

// Mouse drag (Desktop)
trackWrap.addEventListener('mousedown', e => { isDragging = true; startX = e.pageX - trackWrap.offsetLeft; scrollLeft = trackWrap.scrollLeft; trackWrap.style.cursor = 'grabbing'; });
trackWrap.addEventListener('mouseleave', () => { isDragging = false; trackWrap.style.cursor = 'grab'; });
trackWrap.addEventListener('mouseup', () => { isDragging = false; trackWrap.style.cursor = 'grab'; });
trackWrap.addEventListener('mousemove', e => { if (!isDragging) return; e.preventDefault(); const x = e.pageX - trackWrap.offsetLeft; trackWrap.scrollLeft = scrollLeft - (x - startX); });

// Touch scroll is handled natively by CSS (-webkit-overflow-scrolling:touch) for smooth momentum

// ===== MENU CATEGORY SWITCH =====
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
      if (item.dataset.cat === cat) {
        item.style.display = '';
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => { item.style.transition = 'all .4s'; item.style.opacity = '1'; item.style.transform = 'translateY(0)'; }, 50);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ===== LIGHTBOX =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
document.querySelectorAll('.masonry-item').forEach(item => {
  item.addEventListener('click', () => { lbImg.src = item.dataset.src; lb.classList.add('open'); });
});
document.getElementById('lbClose').addEventListener('click', () => lb.classList.remove('open'));
lb.addEventListener('click', e => { if (e.target === lb) lb.classList.remove('open'); });

// ===== MAGNETIC BUTTONS (Desktop Only) =====
if (!isMobile) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

// ===== AUTO TESTIMONIALS DUPLICATE =====
const testTrack = document.getElementById('testTrack');
if (testTrack) {
  const clone = testTrack.innerHTML;
  testTrack.innerHTML += clone;
}

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = 'Message Sent! ✓';
  btn.style.background = '#2C1B12';
  setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 3000);
});

// ===== NEWSLETTER =====
function subscribeNL() {
  const inp = document.getElementById('nlEmail');
  if (inp.value) { inp.value = ''; inp.placeholder = 'Thank you for subscribing! ✓'; setTimeout(() => inp.placeholder = 'Your email for updates...', 3000); }
}

// ===== SMOOTH ANCHOR NAV =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
