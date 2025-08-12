/**
 * CORE LOADER - Interactive Video Loader
 * Handles the spectacular video loading experience
 */

class CoreLoader {
    constructor() {
        this.loader = document.getElementById('core-loader');
        this.video = document.getElementById('core-video');
        this.enterBtn = document.getElementById('enter-core');
        this.statusText = document.querySelector('.status-text');
        
        this.isLoaded = false;
        this.init();
    }

    init() {
        if (!this.loader || !this.video || !this.enterBtn) {
            console.warn('Core Loader elements not found');
            return;
        }

        this.setupVideoHandlers();
        this.setupButtonHandlers();
        this.updateStatus('INITIALIZING...');
        
        // Start video loading
        this.loadVideo();
        
        // Fallback timeout for GitHub Pages - auto-proceed after 5 seconds if video doesn't load
        setTimeout(() => {
            if (!this.isLoaded) {
                console.warn('Video loading timeout - proceeding without video');
                this.updateStatus('READY TO INITIALIZE');
                this.isLoaded = true;
                this.enableEnterButton();
                
                // Auto-proceed after another 2 seconds
                setTimeout(() => {
                    this.enterCore();
                }, 2000);
            }
        }, 5000);
    }

    setupVideoHandlers() {
        this.video.addEventListener('loadstart', () => {
            this.updateStatus('LOADING CORE DATA...');
        });

        this.video.addEventListener('loadedmetadata', () => {
            this.updateStatus('CORE METADATA LOADED...');
        });

        this.video.addEventListener('loadeddata', () => {
            this.updateStatus('CORE DATA READY...');
        });

        this.video.addEventListener('canplay', () => {
            this.updateStatus('READY TO INITIALIZE');
            this.isLoaded = true;
            this.enableEnterButton();
        });

        this.video.addEventListener('error', (e) => {
            console.error('Video loading error:', e);
            this.updateStatus('CORE READY - PROCEEDING...');
            this.isLoaded = true;
            this.enableEnterButton();
            
            // Auto-proceed after error
            setTimeout(() => {
                this.enterCore();
            }, 1500);
        });
    }

    setupButtonHandlers() {
        this.enterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.enterCore();
        });

        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.loader && !this.loader.classList.contains('hidden')) {
                    e.preventDefault();
                    this.enterCore();
                }
            }
        });
    }

    loadVideo() {
        try {
            this.video.load();
            
            // Auto-play video when ready (muted for browser compatibility)
            this.video.addEventListener('canplay', () => {
                this.video.play().catch(err => {
                    console.log('Auto-play prevented:', err);
                    // Video will play when user interacts
                });
            }, { once: true });
            
        } catch (error) {
            console.error('Video loading failed:', error);
            this.updateStatus('CORE READY (NO VIDEO)');
            this.enableEnterButton();
        }
    }

    updateStatus(text) {
        if (this.statusText) {
            this.statusText.textContent = text;
        }
    }

    enableEnterButton() {
        if (this.enterBtn) {
            this.enterBtn.classList.add('ready');
        }
    }

    enterCore() {
        // Note: Static background is now removed from CSS, but keep this for compatibility
        const staticBackground = document.querySelector('.hero-background');
        if (staticBackground) {
            staticBackground.style.display = 'none';
            staticBackground.classList.add('hidden');
        }
        
        // IMPORTANT: Stop and hide loader video immediately to prevent mobile fullscreen
        if (this.video) {
            this.video.pause();
            this.video.style.display = 'none';
            this.video.style.opacity = '0';
        }

        // Update status
        this.updateStatus('ENTERING THE CORE...');

        // Add click effect
        this.enterBtn.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            // Transfer video to hero section WITHOUT playing loader video
            this.transferVideoToHero();
            
            // Start fade out animation
            this.loader.classList.add('hidden');
            
            // Show main content after a brief delay to ensure video transfer
            setTimeout(() => {
                document.body.classList.add('core-loaded');
                console.log('✅ Added core-loaded class to body');
            }, 200);
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                if (this.loader && this.loader.parentNode) {
                    this.loader.remove();
                }
                
                // Initialize main application
                this.initMainApp();
                
            }, 1000); // Match CSS transition duration
            
        }, 100);
    }

    transferVideoToHero() {
        const heroVideoBackground = document.getElementById('hero-video-bg');
        const heroVideo = document.getElementById('hero-video');
        
        if (heroVideoBackground && heroVideo) {
            // Don't use loader video at all - just start fresh hero video
            // This completely avoids mobile fullscreen issues
            
            // Set up hero video as fresh instance
            heroVideo.muted = true; // Start muted for mobile compatibility
            heroVideo.loop = true;
            heroVideo.preload = 'auto';
            
            // Mobile-specific attributes to prevent fullscreen
            heroVideo.setAttribute('playsinline', 'true');
            heroVideo.setAttribute('webkit-playsinline', 'true');
            
            // Show hero video background immediately
            heroVideoBackground.style.display = 'block';
            heroVideoBackground.style.opacity = '1';
            heroVideoBackground.style.transition = 'none';
            heroVideoBackground.classList.add('active');
            
            // Force immediate render
            heroVideoBackground.offsetHeight;
            
            // Load and start playing fresh video (no inheritance from loader)
            heroVideo.load(); // Force reload
            
            const playPromise = heroVideo.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Hero video playing successfully');
                    // Unmute after successful play (if user interaction allows)
                    setTimeout(() => {
                        heroVideo.muted = false;
                    }, 1000);
                }).catch(err => {
                    console.log('Hero video autoplay prevented:', err);
                    // Keep muted for mobile compatibility
                });
            }
            
            // Add video controls for better UX
            this.setupHeroVideoControls(heroVideo);
        }
    }

    setupHeroVideoControls(video) {
        // Add click to play/pause functionality
        video.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(console.log);
            } else {
                video.pause();
            }
        });

        // Add keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() !== 'input') {
                switch(e.key) {
                    case ' ':
                        e.preventDefault();
                        if (video.paused) {
                            video.play().catch(console.log);
                        } else {
                            video.pause();
                        }
                        break;
                    case 'm':
                    case 'M':
                        video.muted = !video.muted;
                        break;
                }
            }
        });
    }

    initMainApp() {
        // Main app already initialized - just dispatch event and initialize components
        
        // Dispatch custom event for other scripts
        const coreLoadedEvent = new CustomEvent('coreLoaded', {
            detail: { timestamp: Date.now() }
        });
        document.dispatchEvent(coreLoadedEvent);

        // Initialize other components if they exist
        if (typeof initializeApp === 'function') {
            initializeApp();
        }

        console.log('🔥 CORE LOADED - Welcome to the essence of everything');
    }

    // Public method to force enter (for debugging)
    forceEnter() {
        this.enterCore();
    }
}

// Additional CSS for ready state (injected via JS)
const additionalStyles = `
    @keyframes pulse-ready {
        0%, 100% { 
            box-shadow: 0 0 20px rgba(74, 144, 226, 0.3);
        }
        50% { 
            box-shadow: 0 0 30px rgba(74, 144, 226, 0.6), 0 0 50px rgba(74, 144, 226, 0.3);
        }
    }

    .enter-core-btn.ready {
        border-color: rgba(74, 144, 226, 0.8) !important;
    }

    .core-loader.hidden .core-video {
        filter: brightness(1.2) contrast(1.3) saturate(1.3);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.coreLoader = new CoreLoader();
    });
} else {
    window.coreLoader = new CoreLoader();
}

// Export for potential external use
window.CoreLoader = CoreLoader;
