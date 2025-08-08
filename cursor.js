/* ====================================================================
   CORE CUSTOM CURSOR - CYBERPUNK STYLE
   Interactive cursor that follows mouse movement with futuristic effects
   ==================================================================== */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.isTouch = false;
        this.init();
    }

    init() {
        // Check if device supports touch (mobile)
        this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Don't initialize cursor on touch devices
        if (this.isTouch) return;

        // Force hide default cursor on all elements
        this.hideDefaultCursor();
        
        this.createCursor();
        this.bindEvents();
    }

    hideDefaultCursor() {
        // Add CSS to hide cursor on all elements with maximum specificity
        const style = document.createElement('style');
        style.innerHTML = `
            html *, html *:hover, html *:focus, html *:active,
            body *, body *:hover, body *:focus, body *:active {
                cursor: none !important;
            }
            a, a:hover, a:focus, a:active,
            button, button:hover, button:focus, button:active,
            input, input:hover, input:focus, input:active,
            textarea, textarea:hover, textarea:focus, textarea:active,
            select, select:hover, select:focus, select:active,
            [role="button"], [role="button"]:hover, [role="button"]:focus, [role="button"]:active,
            [tabindex], [tabindex]:hover, [tabindex]:focus, [tabindex]:active {
                cursor: none !important;
            }
            .nav-link, .nav-link:hover, .nav-link:focus,
            .btn, .btn:hover, .btn:focus,
            .social-link, .social-link:hover, .social-link:focus,
            .control, .control:hover, .control:focus {
                cursor: none !important;
            }
        `;
        style.id = 'force-hide-cursor';
        document.head.appendChild(style);
        
        // Also set document.body style directly
        document.body.style.cursor = 'none';
        document.documentElement.style.cursor = 'none';
        
        // Monitor for new elements and apply cursor none
        this.observeNewElements();
    }

    observeNewElements() {
        // Create mutation observer to handle dynamically added elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        node.style.cursor = 'none';
                        const children = node.querySelectorAll('*');
                        children.forEach(child => {
                            child.style.cursor = 'none';
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    createCursor() {
        // Create cursor element
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        document.body.appendChild(this.cursor);

        // Hide cursor initially
        this.cursor.style.opacity = '0';
    }

    bindEvents() {
        // Mouse move event with higher sensitivity and passive listeners
        document.addEventListener('mousemove', (e) => {
            this.moveCursor(e.clientX, e.clientY);
        }, { passive: true });

        // Add additional mouse tracking for better responsiveness
        document.addEventListener('mouseenter', () => {
            this.cursor.style.opacity = '1';
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            this.cursor.style.opacity = '0';
        }, { passive: true });

        // Hide cursor when mouse leaves window
        window.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget || e.relatedTarget === null) {
                this.cursor.style.opacity = '0';
            }
        }, { passive: true });

        // Show cursor when mouse enters window
        window.addEventListener('mouseover', () => {
            this.cursor.style.opacity = '1';
        }, { passive: true });

        // Mouse down/up events for click effect
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('click');
        }, { passive: true });

        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        }, { passive: true });

        // Hover effects for interactive elements
        this.bindHoverEffects();
    }

    moveCursor(x, y) {
        if (!this.cursor) return;
        
        // Use transform for better performance and smoother movement
        this.cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        this.cursor.style.left = '0';
        this.cursor.style.top = '0';
    }

    bindHoverEffects() {
        // Elements that should trigger hover effect
        const hoverElements = [
            'a', 'button', '.btn', '.nav-link', '.social-link',
            '.control', '.terminal-input', '[role="button"]',
            '.stat-item', '.about-card', '.timeline-content',
            '.contract-address', '.loading-screen', '.nav-logo'
        ];

        hoverElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            
            elements.forEach(element => {
                // Use faster event handlers
                element.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                }, { passive: true });

                element.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                }, { passive: true });

                // Add additional tracking for better responsiveness
                element.addEventListener('mouseover', () => {
                    this.cursor.classList.add('hover');
                }, { passive: true });

                element.addEventListener('mouseout', () => {
                    this.cursor.classList.remove('hover');
                }, { passive: true });
            });
        });

        // Text input elements with faster response
        const textElements = document.querySelectorAll('input[type="text"], textarea, .terminal-input');
        textElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('text');
                this.cursor.classList.remove('hover');
            }, { passive: true });

            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('text');
            }, { passive: true });
        });

        // Loading elements
        const loadingElements = document.querySelectorAll('.loading-screen, .loading-content');
        loadingElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('loading');
            }, { passive: true });

            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('loading');
            }, { passive: true });
        });

        // Disabled elements
        const disabledElements = document.querySelectorAll('[disabled], .disabled');
        disabledElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.cursor.classList.add('disabled');
            }, { passive: true });

            element.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('disabled');
            }, { passive: true });
        });
    }

    // Method to reinitialize hover effects for dynamically added elements
    reinitHoverEffects() {
        this.bindHoverEffects();
    }
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const customCursor = new CustomCursor();
    
    // Make cursor instance globally available
    window.customCursor = customCursor;
    
    // Additional safety - force hide cursor on all elements after load
    setTimeout(() => {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.cursor = 'none';
        });
    }, 100);
});

// Also initialize on window load as backup
window.addEventListener('load', () => {
    // Force hide cursor on all elements
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        el.style.cursor = 'none';
    });
    
    // Set global styles
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Hide cursor when page is not visible
        const cursor = document.querySelector('.custom-cursor');
        if (cursor) cursor.style.opacity = '0';
    }
});
