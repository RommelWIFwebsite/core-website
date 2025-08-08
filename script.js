/**
 * CORE CRYPTOCURRENCY WEBSITE - MAIN JAVASCRIPT
 * Interactive functionalities and animations
 * ==================================================================
 */

// Global Configuration
const CONFIG = {
  contractAddress: '4FdojUmXeaFMBG6yUaoufAC5Bz7u9AwnSAMizkx5pump',
  totalSupply: 1000000000,
  animationDuration: 300,
  typingSpeed: 50,
  particleCount: 50,
  matrixChars: '01◉♦∞⚡💎🌐',
  soundEnabled: false
};

// DOM Elements Cache
const elements = {
  loadingScreen: null,
  navbar: null,
  navToggle: null,
  navMenu: null,
  navLinks: null,
  heroSection: null,
  particlesContainer: null,
  totalSupply: null,
  contractText: null,
  revealElements: null
};

// Application State
const state = {
  isLoading: true,
  currentSection: 'home',
  particles: [],
  matrixDrops: [],
  isScrolling: false,
  lastScrollTop: 0,
  scrollDirection: 'up',
  navbarVisible: true,
  soundContext: null
};

/**
 * Initialize the application
 */
function init() {
  console.log('🚀 CORE Website initializing...');
  
  // Ensure we start at the top of the page - multiple attempts
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  
  // Clear any hash in URL to prevent auto-scroll
  if (window.location.hash) {
    history.replaceState(null, null, window.location.pathname);
    window.scrollTo(0, 0);
  }
  
  // Force scroll to top after a short delay
  setTimeout(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, 100);
  
  // Cache DOM elements
  cacheElements();
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize animations
  initializeAnimations();
  
  // Start loading sequence
  startLoadingSequence();
  
  // Initialize navbar
  initializeNavbar();
  
  // Initialize typewriter effect
  initializeTypewriter();
  
  // Initialize particles
  initializeParticles();
  
  // Initialize matrix rain
  initializeMatrixRain();
  
  // Note: Scroll reveal animations are now handled by scroll-animations.js
  
  // Initialize audio context
  initializeAudio();
  
  console.log('✅ CORE Website initialized successfully');
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
  elements.loadingScreen = document.getElementById('loading-screen');
  elements.navbar = document.getElementById('navbar');
  elements.navToggle = document.getElementById('nav-toggle');
  elements.navMenu = document.getElementById('nav-menu');
  elements.navLinks = document.querySelectorAll('.nav-link');
  elements.heroSection = document.getElementById('home');
  elements.particlesContainer = document.querySelector('.particles-container');
  elements.totalSupply = document.getElementById('total-supply');
  elements.contractText = document.getElementById('contract-text');
  // Note: scroll animations are now handled by scroll-animations.js
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
  // Window events
  window.addEventListener('load', handleWindowLoad);
  window.addEventListener('scroll', throttle(handleScroll, 16));
  window.addEventListener('resize', throttle(handleResize, 100));
  
  // Mobile touch events for navbar
  let touchStartY = 0;
  let touchEndY = 0;
  
  document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    const touchDelta = touchStartY - touchEndY;
    
    // Handle touch scroll for navbar
    if (Math.abs(touchDelta) > 50) {
      const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
      state.scrollDirection = touchDelta > 0 ? 'down' : 'up';
      updateNavbarVisibility(currentScrollTop);
    }
  }, { passive: true });
  
  // Navigation events
  if (elements.navToggle) {
    elements.navToggle.addEventListener('click', toggleMobileMenu);
  }
  
  elements.navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick);
  });
  
  // Copy contract address
  const contractElements = document.querySelectorAll('[onclick="copyContractAddress()"]');
  contractElements.forEach(el => {
    el.addEventListener('click', copyContractAddress);
  });
  
  // Scroll to section buttons
  const scrollButtons = document.querySelectorAll('[onclick^="scrollToSection"]');
  scrollButtons.forEach(btn => {
    const section = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
    btn.addEventListener('click', () => scrollToSection(section));
  });
  
  // Keyboard events
  document.addEventListener('keydown', handleKeydown);
  
  // Mouse events for particle interaction
  if (elements.particlesContainer) {
    elements.particlesContainer.addEventListener('mousemove', handleParticleInteraction);
  }
}

/**
 * Handle window load event
 */
function handleWindowLoad() {
  hideLoadingScreen(); // Hide immediately
}

