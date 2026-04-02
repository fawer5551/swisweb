/* ============================================
   SWISM CLIENT — Interactive Scripts
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──────────────────────────
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 2.5}px, ${my - 2.5}px)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`;
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .feature-card, .price-card, .test-card, .showcase-tab, .faq-q')
      .forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
      });
  } else {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
  }

  // ── Particle Background ────────────────────
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    const pts = [];
    const N = 55;
    const LINK = 140;

    function resize() { w = canvas.width = innerWidth; h = canvas.height = innerHeight; }
    resize();
    addEventListener('resize', resize);

    class P {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.r = Math.random() * 1.4 + 0.4;
        this.o = Math.random() * 0.35 + 0.08;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 64, 64, ${this.o})`;
        ctx.fill();
      }
    }
    for (let i = 0; i < N; i++) pts.push(new P());

    (function anim() {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) { p.update(); p.draw(); }
      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < LINK) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(232, 64, 64, ${(1 - d / LINK) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      requestAnimationFrame(anim);
    })();
  }

  // ── Navbar scroll ──────────────────────────
  const nav = document.querySelector('.navbar');
  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });

  // ── Mobile menu ────────────────────────────
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });
  }

  // ── Smooth anchor scroll ───────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if (t) {
        const top = t.getBoundingClientRect().top + scrollY - 75;
        scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Reveal on scroll ──────────────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger')
    .forEach(el => obs.observe(el));

  // ── Stat counters ─────────────────────────
  const nums = document.querySelectorAll('.stat-number');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { count(e.target); cObs.unobserve(e.target); }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => cObs.observe(n));

  function count(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const dur = 2000;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + Math.floor(ease * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    })(start);
  }

  // ── Performance Bars Animation ─────────────
  const perfFills = document.querySelectorAll('.perf-fill, .perf-card-fill');
  const perfObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.dataset.width;
        if (w) e.target.style.width = w + '%';
        perfObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  perfFills.forEach(f => perfObs.observe(f));

  // ── FAQ accordion ─────────────────────────
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const open = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!open) {
        item.classList.add('active');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // ── Hero parallax ─────────────────────────
  const hero = document.querySelector('.hero');
  if (hero && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('mousemove', e => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const mockup = hero.querySelector('.hero-mockup-wrap');
      if (mockup) {
        mockup.style.transform = `translateY(${-10 + y * -6}px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg)`;
      }
    });
  }

  // ── Active nav on scroll ──────────────────
  const sections = document.querySelectorAll('section[id]');
  addEventListener('scroll', () => {
    const sy = scrollY + 110;
    sections.forEach(s => {
      const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (link) {
        if (sy >= s.offsetTop && sy < s.offsetTop + s.offsetHeight) {
          link.style.color = 'var(--text-1)';
        } else {
          link.style.color = '';
        }
      }
    });
  }, { passive: true });

});
