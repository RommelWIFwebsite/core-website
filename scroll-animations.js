/**
 * SCROLL ANIMATIONS - CORE CRYPTOCURRENCY WEBSITE
 * Enhanced scroll-based animations with Intersection Observer
 * Optimized for performance and better user experience
 * ==================================================================
 */

class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      root: null,
      rootMargin: '-10% 0px -10% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    };
    
    this.observers = new Map();
    this.animatedElements = new Set();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }

  init() {
    // Initialize only if Intersection Observer is supported
    if (!window.IntersectionObserver) {
      this.fallbackReveal();
      return;
    }

    this.setupObservers();
    this.bindEvents();
    
    console.log('🎬 Scroll animations initialized');
  }

  setupObservers() {
    // Main reveal observer
    this.createRevealObserver();
    
    // Parallax observer for performance
    this.createParallaxObserver();
    
    // Stagger observer for sequential animations
    this.createStaggerObserver();
  }

  createRevealObserver() {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.revealElement(entry.target, entry.intersectionRatio);
        }
      });
    }, this.observerOptions);

    // Observe all elements with scroll-fade class
    document.querySelectorAll('.scroll-fade').forEach(el => {
      if (!this.animatedElements.has(el)) {
        this.prepareElement(el, 'fade');
        revealObserver.observe(el);
        this.animatedElements.add(el);
      }
    });

    // Observe all elements with scroll-scale class
    document.querySelectorAll('.scroll-scale').forEach(el => {
      if (!this.animatedElements.has(el)) {
        this.prepareElement(el, 'scale');
        revealObserver.observe(el);
        this.animatedElements.add(el);
      }
    });

    // Observe all elements with scroll-slide class
    document.querySelectorAll('.scroll-slide').forEach(el => {
      if (!this.animatedElements.has(el)) {
        this.prepareElement(el, 'slide');
        revealObserver.observe(el);
        this.animatedElements.add(el);
      }
    });

    this.observers.set('reveal', revealObserver);
  }

  createParallaxObserver() {
    if (this.isReducedMotion) return;

    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleParallax(entry.target, entry.intersectionRatio);
        }
      });
    }, {
      ...this.observerOptions,
      rootMargin: '0px'
    });

    document.querySelectorAll('.scroll-parallax').forEach(el => {
      parallaxObserver.observe(el);
    });

    this.observers.set('parallax', parallaxObserver);
  }

  createStaggerObserver() {
    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.handleStagger(entry.target);
        }
      });
    }, this.observerOptions);

    document.querySelectorAll('[data-scroll-stagger]').forEach(container => {
      staggerObserver.observe(container);
    });

    this.observers.set('stagger', staggerObserver);
  }

  prepareElement(element, type) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    // Set initial styles based on animation type
    element.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    element.style.willChange = 'opacity, transform';

    switch (type) {
      case 'fade':
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        break;
      case 'scale':
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        break;
      case 'slide':
        const direction = element.dataset.slideDirection || 'up';
        const distance = element.dataset.slideDistance || '50px';
        
        switch (direction) {
          case 'left':
            element.style.transform = `translateX(-${distance})`;
            break;
          case 'right':
            element.style.transform = `translateX(${distance})`;
            break;
          case 'down':
            element.style.transform = `translateY(-${distance})`;
            break;
          default:
            element.style.transform = `translateY(${distance})`;
        }
        element.style.opacity = '0';
        break;
    }
  }

  revealElement(element, ratio) {
    if (this.isReducedMotion) return;

    // Add a small delay for natural feel
    const delay = parseInt(element.dataset.scrollDelay) || 0;
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0) translateX(0) scale(1)';
      
      // Remove will-change after animation
      setTimeout(() => {
        element.style.willChange = 'auto';
      }, 800);
      
      // Add revealed class for CSS animations
      element.classList.add('revealed');
      
      // Trigger custom event
      element.dispatchEvent(new CustomEvent('elementRevealed', {
        detail: { element, ratio }
      }));
    }, delay);
  }

  handleParallax(element, ratio) {
    if (this.isReducedMotion) return;

    const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
    const scrollTop = window.pageYOffset;
    const elementTop = element.offsetTop;
    const elementHeight = element.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate parallax offset
    const parallaxOffset = (scrollTop - elementTop + windowHeight) * speed;
    
    // Apply transform with hardware acceleration
    element.style.transform = `translate3d(0, ${parallaxOffset}px, 0)`;
  }

  handleStagger(container) {
    if (this.isReducedMotion) {
      container.querySelectorAll('*').forEach(child => {
        child.style.opacity = '1';
        child.style.transform = 'none';
      });
      return;
    }

    const children = container.children;
    const staggerDelay = parseInt(container.dataset.staggerDelay) || 100;
    const staggerDirection = container.dataset.staggerDirection || 'normal';
    
    Array.from(children).forEach((child, index) => {
      const delay = staggerDirection === 'reverse' 
        ? (children.length - 1 - index) * staggerDelay
        : index * staggerDelay;
      
      // Prepare child element
      child.style.opacity = '0';
      child.style.transform = 'translateY(20px)';
      child.style.transition = `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}ms`;
      
      // Trigger animation
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, delay);
    });
  }

  // Enhanced scroll-triggered animations
  addScrollTrigger(element, callback, options = {}) {
    const triggerOptions = {
      ...this.observerOptions,
      ...options
    };

    const triggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, entry.intersectionRatio);
          
          // Option to observe once
          if (options.once !== false) {
            triggerObserver.unobserve(entry.target);
          }
        }
      });
    }, triggerOptions);

    triggerObserver.observe(element);
    return triggerObserver;
  }

  // Counter animation
  animateCounter(element, target, duration = 2000) {
    if (this.isReducedMotion) {
      element.textContent = target.toLocaleString();
      return;
    }

    const start = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const startTime = performance.now();
    
    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOutQuart = (t) => 1 - (--t) * t * t * t;
      const current = Math.floor(start + (target - start) * easeOutQuart(progress));
      
      element.textContent = current.toLocaleString();
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    
    requestAnimationFrame(updateCounter);
  }

  // Typewriter effect
  typeWriter(element, text, speed = 50) {
    if (this.isReducedMotion) {
      element.textContent = text;
      return;
    }

    // Clear content and prepare element
    element.textContent = '';
    element.style.borderRight = '2px solid var(--color-accent-primary)';
    element.style.width = 'auto';
    
    let index = 0;
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          element.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    type();
  }

  // Fallback for browsers without Intersection Observer
  fallbackReveal() {
    document.querySelectorAll('.scroll-fade, .scroll-scale, .scroll-slide').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('revealed');
    });
  }

  bindEvents() {
    // Handle reduced motion preference changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      if (this.isReducedMotion) {
        this.disableAnimations();
      }
    });

    // Re-observe elements added dynamically
    window.addEventListener('contentUpdated', () => {
      this.updateObservers();
    });

    // Performance optimization: pause animations when page is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  updateObservers() {
    // Re-run observer setup for new elements
    this.setupObservers();
  }

  disableAnimations() {
    document.querySelectorAll('.scroll-fade, .scroll-scale, .scroll-slide').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.transition = 'none';
    });
  }

  pauseAnimations() {
    // Pause CSS animations and transitions
    document.documentElement.style.setProperty('--animation-play-state', 'paused');
  }

  resumeAnimations() {
    // Resume CSS animations and transitions
    document.documentElement.style.setProperty('--animation-play-state', 'running');
  }

  destroy() {
    // Clean up observers
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    this.animatedElements.clear();
  }
}