/**
 * Handle scroll events
 */
function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Update navbar visibility
  updateNavbarVisibility(scrollTop);
  
  // Update active navigation link
  updateActiveNavLink();
  
  // Note: Scroll reveal animations are now handled by scroll-animations.js
  
  // Update parallax effects
  updateParallaxEffects(scrollTop);
  
  state.lastScrollTop = scrollTop;
}

/**
 * Handle window resize
 */
function handleResize() {
  // Recalculate particle positions
  if (state.particles.length > 0) {
    initializeParticles();
  }
  
  // Update matrix rain
  if (state.matrixDrops.length > 0) {
    initializeMatrixRain();
  }
}

/**
 * Handle navigation clicks
 */
function handleNavClick(e) {
  e.preventDefault();
  const target = e.target.getAttribute('data-section');
  if (target) {
    scrollToSection(target);
    if (elements.navMenu.classList.contains('active')) {
      toggleMobileMenu();
    }
  }
}

/**
 * Handle keyboard events
 */
function handleKeydown(e) {
  // Easter egg: Konami code
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown' || 
      e.code === 'ArrowLeft' || e.code === 'ArrowRight' ||
      e.code === 'KeyB' || e.code === 'KeyA') {
    handleKonamiCode(e.code);
  }
  
  // ESC key to close mobile menu
  if (e.key === 'Escape' && elements.navMenu.classList.contains('active')) {
    toggleMobileMenu();
  }
}

/**
 * Loading sequence
 */
function startLoadingSequence() {
  const loadingText = document.querySelector('.loading-text');
  const loadingProgress = document.querySelector('.loading-progress');
  const loadingStatus = document.querySelector('.loading-status');
  
  if (!loadingText || !loadingProgress || !loadingStatus) return;
  
  const steps = [
    { text: 'INITIALIZING CORE...', status: 'NET_STATUS: CONNECTING...', progress: 20 },
    { text: 'LOADING BLOCKCHAIN...', status: 'NET_STATUS: SYNCING...', progress: 40 },
    { text: 'ESTABLISHING CONNECTION...', status: 'NET_STATUS: HANDSHAKE...', progress: 60 },
    { text: 'VERIFYING CONTRACTS...', status: 'NET_STATUS: VERIFIED...', progress: 80 },
    { text: 'CORE READY', status: 'NET_STATUS: ONLINE', progress: 100 }
  ];
  
  let currentStep = 0;
  
  const updateStep = () => {
    if (currentStep >= steps.length) return;
    
    const step = steps[currentStep];
    loadingText.textContent = step.text;
    loadingStatus.textContent = step.status;
    loadingProgress.style.width = `${step.progress}%`;
    
    currentStep++;
    
    if (currentStep < steps.length) {
      setTimeout(updateStep, 400);
    }
  };
  
  updateStep();
}

/**
 * Hide loading screen
 */
function hideLoadingScreen() {
  if (elements.loadingScreen) {
    elements.loadingScreen.style.display = 'none';
    state.isLoading = false;
  }
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  if (elements.navToggle && elements.navMenu) {
    elements.navToggle.classList.toggle('active');
    elements.navMenu.classList.toggle('active');
  }
}

/**
 * Update navbar visibility based on scroll
 */
function updateNavbarVisibility(scrollTop) {
  if (!elements.navbar) return;
  
  const scrollDelta = scrollTop - state.lastScrollTop;
  const scrollThreshold = 5; // Minimum scroll distance to trigger change
  const hideThreshold = 80; // Minimum scroll position to start hiding
  
  // Determine scroll direction with better sensitivity
  if (Math.abs(scrollDelta) > scrollThreshold) {
    state.scrollDirection = scrollDelta > 0 ? 'down' : 'up';
  }
  
  // Always show navbar at the top
  if (scrollTop <= hideThreshold) {
    showNavbar();
  } else {
    // Hide navbar when scrolling down, show when scrolling up
    if (state.scrollDirection === 'down') {
      hideNavbar();
    } else if (state.scrollDirection === 'up') {
      showNavbar();
    }
  }
  
  // Add scrolled class for background change
  if (scrollTop > 50) {
    elements.navbar.classList.add('scrolled');
  } else {
    elements.navbar.classList.remove('scrolled');
  }
}

/**
 * Show navbar with smooth animation
 */
