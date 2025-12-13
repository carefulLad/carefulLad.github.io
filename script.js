// Modular Section Navigation System
const navigationConfig = [
    {
        id: 'hero',
        label: 'Home',
        selector: '.hero'
    },
    {
        id: 'news',
        label: 'News',
        selector: '#news',
        subsections: [
            { id: 'news-card-0', label: 'Veldivia’s Origins & Early Combat Direction', action: 'scroll' },
            { id: 'news-card-1', label: 'Expanded Infrastructure - EU & NA Proxy Servers', action: 'scroll' },
            { id: 'news-card-2', label: 'Quality-of-Life Improvements & Community Growth', action: 'scroll' }
        ]
    },
    {
        id: 'discord',
        label: 'Discord',
        selector: '#discord'
    }
];

// Build navigation dynamically
function buildNavigation() {
    const navContainer = document.getElementById('sectionNav');
    if (!navContainer) return;

    navContainer.innerHTML = '';

    navigationConfig.forEach(section => {
        if (section.subsections) {
            // Create group with subsections
            const group = document.createElement('div');
            group.className = 'section-nav-group';

            // Main section item
            const item = createNavItem(section);
            group.appendChild(item);

            // Hover bridge
            const bridge = document.createElement('div');
            bridge.className = 'section-nav-hover-bridge';
            group.appendChild(bridge);

            // Subsections container
            const subsectionsContainer = document.createElement('div');
            subsectionsContainer.className = 'section-nav-subsections';

            // Vertical connector
            const connector = document.createElement('div');
            connector.className = 'section-nav-vertical-connector';
            subsectionsContainer.appendChild(connector);

            // Add subsections
            section.subsections.forEach(subsection => {
                const subItem = createSubsectionItem(subsection);
                subsectionsContainer.appendChild(subItem);
            });

            group.appendChild(subsectionsContainer);
            navContainer.appendChild(group);
        } else {
            // Simple section without subsections
            const item = createNavItem(section);
            navContainer.appendChild(item);
        }
    });
}

function createNavItem(section) {
    const item = document.createElement('div');
    item.className = 'section-nav-item';
    item.setAttribute('data-section', section.id);

    const label = document.createElement('span');
    label.className = 'section-nav-label';
    label.textContent = section.label;

    const indicator = document.createElement('div');
    indicator.className = 'section-nav-indicator';

    const line = document.createElement('div');
    line.className = 'section-nav-line';

    const dot = document.createElement('div');
    dot.className = 'section-nav-dot';

    indicator.appendChild(line);
    indicator.appendChild(dot);
    item.appendChild(label);
    item.appendChild(indicator);

    return item;
}

function createSubsectionItem(subsection) {
    const item = document.createElement('div');
    item.className = 'section-nav-subsection';

    if (subsection.action === 'scroll') {
        item.setAttribute('data-scroll-to', subsection.id);
    } else if (subsection.action === 'article') {
        item.setAttribute('data-article', subsection.id);
    }

    const label = document.createElement('span');
    label.className = 'section-nav-label';
    label.textContent = subsection.label;

    const hLine = document.createElement('div');
    hLine.className = 'section-nav-horizontal-line';

    const dot = document.createElement('div');
    dot.className = 'section-nav-dot';

    item.appendChild(label);
    item.appendChild(hLine);
    item.appendChild(dot);

    return item;
}

// Initialize navigation
buildNavigation();

// Cache subsection nav items for article highlighting
const subsectionNavItems = document.querySelectorAll('.section-nav-subsection');

// Get sections from config
const sections = {};
navigationConfig.forEach(section => {
    const element = document.querySelector(section.selector);
    if (element) {
        sections[section.id] = element;
    }
});

// Helper: set active main section nav item (robust indicator)
function setActiveSection(sectionId) {
    const navItems = document.querySelectorAll('.section-nav-item');
    navItems.forEach(item => {
        item.classList.toggle(
            'active',
            item.getAttribute('data-section') === sectionId
        );
    });
}