// Global scroll animation instance
let scrollAnimations;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  scrollAnimations = new ScrollAnimations();
  
  // Make available globally
  window.scrollAnimations = scrollAnimations;
  
  // Add scroll trigger examples for specific numeric elements only
  const heroStats = document.querySelectorAll('.counter-animate');
  heroStats.forEach(stat => {
    const textContent = stat.textContent.replace(/,/g, '');
    const targetValue = parseInt(textContent);
    
    // Only animate if the content is actually a number
    if (!isNaN(targetValue) && targetValue > 0) {
      scrollAnimations.addScrollTrigger(stat, () => {
        scrollAnimations.animateCounter(stat, targetValue);
      }, { once: true });
    }
  });
  
  // Typewriter effect for hero subtitle - runs immediately since it's above the fold
  const typewriterElement = document.getElementById('typewriter-content');
  if (typewriterElement) {
    const text = typewriterElement.textContent.trim();
    
    // Only run if element hasn't been modified yet
    if (text && text.length > 0 && !typewriterElement.hasAttribute('data-typewriter-active')) {
      typewriterElement.setAttribute('data-typewriter-active', 'true');
      
      // Run typewriter immediately for hero section
      setTimeout(() => {
        scrollAnimations.typeWriter(typewriterElement, text);
      }, 1500); // Delay to let page load
    }
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (scrollAnimations) {
    scrollAnimations.destroy();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScrollAnimations;
}