function showNavbar() {
  if (!state.navbarVisible) {
    elements.navbar.classList.remove('hidden');
    state.navbarVisible = true;
  }
}

/**
 * Hide navbar with smooth animation
 */
function hideNavbar() {
  if (state.navbarVisible) {
    elements.navbar.classList.add('hidden');
    state.navbarVisible = false;
  }
}

/**
 * Update active navigation link
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let currentSection = '';
  
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 100 && rect.bottom >= 100) {
      currentSection = section.id;
    }
  });
  
  if (currentSection && currentSection !== state.currentSection) {
    state.currentSection = currentSection;
    
    elements.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }
}

/**
 * Trigger reveal animations - Now handled by scroll-animations.js
 * This function is kept for legacy compatibility but functionality moved to scroll-animations.js
 */
function triggerRevealAnimations() {
  // Legacy function - functionality moved to scroll-animations.js for better performance
  console.log('Reveal animations now handled by scroll-animations.js');
}

/**
 * Update parallax effects - Enhanced with scroll-animations.js
 */
function updateParallaxEffects(scrollTop) {
  const heroBackground = document.querySelector('.hero-background');
  if (heroBackground) {
    const parallaxSpeed = 0.5;
    const transform = `translate3d(0, ${scrollTop * parallaxSpeed}px, 0)`;
    heroBackground.style.transform = transform;
  }
}

/**
 * Scroll to section
 */
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const offset = 80; // Account for fixed navbar
    const top = section.offsetTop - offset;
    
    window.scrollTo({
      top: top,
      behavior: 'smooth'
    });
    
    // Play sound effect
    playSound('click');
  }
}

/**
 * Copy contract address to clipboard
 */
function copyContractAddress() {
  const address = CONFIG.contractAddress;
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(address).then(() => {
      showNotification('Contract address copied!', 'success');
      playSound('success');
    }).catch(() => {
      fallbackCopyTextToClipboard(address);
    });
  } else {
    fallbackCopyTextToClipboard(address);
  }
}

/**
 * Fallback method to copy text
 */
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('Contract address copied!', 'success');
      playSound('success');
    } else {
      showNotification('Failed to copy address', 'error');
    }
  } catch (err) {
    showNotification('Failed to copy address', 'error');
  }
  
  document.body.removeChild(textArea);
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    maxWidth: '300px'
  });
  
  // Set background color based on type
  const colors = {
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-accent-primary)'
  };
  
  notification.style.background = colors[type] || colors.info;
  
  document.body.appendChild(notification);
  
  // Trigger animation
  requestAnimationFrame(() => {
    notification.style.transform = 'translateX(0)';
  });
  
  // Remove after delay
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

/**
 * Initialize particles
 */
function initializeParticles() {
  if (!elements.particlesContainer) return;
  
  elements.particlesContainer.innerHTML = '';
  state.particles = [];
  
  for (let i = 0; i < CONFIG.particleCount; i++) {
    createParticle();
  }
  
  animateParticles();
}

/**
 * Create a single particle
 */
function createParticle() {
  const particle = document.createElement('div');
  particle.className = 'particle';
  
  const size = Math.random() * 4 + 1;
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const vx = (Math.random() - 0.5) * 0.5;
  const vy = (Math.random() - 0.5) * 0.5;
  const opacity = Math.random() * 0.5 + 0.1;
  
  Object.assign(particle.style, {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    background: 'var(--color-accent-primary)',
    borderRadius: '50%',
    left: `${x}px`,
    top: `${y}px`,
    opacity: opacity,
    pointerEvents: 'none'
  });
  
  const particleData = { element: particle, x, y, vx, vy, size, opacity };
  state.particles.push(particleData);
  elements.particlesContainer.appendChild(particle);
}

/**
 * Animate particles
 */
function animateParticles() {
  state.particles.forEach(particle => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    
    // Wrap around screen
    if (particle.x < 0) particle.x = window.innerWidth;
    if (particle.x > window.innerWidth) particle.x = 0;
    if (particle.y < 0) particle.y = window.innerHeight;
    if (particle.y > window.innerHeight) particle.y = 0;
    
    particle.element.style.left = `${particle.x}px`;
    particle.element.style.top = `${particle.y}px`;
  });
  
  requestAnimationFrame(animateParticles);
}

/**
 * Handle particle interaction
 */