// Event delegation for section clicks
const sectionNavEl = document.getElementById('sectionNav');
if (sectionNavEl) {
    sectionNavEl.addEventListener('click', (e) => {
        // Handle subsection clicks first (higher priority)
        const subsectionItem = e.target.closest('.section-nav-subsection');
        if (subsectionItem) {
            const scrollTarget = subsectionItem.getAttribute('data-scroll-to');
            if (scrollTarget) {
                const element = document.getElementById(scrollTarget);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }

            const articleIndex = parseInt(subsectionItem.getAttribute('data-article'));
            if (!isNaN(articleIndex)) {
                openArticle(articleIndex);
            }
            return; // Prevent section click if subsection was clicked
        }

        // Handle main section clicks
        const navItem = e.target.closest('.section-nav-item');
        if (navItem) {
            const sectionName = navItem.getAttribute('data-section');
            const section = sections[sectionName];
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Immediate visual feedback
                setActiveSection(sectionName);
            }
        }
    });
}

// Robust active state on scroll using IntersectionObserver
const contentWrapper = document.getElementById('content-wrapper');

if (contentWrapper) {
    // Map of currently visible sections and their intersection ratios
    const inViewSections = new Map();
    let activeSectionId = null;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.dataset.sectionId;
                if (!sectionId) return;

                if (entry.isIntersecting) {
                    inViewSections.set(sectionId, entry.intersectionRatio);
                } else {
                    inViewSections.delete(sectionId);
                }
            });

            if (inViewSections.size === 0) return;

            // Pick the section with the largest visible ratio
            const [bestId] = [...inViewSections.entries()]
                .sort((a, b) => b[1] - a[1])[0];

            if (bestId && bestId !== activeSectionId) {
                activeSectionId = bestId;
                setActiveSection(bestId);
            }
        },
        {
            root: contentWrapper,            // observe inside the scrollable wrapper
            threshold: [0.25, 0.5, 0.75]     // smoother transitions
        }
    );

    // Tag each section element and start observing
    Object.entries(sections).forEach(([id, element]) => {
        if (!element) return;
        element.dataset.sectionId = id;
        observer.observe(element);
    });
}

// =====================================================
// MOBILE MENU FUNCTIONALITY
// =====================================================

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

let isMenuOpen = false;

function openMobileMenu() {
    isMenuOpen = true;
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.remove('closing');
    mobileMenu.classList.add('active');
    mobileMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset link animations for re-entry
    mobileMenuLinks.forEach(link => {
        link.style.animation = 'none';
        link.offsetHeight; // Trigger reflow
        link.style.animation = '';
    });
}

function closeMobileMenu() {
    if (!isMenuOpen) return;
    
    isMenuOpen = false;
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.add('closing');
    mobileMenuOverlay.classList.remove('active');
    
    // Wait for closing animation to complete
    setTimeout(() => {
        mobileMenu.classList.remove('active', 'closing');
        document.body.style.overflow = '';
    }, 400);
}

function toggleMobileMenu() {
    if (isMenuOpen) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

// Hamburger click handler
if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

// Overlay click to close
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
}

// Close menu when clicking a link (except server IP)
mobileMenuLinks.forEach(link => {
    if (!link.classList.contains('mobile-server-ip')) {
        link.addEventListener('click', (e) => {
            // Small delay to show the click feedback
            setTimeout(closeMobileMenu, 150);
        });
    }
});

// Close menu on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
        closeMobileMenu();
    }
});

// Close menu on window resize (if going back to desktop)
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMobileMenu();
    }
});

