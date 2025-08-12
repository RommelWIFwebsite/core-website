/**
 * EMERGENCY MOBILE NAVIGATION - ULTRA SIMPLE
 * =========================================
 */

function initUltraSimpleMobileNav() {
  console.log('� Ultra Simple Mobile Nav Starting...');
  
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  
  console.log('Toggle found:', !!toggle);
  console.log('Menu found:', !!menu);
  
  if (!toggle || !menu) {
    console.error('❌ Navigation elements missing');
    return;
  }
  
  let isOpen = false;
  
  // Multiple ways to click for maximum compatibility
  function handleToggle(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔥 Toggle clicked! Current state:', isOpen);
    
    if (isOpen) {
      // Close menu
      toggle.classList.remove('active');
      menu.classList.remove('active');
      menu.style.left = '-100%';
      document.body.style.overflow = '';
      isOpen = false;
      console.log('� Menu closed');
    } else {
      // Open menu
      toggle.classList.add('active');
      menu.classList.add('active');
      menu.style.left = '0';
      document.body.style.overflow = 'hidden';
      isOpen = true;
      console.log('📂 Menu opened');
    }
  }
  
  // Add multiple event listeners for compatibility
  toggle.addEventListener('click', handleToggle);
  toggle.addEventListener('touchend', handleToggle);
  
  // Close menu when clicking links
  const links = menu.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      console.log('🔗 Link clicked - closing menu');
      setTimeout(() => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        menu.style.left = '-100%';
        document.body.style.overflow = '';
        isOpen = false;
      }, 200);
    });
  });
  
  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !menu.contains(e.target) && !toggle.contains(e.target)) {
      handleToggle(e);
    }
  });
  
  console.log('✅ Ultra Simple Mobile Nav Ready!');
}

// Initialize immediately and with multiple fallbacks
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initUltraSimpleMobileNav);
} else {
  initUltraSimpleMobileNav();
}

// Additional fallbacks
window.addEventListener('load', initUltraSimpleMobileNav);
setTimeout(initUltraSimpleMobileNav, 500);
setTimeout(initUltraSimpleMobileNav, 1000);

// Manual trigger for testing
window.testNav = function() {
  console.log('🧪 Manual nav test');
  initUltraSimpleMobileNav();
  
  const toggle = document.getElementById('nav-toggle');
  if (toggle) {
    toggle.click();
  }
};