function handleParticleInteraction(e) {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const influenceRadius = 100;
  
  state.particles.forEach(particle => {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < influenceRadius) {
      const force = (influenceRadius - distance) / influenceRadius;
      particle.vx += (dx / distance) * force * 0.01;
      particle.vy += (dy / distance) * force * 0.01;
      
      // Add glow effect
      particle.element.style.boxShadow = `0 0 10px var(--color-accent-primary)`;
      
      setTimeout(() => {
        particle.element.style.boxShadow = 'none';
      }, 100);
    }
  });
}

/**
 * Initialize matrix rain effect
 */
function initializeMatrixRain() {
  const matrixContainer = document.querySelector('.matrix-rain');
  if (!matrixContainer) return;
  
  matrixContainer.innerHTML = '';
  state.matrixDrops = [];
  
  const columns = Math.floor(window.innerWidth / 20);
  
  for (let i = 0; i < columns; i++) {
    createMatrixDrop(i * 20);
  }
  
  animateMatrixRain();
}

/**
 * Create a matrix drop
 */
function createMatrixDrop(x) {
  const drop = document.createElement('div');
  drop.className = 'matrix-drop';
  drop.textContent = CONFIG.matrixChars[Math.floor(Math.random() * CONFIG.matrixChars.length)];
  
  Object.assign(drop.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `-20px`,
    color: 'var(--color-accent-primary)',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    opacity: '0.7',
    pointerEvents: 'none'
  });
  
  const dropData = {
    element: drop,
    x,
    y: -20,
    speed: Math.random() * 3 + 1,
    char: drop.textContent
  };
  
  state.matrixDrops.push(dropData);
  document.querySelector('.matrix-rain').appendChild(drop);
}

/**
 * Animate matrix rain
 */
function animateMatrixRain() {
  state.matrixDrops.forEach((drop, index) => {
    drop.y += drop.speed;
    drop.element.style.top = `${drop.y}px`;
    
    // Change character occasionally
    if (Math.random() < 0.01) {
      drop.element.textContent = CONFIG.matrixChars[Math.floor(Math.random() * CONFIG.matrixChars.length)];
    }
    
    // Reset when off screen
    if (drop.y > window.innerHeight) {
      drop.y = -20;
      drop.speed = Math.random() * 3 + 1;
    }
  });
  
  requestAnimationFrame(animateMatrixRain);
}

/**
 * Initialize reveal animations - Now handled by scroll-animations.js
 * This function is kept for legacy compatibility
 */
function initializeRevealAnimations() {
  // Legacy function - functionality moved to scroll-animations.js for better performance
  console.log('Reveal animations now handled by scroll-animations.js with Intersection Observer');
}

/**
 * Initialize navbar
 */
function initializeNavbar() {
  // Ensure navbar starts visible
  state.navbarVisible = true;
  if (elements.navbar) {
    elements.navbar.classList.remove('hidden');
  }
}

/**
 * Initialize typewriter effect
 */
function initializeTypewriter() {
  const typewriterElement = document.getElementById('typewriter-content');
  if (!typewriterElement) return;
  
  const text = typewriterElement.textContent;
  typewriterElement.textContent = '';
  typewriterElement.style.width = 'auto';
  typewriterElement.style.borderRight = '2px solid var(--color-accent-primary)';
  
  let index = 0;
  const speed = 50; // milliseconds per character
  
  function type() {
    if (index < text.length) {
      typewriterElement.textContent += text.charAt(index);
      index++;
      setTimeout(type, speed);
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        typewriterElement.style.borderRight = 'none';
      }, 1000);
    }
  }
  
  // Start typing after a delay
  setTimeout(type, 1000);
}

/**
 * Initialize animations
 */
function initializeAnimations() {
  // Animate supply counter
  animateCounter();
  
  // Add glitch effect to random elements
  addGlitchEffects();
  
  // Initialize floating symbols
  initializeFloatingSymbols();
}

/**
 * Animate supply counter
 */
function animateCounter() {
  if (!elements.totalSupply) return;
  
  const targetValue = CONFIG.totalSupply;
  const duration = 2000;
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = Math.floor(targetValue * easeOutQuart(progress));
    elements.totalSupply.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }
  
  requestAnimationFrame(updateCounter);
}

/**
 * Add glitch effects to random elements
 */
function addGlitchEffects() {
  const glitchElements = document.querySelectorAll('.core-highlight, .terminal-title');
  
  glitchElements.forEach(element => {
    setInterval(() => {
      if (Math.random() < 0.1) {
        element.classList.add('glitch');
        setTimeout(() => {
          element.classList.remove('glitch');
        }, 200);
      }
    }, 3000);
  });
}