// =====================================================
// ARTICLE DATA AND FUNCTIONS
// =====================================================
const articles = [
    {
        title: "Veldivia’s Origins & Early Combat Direction",
        date: "Nov 21, 2025",
        image: "data:image/svg+xml,%3Csvg width='800' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='articleGrad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23DC2626;stop-opacity:0.85' /%3E%3Cstop offset='100%25' style='stop-color:%23991B1B;stop-opacity:0.95' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='300' fill='url(%23articleGrad1)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='42' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EVeldivia Origins%3C/text%3E%3C/svg%3E",
        body: `
            <p>Veldivia began as a small private SMP formed by just seven friends—a relaxed survival server built on trust rather than strict rules.</p>

            <p>In such a close-knit group, moderation was informal by necessity. Over time, it became clear that consistent enforcement was difficult. The fear of losing players over moderation decisions made long-term balance unsustainable.</p>

            <h3>From Rules to Systems</h3>
            <p>As Veldivia grew, it shifted away from being a rule-heavy private SMP and evolved into a public server built around <strong>system-based balance</strong>. Instead of relying on constant oversight, gameplay mechanics themselves encourage fair play.</p>

            <h3>Why Mace Combat Was Adjusted</h3>
            <p>High-end PvP increasingly became dominated by Elytra-based aerial combat. While skill-intensive, these fights often dragged on with little resolution.</p>

            <ul>
                <li><strong>Breach capped at Level II</strong> to reduce extreme armor penetration</li>
                <li><strong>Smash attacks now have a 30-second cooldown</strong> to discourage repeated aerial burst attempts</li>
            </ul>

            <p>These changes were designed not to simplify PvP, but to redirect it toward more grounded, decisive engagements.</p>

            <h3>Designing for Meaningful PvP</h3>
            <p>Veldivia prioritizes combat that is engaging, readable, and skillful—without devolving into prolonged aerial stalemates. Systems, not moderation, shape the experience.</p>
        `
    },
    {
        title: "Expanded Infrastructure — EU & NA Proxy Servers",
        date: "Nov 24, 2025",
        image: "data:image/svg+xml,%3Csvg width='800' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='articleGrad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23B91C1C;stop-opacity:0.85' /%3E%3Cstop offset='100%25' style='stop-color:%237F1D1D;stop-opacity:0.95' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='300' fill='url(%23articleGrad2)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='40' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EGlobal Infrastructure%3C/text%3E%3C/svg%3E",
        body: `
            <p>We’re excited to announce a major infrastructure upgrade aimed at improving connectivity for players around the world.</p>

            <p>Veldivia now operates <strong>dedicated proxy servers</strong> for both European and North American regions, significantly reducing latency and improving connection stability.</p>

            <h3>Available Proxy Addresses</h3>
            <ul>
                <li><strong>EU:</strong> eu.veldivia.net</li>
                <li><strong>NA:</strong> na.veldivia.net</li>
            </ul>

            <p>Players can connect through their nearest proxy for a smoother, more responsive gameplay experience.</p>

            <h3>Why This Matters</h3>
            <ul>
                <li>Fairer PvP interactions</li>
                <li>Reduced lag spikes during combat</li>
                <li>Improved performance during peak hours</li>
            </ul>

            <p>This upgrade is a significant step toward making Veldivia accessible and enjoyable for our growing global community.</p>
        `
    },
    {
        title: "Quality-of-Life Improvements & Community Growth",
        date: "Nov 24, 2025",
        image: "data:image/svg+xml,%3Csvg width='800' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='articleGrad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23991B1B;stop-opacity:0.85' /%3E%3Cstop offset='100%25' style='stop-color:%236B0F0F;stop-opacity:0.95' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='300' fill='url(%23articleGrad3)'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='36' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3EQoL & Community%3C/text%3E%3C/svg%3E",
        body: `
            <p>Veldivia continues to grow beyond core gameplay, with quality-of-life improvements and community-driven features designed to support all playstyles.</p>

            <h3>Enhanced XP & Trading</h3>
            <ul>
                <li>Bottles o’ Enchanting now consistently grant <strong>12 XP</strong></li>
                <li>Most armor can be fully mended with just <strong>16 bottles</strong></li>
                <li>Villagers restock every <strong>5 minutes</strong>, regardless of trade history</li>
                <li>Use <code>/whenrestock</code> to check the next restock timer</li>
            </ul>

            <h3>Controlled Progression & Balance</h3>
            <ul>
                <li>Ancient Debris is rarer outside chunks near spawn</li>
                <li>Bastion loot tables adjusted to make Netherite Upgrade Templates rarer</li>
            </ul>

            <h3>Community Expansion</h3>
            <p>The <strong>Veldivia Job Board</strong> is now live, allowing players to post opportunities, browse listings, and collaborate beyond the game itself.</p>

            <p>Veldivia is more than a server—it’s a growing community, built for longevity.</p>
        `
    }
];


