/**
 * ANIMATED STARS BACKGROUND - CORE CRYPTOCURRENCY WEBSITE
 * Interactive stars that respond to mouse cursor movements
 * Active from "philosophy" section to footer for investor engagement
 * ==================================================================
 */

class AnimatedStars {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.stars = [];
    this.mouse = { x: 0, y: 0 };
    this.isActive = false;
    this.animationId = null;
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Configuration for optimal performance
    this.config = {
      starCount: window.innerWidth < 768 ? 80 : 150, // Fewer stars on mobile
      maxRadius: 2,
      minRadius: 0.5,
      mouseInfluence: 100,
      starSpeed: 0.2,
      connectionDistance: window.innerWidth < 768 ? 80 : 120,
      maxConnections: 3,
      twinkleChance: 0.01,
      colors: [
        'rgba(74, 144, 226, 0.8)',   // Primary blue
        'rgba(107, 182, 255, 0.6)',  // Light blue
        'rgba(46, 92, 138, 0.7)',    // Dark blue
        'rgba(255, 255, 255, 0.5)'   // White
      ]
    };
    
    this.init();
  }

  init() {
    this.createCanvas();
    this.createStars();
    this.bindEvents();
    this.checkVisibility();
    this.animate();
  }

  createCanvas() {
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'stars-canvas';
    this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 1;
      opacity: 0;
      transition: opacity 0.5s ease;
    `;
    
    // Add canvas to body
    document.body.appendChild(this.canvas);
    
    // Get context and set up canvas
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
  }

  resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
  }

  createStars() {
    this.stars = [];
    
    for (let i = 0; i < this.config.starCount; i++) {
      this.stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * (this.config.maxRadius - this.config.minRadius) + this.config.minRadius,
        originalRadius: 0,
        vx: (Math.random() - 0.5) * this.config.starSpeed,
        vy: (Math.random() - 0.5) * this.config.starSpeed,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
        twinkle: Math.random(),
        twinkleSpeed: 0.02 + Math.random() * 0.03,
        brightness: 0.3 + Math.random() * 0.7
      });
    }
    
    // Set original radius for each star
    this.stars.forEach(star => {
      star.originalRadius = star.radius;
    });
  }

  bindEvents() {
    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });

    // Touch events for mobile
    if (this.isTouch) {
      document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          this.mouse.x = e.touches[0].clientX;
          this.mouse.y = e.touches[0].clientY;
        }
      }, { passive: true });
    }

    // Window resize
    window.addEventListener('resize', () => {
      this.resizeCanvas();
      this.adjustStarCount();
    });

    // Scroll event to check visibility
    window.addEventListener('scroll', () => {
      this.checkVisibility();
    }, { passive: true });

    // Page visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  adjustStarCount() {
    const newCount = window.innerWidth < 768 ? 80 : 150;
    
    if (newCount !== this.config.starCount) {
      this.config.starCount = newCount;
      this.config.connectionDistance = window.innerWidth < 768 ? 80 : 120;
      this.createStars();
    }
  }

  checkVisibility() {
    // Check if we're in the sections where stars should be visible
    const philosophySection = document.getElementById('about');
    const footer = document.querySelector('.footer');
    
    if (!philosophySection) return;
    
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const philosophyTop = philosophySection.offsetTop;
    const footerBottom = footer ? footer.offsetTop + footer.offsetHeight : document.body.scrollHeight;
    
    // Show stars from philosophy section to footer
    const shouldShow = scrollY + windowHeight > philosophyTop && scrollY < footerBottom;
    
    if (shouldShow && !this.isActive) {
      this.show();
    } else if (!shouldShow && this.isActive) {
      this.hide();
    }
  }

  show() {
    this.isActive = true;
    this.canvas.style.opacity = '1';
  }

  hide() {
    this.isActive = false;
    this.canvas.style.opacity = '0';
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.animationId) {
      this.animate();
    }
  }

  updateStars() {
    this.stars.forEach((star, index) => {
      // Update position
      star.x += star.vx;
      star.y += star.vy;
      
      // Wrap around screen edges
      if (star.x < 0) star.x = window.innerWidth;
      if (star.x > window.innerWidth) star.x = 0;
      if (star.y < 0) star.y = window.innerHeight;
      if (star.y > window.innerHeight) star.y = 0;
      
      // Update twinkle effect
      star.twinkle += star.twinkleSpeed;
      if (star.twinkle > 1) star.twinkle = 0;
      
      // Mouse interaction - smooth cursor influence
      const dx = this.mouse.x - star.x;
      const dy = this.mouse.y - star.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < this.config.mouseInfluence) {
        const force = (this.config.mouseInfluence - distance) / this.config.mouseInfluence;
        const angle = Math.atan2(dy, dx);
        
        // Gentle repulsion effect
        star.vx -= Math.cos(angle) * force * 0.01;
        star.vy -= Math.sin(angle) * force * 0.01;
        
        // Increase size and brightness when near cursor
        star.radius = star.originalRadius * (1 + force * 0.5);
        star.brightness = Math.min(1, star.brightness + force * 0.3);
      } else {
        // Return to original size and brightness
        star.radius = star.originalRadius;
        star.brightness = Math.max(0.3, star.brightness - 0.01);
      }
      
      // Apply velocity damping
      star.vx *= 0.99;
      star.vy *= 0.99;
      
      // Keep velocity within bounds
      const maxVel = this.config.starSpeed * 2;
      star.vx = Math.max(-maxVel, Math.min(maxVel, star.vx));
      star.vy = Math.max(-maxVel, Math.min(maxVel, star.vy));
    });
  }

  drawStars() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (!this.isActive) return;
    
    // Draw connections first (behind stars)
    this.drawConnections();
    
    // Draw stars
    this.stars.forEach(star => {
      this.ctx.save();
      
      // Apply twinkle effect
      const twinkleIntensity = Math.sin(star.twinkle * Math.PI * 2) * 0.3 + 0.7;
      const alpha = star.brightness * twinkleIntensity;
      
      // Set color with dynamic alpha
      const colorWithAlpha = star.color.replace(/[\d.]+\)$/g, `${alpha})`);
      
      // Draw star with glow effect
      this.ctx.fillStyle = colorWithAlpha;
      this.ctx.shadowColor = star.color;
      this.ctx.shadowBlur = star.radius * 3;
      
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });
  }

  drawConnections() {
    let connectionCount = 0;
    const maxTotalConnections = window.innerWidth < 768 ? 50 : 100;
    
    for (let i = 0; i < this.stars.length && connectionCount < maxTotalConnections; i++) {
      const star1 = this.stars[i];
      let starConnections = 0;
      
      for (let j = i + 1; j < this.stars.length && starConnections < this.config.maxConnections; j++) {
        const star2 = this.stars[j];
        const dx = star1.x - star2.x;
        const dy = star1.y - star2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < this.config.connectionDistance) {
          // Calculate line opacity based on distance
          const opacity = (this.config.connectionDistance - distance) / this.config.connectionDistance;
          
          this.ctx.save();
          this.ctx.strokeStyle = `rgba(74, 144, 226, ${opacity * 0.3})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.beginPath();
          this.ctx.moveTo(star1.x, star1.y);
          this.ctx.lineTo(star2.x, star2.y);
          this.ctx.stroke();
          this.ctx.restore();
          
          starConnections++;
          connectionCount++;
        }
      }
    }
  }

  animate() {
    this.updateStars();
    this.drawStars();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.pause();
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// Initialize stars animation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if not on mobile or if performance allows
  const shouldInitialize = window.innerWidth > 480 || 
                          (window.devicePixelRatio <= 2 && !window.navigator.userAgent.includes('Mobile'));
  
  if (shouldInitialize) {
    window.animatedStars = new AnimatedStars();
    console.log('✨ Animated stars initialized');
  } else {
    console.log('📱 Animated stars disabled on this device for performance');
  }
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.animatedStars) {
    window.animatedStars.destroy();
  }
});