/**
 * Initialize floating symbols
 */
function initializeFloatingSymbols() {
  const container = document.querySelector('.floating-symbols');
  if (!container) return;
  
  const symbols = ['◉', '♦', '∞', '⚡', '💎', '🌐'];
  
  for (let i = 0; i < 10; i++) {
    const symbol = document.createElement('div');
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    symbol.className = 'floating-symbol';
    
    Object.assign(symbol.style, {
      position: 'absolute',
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      fontSize: `${Math.random() * 20 + 10}px`,
      color: 'var(--color-accent-primary)',
      opacity: '0.1',
      pointerEvents: 'none',
      animation: `float ${Math.random() * 10 + 10}s linear infinite`
    });
    
    container.appendChild(symbol);
  }
}

/**
 * Initialize audio context
 */
function initializeAudio() {
  if (!CONFIG.soundEnabled) return;
  
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    state.soundContext = new AudioContext();
  } catch (e) {
    console.warn('Audio context not supported');
  }
}

/**
 * Play sound effect
 */
function playSound(type) {
  if (!CONFIG.soundEnabled || !state.soundContext) return;
  
  const frequency = {
    click: 800,
    success: 1000,
    error: 400,
    notification: 600
  };
  
  const freq = frequency[type] || 600;
  
  const oscillator = state.soundContext.createOscillator();
  const gainNode = state.soundContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(state.soundContext.destination);
  
  oscillator.frequency.setValueAtTime(freq, state.soundContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, state.soundContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, state.soundContext.currentTime + 0.1);
  
  oscillator.start(state.soundContext.currentTime);
  oscillator.stop(state.soundContext.currentTime + 0.1);
}

/**
 * Konami code easter egg
 */
let konamiSequence = [];
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                   'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                   'KeyB', 'KeyA'];

function handleKonamiCode(key) {
  konamiSequence.push(key);
  
  if (konamiSequence.length > konamiCode.length) {
    konamiSequence.shift();
  }
  
  if (konamiSequence.length === konamiCode.length && 
      konamiSequence.every((key, index) => key === konamiCode[index])) {
    activateEasterEgg();
    konamiSequence = [];
  }
}

/**
 * Activate easter egg
 */
function activateEasterEgg() {
  showNotification('🎉 CORE UNLOCKED! Maximum power achieved!', 'success');
  
  // Add special effects
  document.body.style.animation = 'rainbow 2s linear infinite';
  
  // Add rainbow animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Remove effect after 5 seconds
  setTimeout(() => {
    document.body.style.animation = '';
    document.head.removeChild(style);
  }, 5000);
  
  // Trigger confetti
  createConfetti();
}

/**
 * Create confetti effect
 */
function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10000;
  `;
  
  document.body.appendChild(confettiContainer);
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.textContent = ['◉', '♦', '∞', '⚡', '💎'][Math.floor(Math.random() * 5)];
    confetti.style.cssText = `
      position: absolute;
      top: -10px;
      left: ${Math.random() * 100}%;
      color: hsl(${Math.random() * 360}, 100%, 50%);
      font-size: ${Math.random() * 20 + 10}px;
      animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
    `;
    
    confettiContainer.appendChild(confetti);
  }
  
  // Add confetti animation
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confetti-fall {
      0% {
        transform: translateY(-10px) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(${window.innerHeight + 10}px) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(confettiStyle);
  
  // Clean up
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
    document.head.removeChild(confettiStyle);
  }, 5000);
}

/**
 * Utility Functions
 */

// Throttle function
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Debounce function
function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Easing functions
function easeOutQuart(t) {
  return 1 - (--t) * t * t * t;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}

// Random utilities
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Performance monitoring
function logPerformance() {
  if (window.performance) {
    console.log(`🚀 Page loaded in ${window.performance.timing.loadEventEnd - window.performance.timing.navigationStart}ms`);
  }
}

/**
 * Global functions (called from HTML)
 */
window.scrollToSection = scrollToSection;
window.copyContractAddress = copyContractAddress;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Ensure scroll to top when everything is loaded
window.addEventListener('load', () => {
  logPerformance();
  // Force scroll to top again
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    CONFIG,
    scrollToSection,
    copyContractAddress,
    showNotification
  };
}