// Article Modal Functions
function openArticle(index) {
    const article = articles[index];
    if (!article) return;

    document.getElementById('articleTitle').textContent = article.title;
    document.getElementById('articleDate').textContent = article.date;
    document.getElementById('articleImage').src = article.image;
    document.getElementById('articleBody').innerHTML = article.body;

    const modal = document.getElementById('articleModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Ensure the main News section indicator is active
    setActiveSection('news');

    // Update subsection active state
    subsectionNavItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) {
            item.classList.add('active');
        }
    });
}

function closeArticleModal(event) {
    if (!event || event.target.id === 'articleModal') {
        const modal = document.getElementById('articleModal');
        modal.classList.add('closing');
        
        setTimeout(() => {
            modal.classList.remove('active', 'closing');
            document.body.style.overflow = '';
            
            // Remove active state from subsections
            document.querySelectorAll('.section-nav-subsection').forEach(item => {
                item.classList.remove('active');
            });
        }, 600);
    }
}

// Close article modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeArticleModal();
    }
});

// =====================================================
// COPY IP FUNCTION
// =====================================================

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
// --- Persist mobile menu open across page navigation ---
// When clicking a real link inside the mobile menu, set a short-lived flag
(function () {
  const PERSIST_KEY = 'veldivia_mobile_menu_open';
  const PERSIST_TTL_MS = 5000; // keep open for 5s across navigation

  // mark that menu should remain open on next load
  function markMenuShouldStayOpen() {
    try {
      const payload = { t: Date.now(), ttl: PERSIST_TTL_MS };
      localStorage.setItem(PERSIST_KEY, JSON.stringify(payload));
    } catch (e) { /* ignore storage errors */ }
  }

  // Clear the flag
  function clearMenuPersistFlag() {
    try { localStorage.removeItem(PERSIST_KEY); } catch (e) {}
  }

  // Add listeners to mobile menu links to set the flag before navigation
  // Select anchors inside `.mobile-menu` and desktop -> mobile menu links that lead off-page.
  document.querySelectorAll('.mobile-menu a, .mobile-menu-link a, .mobile-menu-link[href]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Only set persistence for real navigations (href present and not just a hash)
      const href = link.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        markMenuShouldStayOpen();
        // allow normal navigation to proceed
      }
    });
  });

  // If user closes menu manually, ensure persistence is removed
  const origClose = window.closeMobileMenu;
  window.closeMobileMenu = function () {
    clearMenuPersistFlag();
    if (typeof origClose === 'function') origClose();
  };

  // On load, re-open menu if flag exists and hasn't expired
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (!obj || !obj.t) { localStorage.removeItem(PERSIST_KEY); return; }
      const now = Date.now();
      if (now - obj.t <= (obj.ttl || PERSIST_TTL_MS)) {
        // open the menu (if functions/elements exist)
        if (typeof openMobileMenu === 'function') {
          openMobileMenu();
        } else {
          const hamburgerEl = document.getElementById('hamburger');
          const mobileMenuEl = document.getElementById('mobileMenu');
          const overlayEl = document.getElementById('mobileMenuOverlay');
          if (hamburgerEl) hamburgerEl.classList.add('active');
          if (mobileMenuEl) mobileMenuEl.classList.add('active');
          if (overlayEl) overlayEl.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      }
    } catch (e) {
      // ignore parse errors
    } finally {
      try { localStorage.removeItem(PERSIST_KEY); } catch (e) {}
    }
  });
})();
function animateIPCopy(container, element) {
    const originalText = element.textContent;
    
    // Add pulse animation to container
    container.classList.add('copying');
    setTimeout(() => container.classList.remove('copying'), 600);
    
    // Flip DOWN animation (initial click)
    element.style.transform = 'rotateX(90deg)';
    element.style.transition = 'transform 0.25s cubic-bezier(0.42, 0, 0.58, 1)';
    
    setTimeout(() => {
        element.textContent = 'Copied!';
        element.style.transform = 'rotateX(0deg)';
        
        setTimeout(() => {
            // Flip DOWN again when reverting
            element.style.transform = 'rotateX(90deg)';
            setTimeout(() => {
                element.textContent = originalText;
                element.style.transform = 'rotateX(0deg)';
            }, 250);
        }, 2000);
    }, 250);
}

