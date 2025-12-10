/**
 * Simple Theme Toggle
 * Light/Dark theme switcher with localStorage persistence
 */

(function() {
  'use strict';
  
  const STORAGE_KEY = 'lms-theme';
  const THEME_ATTR = 'data-theme';
  const DARK_THEME = 'dark';
  const LIGHT_THEME = 'light';
  
  console.log('[Theme] Module loaded');
  
  // Get current theme from localStorage or default to light
  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY) || LIGHT_THEME;
    } catch (e) {
      console.warn('[Theme] localStorage not available:', e);
      return LIGHT_THEME;
    }
  }
  
  // Save theme to localStorage
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
      console.log('[Theme] Saved theme:', theme);
    } catch (e) {
      console.warn('[Theme] Could not save theme:', e);
    }
  }
  
  // Apply theme to document
  function applyTheme(theme, skipTransition = false) {
    console.log('[Theme] Applying theme:', theme);
    const html = document.documentElement;
    
    // Disable transitions temporarily during initial load to prevent flash
    if (skipTransition) {
      document.body.style.transition = 'none';
    }
    
    if (theme === DARK_THEME) {
      html.setAttribute(THEME_ATTR, DARK_THEME);
    } else {
      html.removeAttribute(THEME_ATTR);
    }
    
    // Re-enable transitions after theme is applied
    if (skipTransition) {
      // Force reflow
      void document.body.offsetHeight;
      requestAnimationFrame(() => {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      });
    }
    
    // Update icon
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.className = theme === DARK_THEME ? 'fa fa-moon-o' : 'fa fa-sun-o';
    }
    
    saveTheme(theme);
  }
  
  // Toggle between themes
  function toggleTheme() {
    console.log('[Theme] Toggle clicked');
    const currentTheme = document.documentElement.getAttribute(THEME_ATTR);
    const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;
    applyTheme(newTheme);
  }
  
  // Initialize theme system
  function init() {
    console.log('[Theme] Initializing...');
    
    // Apply saved theme immediately without transition to prevent flash
    const savedTheme = getSavedTheme();
    applyTheme(savedTheme, true);
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupButton);
    } else {
      setupButton();
    }
  }
  
  // Setup toggle button
  function setupButton() {
    const button = document.getElementById('theme-toggle');
    
    if (button) {
      console.log('[Theme] Button found, attaching handler');
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      });
    } else {
      console.warn('[Theme] Toggle button not found');
    }
  }
  
  // Start initialization
  init();
  
  // Export for debugging
  window.themeToggle = {
    toggle: toggleTheme,
    apply: applyTheme,
    getSaved: getSavedTheme
  };
  
})();

