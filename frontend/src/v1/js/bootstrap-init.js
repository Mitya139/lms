/**
 * Bootstrap initialization
 * This MUST be imported BEFORE bootstrap-select and other BS-dependent libraries
 */
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle';

// Make Bootstrap available globally IMMEDIATELY
window.bootstrap = bootstrap;

console.log('[Bootstrap Init] Bootstrap set on window object');

export default bootstrap;