// =====================================================
// DISCORD MODAL FUNCTIONS
// =====================================================

function openDiscordModal() {
    document.getElementById('discordModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDiscordModal(event) {
    if (!event || event.target.id === 'discordModal' || event.target.classList.contains('discord-modal-close')) {
        document.getElementById('discordModal').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close Discord modal on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDiscordModal();
    }
});
document.addEventListener('DOMContentLoaded', () => {
  const enterDurationMs = 600;
  const easing = 'cubic-bezier(0.42, 0, 0.58, 1)';

  // Hero: animate children but don't overwrite existing keyframe animations
  document.querySelectorAll('.hero > *').forEach((el, i) => {
    const cs = getComputedStyle(el);
    const hasAnimation = cs.animationName && cs.animationName !== 'none';
    const delayMs = 100 + i * 100;

    if (!hasAnimation) {
      // Safe to use the CSS keyframe enter animation
      el.classList.add('page-enter');
      el.style.animationDelay = `${delayMs / 1000}s`;
    } else {
      // Element already animates (e.g. float). Fade it in only so we don't clobber its animation.
      el.style.opacity = '0';
      // use transition with a delay to mimic stagger
      el.style.transition = `opacity ${enterDurationMs}ms ${easing} ${delayMs}ms`;
      // trigger the transition on next frame
      requestAnimationFrame(() => { el.style.opacity = '1'; });
      // cleanup inline transition after it completes
      setTimeout(() => {
        el.style.transition = '';
      }, enterDurationMs + delayMs + 50);
    }
  });

  // News cards: use the existing page-enter-card animation (they usually don't have existing keyframe animations)
  document.querySelectorAll('.news-grid > .news-card').forEach((card, i) => {
    card.classList.add('page-enter-card');
    card.style.animationDelay = `${1 + i * 0.1}s`;
  });
});

/* Scroll-triggered reveal for .page-enter elements (play once, no pop-out) */
function initScrollRevealForPageEnter(rootEl = document.getElementById('content-wrapper')) {
    const root = rootEl || null;
    const opts = root ? { root, threshold: 0.25 } : { threshold: 0.25 };

    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.animatedOnce) { obs.unobserve(el); return; }
            el.dataset.animatedOnce = '1';

            // Ensure initial state (defensive)
            if (!el.style.opacity) el.style.opacity = '0';
            if (!el.style.transform) el.style.transform = 'translateY(30px)';

            // Apply same transition as PageTransitions
            const transition = 'opacity 0.6s cubic-bezier(0.42, 0, 0.58, 1), transform 0.6s cubic-bezier(0.42, 0, 0.58, 1)';
            // Use requestAnimationFrame to ensure styles are flushed
            requestAnimationFrame(() => {
                el.style.transition = transition;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });

            // Stop observing this element (play once)
            obs.unobserve(el);
        });
    }, opts);

    document.querySelectorAll('.page-enter').forEach(el => {
        const cs = getComputedStyle(el);
        // Skip if already fully visible / likely already animated
        if (parseFloat(cs.opacity) >= 1 && cs.transform === 'none') return;
        // Ensure initial defensive state
        el.style.opacity = el.style.opacity || '0';
        el.style.transform = el.style.transform || 'translateY(30px)';
        io.observe(el);
    });
}

// run after DOM ready (we already add other DOMContentLoaded listeners elsewhere)
document.addEventListener('DOMContentLoaded', () => {
    try { initScrollRevealForPageEnter(document.getElementById('content-wrapper')); } catch (e) { /* ignore */ }
});

// =====================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =====================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target && contentWrapper) {
            const targetPosition = target.offsetTop - 80;
            contentWrapper.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
