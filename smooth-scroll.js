/**
 * ENHANCED SMOOTH SCROLL - CORE CRYPTOCURRENCY WEBSITE
 * Improved smooth scrolling with easing animations and performance optimization
 * ==================================================================
 */

class EnhancedSmoothScroll {
  constructor() {
    this.isScrolling = false;
    this.currentTarget = null;
    this.startTime = null;
    this.startPos = 0;
    this.targetPos = 0;
    this.duration = 1000; // Default duration in ms
    
    this.init();
  }

  init() {
    // Disable CSS smooth scrolling for manual control
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Override default scroll behavior for navigation links
    this.bindNavigationEvents();
    
    // Add scroll padding for fixed navbar
    document.documentElement.style.scrollPaddingTop = '80px';
  }

  bindNavigationEvents() {
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-section');
        this.scrollToSection(targetId);
      });
    });

    // Scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        this.scrollToSection('about');
      });
    }

    // Hash links in content
    const hashLinks = document.querySelectorAll('a[href^="#"]');
    hashLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.length > 1) {
          const targetId = href.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            this.scrollToSection(targetId);
          }
        }
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        this.scrollToNextSection();
      } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        this.scrollToPreviousSection();
      } else if (e.key === 'Home' && e.ctrlKey) {
        e.preventDefault();
        this.scrollToSection('home');
      } else if (e.key === 'End' && e.ctrlKey) {
        e.preventDefault();
        this.scrollToBottom();
      }
    });
  }

  scrollToSection(sectionId, customDuration = null) {
    const targetElement = document.getElementById(sectionId);
    if (!targetElement) {
      console.warn(`Section with id "${sectionId}" not found`);
      return;
    }

    // Calculate target position
    const navbarHeight = 80;
    const targetRect = targetElement.getBoundingClientRect();
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const targetTop = targetRect.top + currentScrollTop - navbarHeight;

    // Use custom smooth scroll for better control
    this.smoothScrollTo(targetTop, customDuration || this.calculateDuration(Math.abs(targetTop - currentScrollTop)));
    
    // Update URL hash without triggering scroll
    if (sectionId !== 'home') {
      this.updateHashWithoutScroll(sectionId);
    } else {
      this.updateHashWithoutScroll('');
    }

    // Update active navigation
    this.updateActiveNavigation(sectionId);
  }

  smoothScrollTo(targetPosition, duration = 1000) {
    if (this.isScrolling) {
      return; // Prevent multiple simultaneous scrolls
    }

    this.isScrolling = true;
    this.startTime = null;
    this.startPos = window.pageYOffset || document.documentElement.scrollTop;
    this.targetPos = Math.max(0, Math.min(targetPosition, document.documentElement.scrollHeight - window.innerHeight));
    this.duration = duration;

    // Use requestAnimationFrame for smooth animation
    const animateScroll = (currentTime) => {
      if (!this.startTime) {
        this.startTime = currentTime;
      }

      const elapsed = currentTime - this.startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Enhanced easing function for professional feel
      const easeInOutCubic = (t) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      };

      const currentPosition = this.startPos + (this.targetPos - this.startPos) * easeInOutCubic(progress);
      
      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        this.isScrolling = false;
        this.onScrollComplete();
      }
    };

    requestAnimationFrame(animateScroll);
  }

  calculateDuration(distance) {
    // Dynamic duration based on distance
    const minDuration = 400;
    const maxDuration = 1200;
    const baseDistance = 1000;
    
    const calculatedDuration = (distance / baseDistance) * 800 + minDuration;
    return Math.min(Math.max(calculatedDuration, minDuration), maxDuration);
  }

  scrollToNextSection() {
    const sections = this.getAllSections();
    const currentSection = this.getCurrentSection();
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    
    if (currentIndex < sections.length - 1) {
      this.scrollToSection(sections[currentIndex + 1].id);
    }
  }

  scrollToPreviousSection() {
    const sections = this.getAllSections();
    const currentSection = this.getCurrentSection();
    const currentIndex = sections.findIndex(section => section.id === currentSection);
    
    if (currentIndex > 0) {
      this.scrollToSection(sections[currentIndex - 1].id);
    }
  }

  scrollToBottom() {
    this.smoothScrollTo(document.documentElement.scrollHeight);
  }

  getAllSections() {
    return Array.from(document.querySelectorAll('section[id]'));
  }

  getCurrentSection() {
    const sections = this.getAllSections();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportCenter = scrollTop + window.innerHeight / 2;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (viewportCenter >= sectionTop && viewportCenter <= sectionBottom) {
        return section.id;
      }
    }

    return sections[0]?.id || 'home';
  }

  updateHashWithoutScroll(hash) {
    // Update URL without triggering scroll events
    const url = hash ? `#${hash}` : window.location.pathname;
    history.replaceState(null, null, url);
  }

  updateActiveNavigation(sectionId) {
    // Update active state on navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });

    // Trigger custom event for other components
    window.dispatchEvent(new CustomEvent('sectionChange', {
      detail: { sectionId }
    }));
  }

  onScrollComplete() {
    // Callback for when smooth scroll animation is complete
    console.log('Smooth scroll completed');
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('smoothScrollComplete'));
  }

  // Method to handle browser back/forward navigation
  handlePopState() {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const sectionId = hash.substring(1);
      setTimeout(() => {
        this.scrollToSection(sectionId, 500); // Faster for browser navigation
      }, 100);
    } else {
      setTimeout(() => {
        this.scrollToSection('home', 500);
      }, 100);
    }
  }

  // Intersection Observer for automatic section detection
  initIntersectionObserver() {
    if (!window.IntersectionObserver) return;

    const options = {
      rootMargin: '-80px 0px -50% 0px', // Account for navbar height
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isScrolling) {
          const sectionId = entry.target.id;
          this.updateActiveNavigation(sectionId);
          
          // Update hash for non-home sections
          if (sectionId !== 'home') {
            this.updateHashWithoutScroll(sectionId);
          } else {
            this.updateHashWithoutScroll('');
          }
        }
      });
    }, options);

    // Observe all sections
    this.getAllSections().forEach(section => {
      observer.observe(section);
    });
  }

  destroy() {
    // Clean up event listeners and animations
    this.isScrolling = false;
    document.documentElement.style.scrollBehavior = 'auto';
  }
}

// Initialize enhanced smooth scroll
document.addEventListener('DOMContentLoaded', () => {
  window.enhancedSmoothScroll = new EnhancedSmoothScroll();
  
  // Initialize intersection observer after a short delay
  setTimeout(() => {
    window.enhancedSmoothScroll.initIntersectionObserver();
  }, 1000);
  
  // Handle browser navigation
  window.addEventListener('popstate', () => {
    window.enhancedSmoothScroll.handlePopState();
  });
  
  // Handle initial hash on page load
  if (window.location.hash) {
    setTimeout(() => {
      window.enhancedSmoothScroll.handlePopState();
    }, 1500); // Delay to ensure page is fully loaded
  }
  
  console.log('✨ Enhanced smooth scroll initialized');
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.enhancedSmoothScroll) {
    window.enhancedSmoothScroll.destroy();
  }
});

// Global functions for backwards compatibility
window.scrollToSection = (sectionId) => {
  if (window.enhancedSmoothScroll) {
    window.enhancedSmoothScroll.scrollToSection(sectionId);
  }
};
