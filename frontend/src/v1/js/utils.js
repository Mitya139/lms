import { get as getCookie } from 'es-cookie';
import template from 'lodash-es/template';
import { renderComponent } from './react_app';

/**
 * Build a stable localStorage key for the given textarea on the current page.
 *
 * @param {HTMLTextAreaElement} textarea Target textarea element.
 * @returns {string} Local storage key unique to the page and field name.
 */
export function getLocalStorageKey(textarea) {
  return window.location.pathname.replace(/\//g, '_') + '_' + textarea.name;
}

/**
 * Check whether an HTTP method is exempt from CSRF protection.
 *
 * @param {string} method HTTP method name.
 * @returns {boolean}
 */
export function csrfSafeMethod(method) {
  // These HTTP methods do not require CSRF protection
  return /^(GET|HEAD|OPTIONS|TRACE)$/.test(method);
}

/**
 * Read the CSRF token value from the configured CSRF cookie.
 *
 * @returns {string|undefined} CSRF token from cookies, if present.
 */
export function getCSRFToken() {
  return getCookie(window.__CSC__.config.csrfCookieName);
}

/**
 * Compile a lodash template from the contents of the element with the
 * given DOM id.
 *
 * @param {string} id DOM element id containing the template source.
 * @returns {Function} Compiled lodash template function.
 */
export function getTemplate(id) {
  return template(document.getElementById(id).innerHTML);
}

/**
 * Show a growl-style notification using jGrowl.
 *
 * @param {string} msg Message text to display.
 * @param {string} [theme="default"] Visual theme / severity.
 * @param {Object} [options] Additional jGrowl options.
 */
export function createNotification(msg, theme = 'default', options = {}) {
  const opts = { position: 'bottom-right', ...options };
  $.jGrowl(msg, { theme: theme, ...opts });
}

/**
 * Log a component loading error and show a user-facing notification.
 *
 * @param {Error} error Error thrown when loading the component.
 * @param {string} [msg] Message to display to the end user.
 */
export function showComponentError(error, msg = 'An error occurred while loading the component') {
  console.error(error);
  createNotification(msg, 'error');
}

// TODO: share with v2?
/**
 * Read the list of logical UI sections requested for initialization from
 * the ``data-init-sections`` attribute on the document body.
 *
 * @returns {string[]} Array of section identifiers.
 */
export function getSections() {
  if (document.body.hasAttribute('data-init-sections')) {
    let sections = document.body.getAttribute('data-init-sections');
    return sections.split(',');
  } else {
    return [];
  }
}

/**
 * Discover and mount all React applications marked with the
 * ``.__react-app`` CSS class by delegating to ``renderComponent``.
 */
export function loadReactApplications() {
  let reactApps = document.querySelectorAll('.__react-app');
  if (reactApps.length > 0) {
    import(/* webpackChunkName: "react" */ 'react_app')
      .then(m => {
        Array.from(reactApps).forEach(m.renderComponent);
      })
      .catch(error => showComponentError(error));
  }
}

/**
 * Escape a string so it can be safely rendered as HTML text content.
 *
 * @param {string} data Arbitrary input string.
 * @returns {string} Escaped HTML-safe string.
 */
export function escapeHTML(data) {
  return data
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
