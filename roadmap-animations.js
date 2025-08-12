/**
 * ENHANCED ROADMAP ANIMATIONS - CORE CRYPTOCURRENCY WEBSITE
 * Interactive timeline animations and progress tracking
 * ==================================================================
 */

class RoadmapAnimations {
  constructor() {
    this.timeline = null;
    this.timelineProgress = null;
    this.timelineItems = [];
    this.progressPercentage = 40; // Current progress
    this.isAnimating = false;
    
    this.init();
  }

  init() {
    this.timeline = document.querySelector('.roadmap-timeline');
    this.timelineProgress = document.querySelector('.timeline-progress');
    this.timelineItems = Array.from(document.querySelectorAll('.timeline-item'));
    
    if (!this.timeline) return;
    
    this.setupIntersectionObserver();
    this.animateProgressBar();
    this.setupMarkerAnimations();
    this.setupHoverEffects();
    
    console.log('🎯 Roadmap animations initialized');
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.3, 0.7]
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const item = entry.target;
        
        if (entry.isIntersecting) {
          this.animateTimelineItem(item);
          
          // Special animation for active phase
          if (item.classList.contains('active')) {
            this.animateActivePhase(item);
          }
        }
      });
    }, options);

    this.timelineItems.forEach(item => {
      observer.observe(item);
    });
  }

  animateTimelineItem(item) {
    if (item.classList.contains('animated')) return;
    
    // Add reveal animation
    item.classList.add('revealed');
    item.classList.add('animated');
    
    // Animate marker with delay
    const marker = item.querySelector('.timeline-marker');
    if (marker) {
      setTimeout(() => {
        marker.style.transform = 'translateX(-50%) scale(1.1)';
        setTimeout(() => {
          marker.style.transform = 'translateX(-50%) scale(1)';
        }, 300);
      }, 200);
    }
    
    // Animate features with stagger
    const features = item.querySelectorAll('.feature-item');
    features.forEach((feature, index) => {
      setTimeout(() => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
          feature.style.transition = 'all 0.5s ease';
          feature.style.opacity = '1';
          feature.style.transform = 'translateX(0)';
        }, 50);
      }, index * 100 + 400);
    });
    
    // Trigger custom event
    item.dispatchEvent(new CustomEvent('timelineItemRevealed'));
  }

  animateActivePhase(item) {
    const progressBar = item.querySelector('.progress-fill');
    if (progressBar) {
      // Animate progress bar
      setTimeout(() => {
        const currentWidth = progressBar.style.width;
        progressBar.style.width = '0%';
        
        setTimeout(() => {
          progressBar.style.transition = 'width 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          progressBar.style.width = currentWidth;
        }, 100);
      }, 800);
    }
    
    // Animate status loader
    const statusLoader = item.querySelector('.status-loader');
    if (statusLoader) {
      statusLoader.style.opacity = '1';
    }
  }

  animateProgressBar() {
    if (!this.timelineProgress) return;
    
    // Set initial height based on progress percentage
    const totalHeight = this.timeline.scrollHeight;
    const targetHeight = (this.progressPercentage / 100) * totalHeight;
    
    // Animate progress line on scroll
    const animateOnScroll = () => {
      const rect = this.timeline.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const timelineTop = rect.top;
      const timelineHeight = rect.height;
      
      // Calculate visible percentage
      const visibleStart = Math.max(0, viewportHeight - timelineTop);
      const visibleEnd = Math.min(viewportHeight, viewportHeight - timelineTop + timelineHeight);
      const visibleHeight = visibleEnd - visibleStart;
      const visiblePercentage = Math.max(0, Math.min(1, visibleHeight / viewportHeight));
      
      // Update progress height
      const currentHeight = Math.min(targetHeight, targetHeight * visiblePercentage * 2);
      this.timelineProgress.style.height = `${currentHeight}px`;
    };
    
    // Initial animation
    setTimeout(() => {
      this.timelineProgress.style.transition = 'height 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      animateOnScroll();
    }, 500);
    
    // Update on scroll
    window.addEventListener('scroll', animateOnScroll, { passive: true });
  }

  setupMarkerAnimations() {
    this.timelineItems.forEach((item, index) => {
      const marker = item.querySelector('.timeline-marker');
      const markerCore = item.querySelector('.marker-core');
      const markerGlow = item.querySelector('.marker-glow');
      
      if (!marker) return;
      
      // Click animation
      marker.addEventListener('click', (e) => {
        e.preventDefault();
        this.animateMarkerClick(marker, markerCore);
      });
      
      // Hover animations
      marker.addEventListener('mouseenter', () => {
        if (markerGlow) {
          markerGlow.style.opacity = '0.6';
          markerGlow.style.transform = 'scale(1.1)';
        }
        
        if (markerCore) {
          markerCore.style.transform = 'scale(1.05)';
        }
      });
      
      marker.addEventListener('mouseleave', () => {
        if (markerGlow && !item.classList.contains('active')) {
          markerGlow.style.opacity = '0';
          markerGlow.style.transform = 'scale(1)';
        }
        
        if (markerCore) {
          markerCore.style.transform = 'scale(1)';
        }
      });
    });
  }

  animateMarkerClick(marker, markerCore) {
    // Ripple effect
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: rgba(74, 144, 226, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple-effect 0.6s ease-out;
      pointer-events: none;
      z-index: -1;
    `;
    
    marker.appendChild(ripple);
    
    // Core animation
    if (markerCore) {
      markerCore.style.transform = 'scale(0.9)';
      setTimeout(() => {
        markerCore.style.transform = 'scale(1.1)';
        setTimeout(() => {
          markerCore.style.transform = 'scale(1)';
        }, 150);
      }, 100);
    }
    
    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupHoverEffects() {
    this.timelineItems.forEach(item => {
      const content = item.querySelector('.timeline-content');
      
      if (!content) return;
      
      content.addEventListener('mouseenter', () => {
        // Enhance glow effect
        const marker = item.querySelector('.marker-glow');
        if (marker) {
          marker.style.opacity = '0.4';
        }
        
        // Animate features
        const features = content.querySelectorAll('.feature-item');
        features.forEach((feature, index) => {
          setTimeout(() => {
            feature.style.transform = 'translateX(5px)';
          }, index * 50);
        });
      });
      
      content.addEventListener('mouseleave', () => {
        // Reset glow effect
        const marker = item.querySelector('.marker-glow');
        if (marker && !item.classList.contains('active')) {
          marker.style.opacity = '0';
        }
        
        // Reset features
        const features = content.querySelectorAll('.feature-item');
        features.forEach(feature => {
          feature.style.transform = 'translateX(0)';
        });
      });
    });
  }

  // Method to update progress (can be called externally)
  updateProgress(percentage) {
    this.progressPercentage = Math.max(0, Math.min(100, percentage));
    
    if (this.timelineProgress) {
      const totalHeight = this.timeline.scrollHeight;
      const targetHeight = (this.progressPercentage / 100) * totalHeight;
      
      this.timelineProgress.style.transition = 'height 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      this.timelineProgress.style.height = `${targetHeight}px`;
    }
    
    // Update stat card
    const progressStat = document.querySelector('.roadmap-stats .stat-value');
    if (progressStat && progressStat.textContent.includes('%')) {
      progressStat.textContent = `${this.progressPercentage}%`;
    }
  }

  // Animate stat cards
  animateStats() {
    const statCards = document.querySelectorAll('.roadmap-stats .stat-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
              entry.target.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, 50);
          }, index * 200);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.3
    });
    
    statCards.forEach(card => {
      observer.observe(card);
    });
  }

  destroy() {
    // Clean up event listeners and observers
    window.removeEventListener('scroll', this.animateProgressBar);
  }
}

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-effect {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
    }
    100% {
      width: 100px;
      height: 100px;
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Initialize roadmap animations
let roadmapAnimations;

document.addEventListener('DOMContentLoaded', () => {
  roadmapAnimations = new RoadmapAnimations();
  
  // Make available globally
  window.roadmapAnimations = roadmapAnimations;
  
  // Animate stats when they come into view
  setTimeout(() => {
    roadmapAnimations.animateStats();
  }, 1000);
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (roadmapAnimations) {
    roadmapAnimations.destroy();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = RoadmapAnimations;
}
