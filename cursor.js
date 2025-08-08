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
        // Check if device supports touch (mobile) or screen is too small
        this.isTouch = 'ontouchstart' in window || 
                      navigator.maxTouchPoints > 0 || 
                      window.innerWidth <= 768;
        
        // Don't initialize cursor on touch devices or small screens
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
        
        // Window resize - check if we need to disable cursor
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                this.destroy();
            }
        });

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

    // Method to completely destroy the cursor and restore default
    destroy() {
        if (this.cursor) {
            this.cursor.remove();
            this.cursor = null;
        }
        
        // Remove the style that hides default cursor
        const hideStyle = document.getElementById('force-hide-cursor');
        if (hideStyle) {
            hideStyle.remove();
        }
        
        // Restore default cursor more aggressively
        document.body.style.cursor = 'auto';
        document.documentElement.style.cursor = 'auto';
        
        // Restore cursor on all elements with force
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.cursor = 'auto';
            el.style.removeProperty('cursor');
        });
        
        // Add temporary style to force show default cursor
        const restoreStyle = document.createElement('style');
        restoreStyle.innerHTML = `
            html *, html *:hover, html *:focus, html *:active,
            body *, body *:hover, body *:focus, body *:active {
                cursor: auto !important;
            }
            a, a:hover, a:focus, a:active { cursor: pointer !important; }
            button, button:hover, button:focus, button:active { cursor: pointer !important; }
            input, input:hover, input:focus, input:active { cursor: text !important; }
            textarea, textarea:hover, textarea:focus, textarea:active { cursor: text !important; }
        `;
        restoreStyle.id = 'force-restore-cursor';
        document.head.appendChild(restoreStyle);
    }

    // Method to restore custom cursor
    restore() {
        if (this.isTouch || this.cursor) return;
        
        // Remove the temporary restore style
        const restoreStyle = document.getElementById('force-restore-cursor');
        if (restoreStyle) {
            restoreStyle.remove();
        }
        
        this.hideDefaultCursor();
        this.createCursor();
        this.bindEvents();
    }
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const customCursor = new CustomCursor();
    
    // Make cursor instance globally available
    window.customCursor = customCursor;
    
    // Additional safety - force hide cursor on all elements after load
    setTimeout(() => {
        if (!customCursor.isTouch && customCursor.cursor) {
            const allElements = document.querySelectorAll('*');
            allElements.forEach(el => {
                el.style.cursor = 'none';
            });
        }
    }, 100);
    
    // Failsafe: Check every 5 seconds if cursor state is correct
    setInterval(() => {
        if (document.hidden || !document.hasFocus()) {
            // Page is not visible/focused - ensure default cursor
            if (customCursor.cursor) {
                customCursor.destroy();
            }
        } else if (!customCursor.isTouch && !customCursor.cursor && window.innerWidth > 768) {
            // Page is visible but custom cursor is missing - restore it
            customCursor.restore();
        }
    }, 5000);
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
    const cursor = window.customCursor;
    if (!cursor) return;
    
    if (document.hidden) {
        // Page is hidden (minimized, switched tab, etc.) - destroy custom cursor
        cursor.destroy();
    } else {
        // Page is visible again - restore custom cursor
        cursor.restore();
    }
});

// Handle window focus/blur events for additional detection
window.addEventListener('blur', () => {
    const cursor = window.customCursor;
    if (cursor) {
        cursor.destroy();
    }
});

window.addEventListener('focus', () => {
    const cursor = window.customCursor;
    if (cursor && !cursor.cursor) {
        // Add small delay to ensure proper restoration
        setTimeout(() => {
            cursor.restore();
        }, 100);
    }
});

// Additional detection for window minimize/restore
window.addEventListener('resize', () => {
    const cursor = window.customCursor;
    if (!cursor) return;
    
    // If window becomes very small, disable cursor
    if (window.innerWidth <= 768 || window.innerHeight <= 400) {
        cursor.destroy();
    } else if (!cursor.cursor && !cursor.isTouch) {
        // If window is restored to normal size, restore cursor
        setTimeout(() => {
            cursor.restore();
        }, 100);
    }
});

// Handle mouse leave/enter on document for better detection
document.addEventListener('mouseleave', () => {
    const cursor = window.customCursor;
    if (cursor && cursor.cursor) {
        cursor.cursor.style.opacity = '0';
    }
});

document.addEventListener('mouseenter', () => {
    const cursor = window.customCursor;
    if (cursor && cursor.cursor) {
        cursor.cursor.style.opacity = '1';
    }
});
