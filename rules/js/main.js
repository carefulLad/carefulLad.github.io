// Advanced Animations & Interactive Effects for Veldivia Jobs Page
// Cursor glow effect REMOVED, consistent animation delays using ease-in-out

// ============================================
// 1. PARTICLE BACKGROUND SYSTEM (subtle, no mouse tracking circle)
// ============================================
class ParticleSystem {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.particleCount = 40;

    this.init();
  }

  init() {
    this.canvas.id = 'particle-canvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    document.body.prepend(this.canvas);

    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: this.getRandomColor(),
        opacity: Math.random() * 0.4 + 0.1
      });
    }
  }

  getRandomColor() {
    const colors = ['#EF4444', '#DC2626', '#B91C1C', '#F87171', '#991B1B'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  drawParticles() {
    this.particles.forEach((particle, index) => {
      // Draw particle
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw connections (subtle)
      this.particles.forEach((particle2, index2) => {
        if (index !== index2) {
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            this.ctx.strokeStyle = particle.color;
            this.ctx.globalAlpha = (1 - distance / 100) * 0.15;
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(particle.x, particle.y);
            this.ctx.lineTo(particle2.x, particle2.y);
            this.ctx.stroke();
          }
        }
      });

      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
    });

    this.ctx.globalAlpha = 1;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// 2. ENHANCED ACCORDION WITH ANIMATIONS
// ============================================
class AdvancedAccordion {
  constructor() {
    this.accordionItems = document.querySelectorAll('.accordion-item');
    this.init();
  }

  init() {
    this.accordionItems.forEach((item, index) => {
      const header = item.querySelector('.accordion-header');
      const content = item.querySelector('.accordion-content');
      const iconWrapper = item.querySelector('.accordion-icon-wrapper');

      // Add ripple effect container
      header.style.position = 'relative';
      header.style.overflow = 'hidden';

      header.addEventListener('click', (e) => {
        this.createRipple(e, header);
        this.toggleAccordion(item, content, iconWrapper);
      });

      // Add hover glow effect
      item.addEventListener('mouseenter', () => {
        item.style.boxShadow = '0 8px 32px rgba(239, 68, 68, 0.3), 0 0 20px rgba(220, 38, 38, 0.2)';
      });

      item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
          item.style.boxShadow = '';
        }
      });
    });
  }

  toggleAccordion(item, content, iconWrapper) {
    const isActive = item.classList.contains('active');

    // Close all other accordions
    this.accordionItems.forEach((otherItem) => {
      if (otherItem !== item && otherItem.classList.contains('active')) {
        otherItem.classList.remove('active');
        const otherContent = otherItem.querySelector('.accordion-content');
        otherContent.style.maxHeight = null;
      }
    });

    // Toggle current accordion
    if (isActive) {
      item.classList.remove('active');
      content.style.maxHeight = null;
    } else {
      item.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';

      // Animate children with consistent delays
      const children = content.querySelectorAll('.accordion-column, .accordion-meta');
      children.forEach((child, i) => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(20px)';
        setTimeout(() => {
          child.style.transition = 'opacity 0.4s cubic-bezier(0.42, 0, 0.58, 1), transform 0.4s cubic-bezier(0.42, 0, 0.58, 1)';
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, i * 100); // Consistent 100ms delays
      });

      // Smooth scroll to accordion
      setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
    }
  }

  createRipple(e, header) {
    const ripple = document.createElement('span');
    const rect = header.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.4) 0%, transparent 70%);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-animation 0.6s cubic-bezier(0.42, 0, 0.58, 1);
      pointer-events: none;
    `;

    header.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
}

// ============================================
// 3. MOBILE MENU FUNCTIONALITY
// ============================================
class MobileMenu {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.mobileMenu = document.getElementById('mobileMenu');
    this.mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    this.mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    this.isMenuOpen = false;

    this.init();
  }

  init() {
    if (!this.hamburger || !this.mobileMenu) return;

    // Hamburger click handler
    this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

    // Overlay click to close
    if (this.mobileMenuOverlay) {
      this.mobileMenuOverlay.addEventListener('click', () => this.closeMobileMenu());
    }

    // Close menu when clicking a link (except server IP)
    this.mobileMenuLinks.forEach(link => {
      if (!link.classList.contains('mobile-server-ip')) {
        link.addEventListener('click', () => {
          setTimeout(() => this.closeMobileMenu(), 150);
        });
      }
    });

    // Close menu on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  openMobileMenu(options = {}) {
    const skipReset = !!options.skipResetAnimations;

    this.isMenuOpen = true;
    this.hamburger.classList.add('active');
    this.hamburger.setAttribute('aria-expanded', 'true');
    this.mobileMenu.classList.remove('closing');
    this.mobileMenu.classList.add('active');
    this.mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Reset link animations (skip when reopening from persistence)
    if (!skipReset) {
      this.mobileMenuLinks.forEach(link => {
        link.style.animation = 'none';
        link.offsetHeight; // Trigger reflow
        link.style.animation = '';
      });
    }
  }

  closeMobileMenu() {
    if (!this.isMenuOpen) return;

    this.isMenuOpen = false;
    this.hamburger.classList.remove('active');
    this.hamburger.setAttribute('aria-expanded', 'false');
    this.mobileMenu.classList.add('closing');
    this.mobileMenuOverlay.classList.remove('active');

    setTimeout(() => {
      this.mobileMenu.classList.remove('active', 'closing');
      document.body.style.overflow = '';
    }, 400);
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
}

// ============================================
// 4. COPY IP FUNCTION
// ============================================
function copyIP() {
  navigator.clipboard.writeText('play.veldivia.net').then(() => {
    // Desktop version
    const ipContainer = document.querySelector('.nav-server-ip');
    const ipElement = ipContainer ? ipContainer.querySelector('span') : null;

    // Mobile version
    const mobileIpContainer = document.querySelector('.mobile-server-ip');
    const mobileIpElement = mobileIpContainer ? mobileIpContainer.querySelector('span') : null;

    // Animate desktop IP
    if (ipElement) {
      animateIPCopy(ipContainer, ipElement);
    }

    // Animate mobile IP
    if (mobileIpElement) {
      animateIPCopy(mobileIpContainer, mobileIpElement);
    }
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
}

function animateIPCopy(container, element) {
  const originalText = element.textContent;

  // Add pulse animation to container
  container.classList.add('copying');
  setTimeout(() => container.classList.remove('copying'), 600);

  // Flip animation
  element.style.transform = 'rotateX(90deg)';
  element.style.transition = 'transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)';

  setTimeout(() => {
    element.textContent = 'Copied!';
    element.style.transform = 'rotateX(0deg)';

    setTimeout(() => {
      element.style.transform = 'rotateX(90deg)';
      setTimeout(() => {
        element.textContent = originalText;
        element.style.transform = 'rotateX(0deg)';
      }, 250);
    }, 2000);
  }, 250);
}

// ============================================
// 5. NAVBAR EFFECTS
// ============================================
class NavbarEffects {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.contentWrapper = document.getElementById('content-wrapper');
    this.init();
  }

  init() {
    if (!this.navbar || !this.contentWrapper) return;

    let lastScroll = 0;

    this.contentWrapper.addEventListener('scroll', () => {
      const currentScroll = this.contentWrapper.scrollTop;

      if (currentScroll > 100) {
        this.navbar.style.background = 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%)';
        this.navbar.style.backdropFilter = 'blur(20px) saturate(180%)';
        this.navbar.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 25px rgba(220, 38, 38, 0.15)';
      } else {
        this.navbar.style.background = 'linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(0, 0, 0, 0.95) 100%)';
        this.navbar.style.backdropFilter = 'blur(16px) saturate(180%)';
        this.navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 0 25px rgba(220, 38, 38, 0.15)';
      }

      // Hide navbar on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 500) {
        this.navbar.style.transform = 'translateY(-100%)';
      } else {
        this.navbar.style.transform = 'translateY(0)';
      }

      lastScroll = currentScroll;
    });

    this.navbar.style.transition = 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)';
  }
}

// ============================================
// 6. PAGE TRANSITION ANIMATIONS
// ============================================
class PageTransitions {
  constructor() {
    this.init();
  }

  init() {
    // Animate page enter elements
    const pageEnterElements = document.querySelectorAll('.page-enter');
    
    pageEnterElements.forEach((el, index) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      
      // Consistent animation delays: 100ms, 200ms, 300ms
      setTimeout(() => {
        el.style.transition = 'opacity 0.6s cubic-bezier(0.42, 0, 0.58, 1), transform 0.6s cubic-bezier(0.42, 0, 0.58, 1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, (index + 1) * 100);
    });
  }
}

// Small helper: scroll-trigger reveal for .page-enter elements (play once)
function initScrollRevealForPageEnter(rootEl = document.getElementById('content-wrapper')) {
  const root = rootEl || null;
  const opts = root ? { root, threshold: 0.25 } : { threshold: 0.25 };

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.animatedOnce) { obs.unobserve(el); return; }
      el.dataset.animatedOnce = '1';

      // Defensive initial state
      if (!el.style.opacity) el.style.opacity = '0';
      if (!el.style.transform) el.style.transform = 'translateY(30px)';

      const transition = 'opacity 0.6s cubic-bezier(0.42, 0, 0.58, 1), transform 0.6s cubic-bezier(0.42, 0, 0.58, 1)';
      requestAnimationFrame(() => {
        el.style.transition = transition;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });

      obs.unobserve(el);
    });
  }, opts);

  document.querySelectorAll('.page-enter').forEach(el => {
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) >= 1 && cs.transform === 'none') return;
    el.style.opacity = el.style.opacity || '0';
    el.style.transform = el.style.transform || 'translateY(30px)';
    io.observe(el);
  });
}

// ============================================
// 7. INITIALIZE ALL EFFECTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all animation systems
  new ParticleSystem();
  new AdvancedAccordion();
  const mobileMenuInstance = new MobileMenu();
  new NavbarEffects();
  new PageTransitions();

  console.log('🚀 Veldivia Jobs page initialized');

  // --- Persist mobile menu open across navigation (Jobs page) ---
  (function () {
    const PERSIST_KEY = 'veldivia_mobile_menu_open';
    const PERSIST_TTL_MS = 5000;

    function markMenuShouldStayOpen() {
      try {
        const payload = { t: Date.now(), ttl: PERSIST_TTL_MS };
        localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
      } catch (e) {}
    }

    function clearMenuPersistFlag() {
      try { localStorage.removeItem(PERSIST_KEY); } catch (e) {}
    }

    // Wire click handlers for anchors that will navigate away
    document.querySelectorAll('.mobile-menu a, .mobile-menu-link a, .mobile-menu-link[href]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && !href.startsWith('javascript:')) {
          markMenuShouldStayOpen();
        }
      });
    });

    // If user closes menu explicitly, clear the flag
    const origClose = window.closeMobileMenu;
    window.closeMobileMenu = function () {
      clearMenuPersistFlag();
      if (typeof origClose === 'function') origClose();
    };

    // On load, if the flag exists and is fresh, reopen without replaying animations
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && obj.t && (Date.now() - obj.t <= (obj.ttl || PERSIST_TTL_MS))) {
          if (mobileMenuInstance && typeof mobileMenuInstance.openMobileMenu === 'function') {
            mobileMenuInstance.openMobileMenu({ skipResetAnimations: true });
          }
        }
      }
    } catch (e) {
      // ignore
    } finally {
      try { localStorage.removeItem(PERSIST_KEY); } catch (e) {}
    }
  })();

  // ensure scroll reveal runs after initial page-enter processing
  try { initScrollRevealForPageEnter(document.getElementById('content-wrapper')); } catch (e) { /* ignore */ }
});

// Add custom CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  .apply-btn, .cta-btn {
    position: relative;
    overflow: hidden;
  }

  .apply-btn::before, .cta-btn::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s cubic-bezier(0.42, 0, 0.58, 1);
    pointer-events: none;
    left: var(--mouse-x, 50%);
    top: var(--mouse-y, 50%);
  }

  .apply-btn:hover::before, .cta-btn:hover::before {
    transform: translate(-50%, -50%) scale(3);
  }
`;

document.head.appendChild(styleSheet);
