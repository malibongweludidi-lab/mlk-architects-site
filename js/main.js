// MLK Architects — shared interactivity

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('open');
      toggle.textContent = nav.classList.contains('open') ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.textContent = '☰';
    }));
  }

  // Header shadow on scroll
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.boxShadow = window.scrollY > 10 ? '0 6px 24px rgba(0,0,0,0.06)' : 'none';
    });
  }

  // Sector filter (work page)
  const sectorTags = document.querySelectorAll('.sector-tag');
  const cases = document.querySelectorAll('.case');
  if (sectorTags.length && cases.length) {
    sectorTags.forEach(btn => {
      btn.addEventListener('click', () => {
        sectorTags.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        cases.forEach(c => {
          const match = filter === 'all' || c.dataset.sector === filter;
          c.hidden = !match;
        });
      });
    });
  }

  // Contact form — submits to FormSubmit; native POST handles delivery
  const form = document.querySelector('.contact-form');
  if (form) {
    const note = form.querySelector('.form-note');
    // Show confirmation when the user returns after a successful send
    if (note && /[?&]sent=1/.test(window.location.search)) {
      note.textContent = 'thank you — your message has been sent. we typically reply within two business days.';
      note.style.color = 'var(--accent)';
    }
    // Give feedback while the form posts
    form.addEventListener('submit', () => {
      const label = form.querySelector('button[type="submit"] span');
      if (label) label.textContent = 'sending…';
    });
  }

  // Rotating slideshows
  document.querySelectorAll('.slideshow').forEach(show => {
    const slides = Array.from(show.querySelectorAll('.slide'));
    if (slides.length < 2) return;
    const interval = parseInt(show.dataset.interval, 10) || 4500;
    const dotsWrap = show.querySelector('.dots');
    let i = 0, timer;
    const dots = slides.map((_, idx) => {
      if (!dotsWrap) return null;
      const d = document.createElement('button');
      d.className = 'dot' + (idx === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'show slide ' + (idx + 1));
      d.addEventListener('click', () => { go(idx); reset(); });
      dotsWrap.appendChild(d);
      return d;
    });
    function go(n) {
      slides[i].classList.remove('active');
      if (dots[i]) dots[i].classList.remove('active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('active');
      if (dots[i]) dots[i].classList.add('active');
    }
    function reset() { clearInterval(timer); timer = setInterval(() => go(i + 1), interval); }
    reset();
    show.addEventListener('mouseenter', () => clearInterval(timer));
    show.addEventListener('mouseleave', reset);
  });

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }
});
