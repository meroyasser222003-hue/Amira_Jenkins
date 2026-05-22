// ====================================
// Page Loader
// ====================================


// ====================================
// Scroll Animations (IntersectionObserver)
// ====================================
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

window.addEventListener('hashchange', () => {
  setTimeout(() => {
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('visible');
      }
    });
  }, 100);
});

// ====================================
// Scroll-to-Top Button
// ====================================
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

// ====================================
// Header Shadow on Scroll
// ====================================
const header = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.style.boxShadow = '0 4px 30px rgba(26,58,108,0.2)';
  } else {
    header.style.boxShadow = '0 2px 20px rgba(26,58,108,0.12)';
  }
});

// ====================================
// Active Nav Link Highlight
// ====================================
const navLinks = document.querySelectorAll('.main-nav a');
function setActiveNav() {
  const hash = window.location.hash;
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === hash ? 'var(--accent)' : '';
  });
}
window.addEventListener('hashchange', setActiveNav);
setActiveNav();

// ====================================
// Counter Animation
// ====================================
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.textContent.replace('+', ''));
    let current = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + '+';
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const homeObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters();
      homeObserver.disconnect();
    }
  }, { threshold: 0.3 });
  homeObserver.observe(heroStats);
}
