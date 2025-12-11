// Bootstrap MUST be initialized FIRST
import bootstrap from './bootstrap-init';

import $ from 'jquery';
import 'jgrowl/jquery.jgrowl.js';
import 'bootstrap-select/js/bootstrap-select';

import 'mathjax_config';
import UberEditor from 'components/editor';
import { csrfSafeMethod, getCSRFToken, getSections, showComponentError, loadReactApplications, createNotification } from './utils';
import hljs from 'highlight.js'
import './theme-toggle';

const CSC = window.__CSC__;

console.log('=== MAIN.JS LOADED ===');
console.log('Bootstrap version:', bootstrap);

$(document).ready(function () {
  console.log('=== DOCUMENT READY ===');
  
  // Initialize Bootstrap 5 dropdowns
  try {
    const dropdownElementList = document.querySelectorAll('[data-bs-toggle="dropdown"]');
    console.log('Found dropdowns:', dropdownElementList.length);
    [...dropdownElementList].forEach(dropdownToggleEl => {
      console.log('Initializing dropdown:', dropdownToggleEl);
      const dropdown = new bootstrap.Dropdown(dropdownToggleEl);
      console.log('Dropdown initialized:', dropdown);
    });
  } catch (e) {
    console.error('Dropdown initialization error:', e);
  }
  
  // Initialize Bootstrap 5 collapse (for panels, etc.)
  try {
    const collapseElementList = document.querySelectorAll('[data-bs-toggle="collapse"]');
    console.log('Found collapse elements:', collapseElementList.length);
    [...collapseElementList].forEach(collapseToggleEl => {
      new bootstrap.Collapse(collapseToggleEl, { toggle: false });
    });
  } catch (e) {
    console.error('Collapse initialization error:', e);
  }
  
  console.log('=== INITIALIZATION COMPLETE ===');
  
  configureCSRFAjax();
  displayNotifications();
  renderText();
  initUberEditors();
  initCollapsiblePanelGroups();
  setupFileInputs();

  let sections = getSections();
  if (sections.includes('datetimepickers')) {
    import('components/forms')
      .then(m => {
        m.initDatePickers();
        m.initTimePickers();
      })
      .catch(error => showComponentError(error));
  }
  if (sections.includes('selectpickers')) {
    import('components/forms')
      .then(m => {
        m.initSelectPickers();
      })
      .catch(error => showComponentError(error));
  }
  if (sections.includes('lazy-img')) {
    import(/* webpackChunkName: "lazyload" */ 'components/lazyload')
      .then(m => m.launch())
      .catch(error => showComponentError(error));
  }
  // FIXME: combine into one peace `courses`?
  if (sections.includes('courseDetails')) {
    import(/* webpackChunkName: "courseDetails" */ 'courses/courseDetails')
      .then(m => m.launch())
      .catch(error => showComponentError(error));
  }
  if (sections.includes('courseOfferings')) {
    import(/* webpackChunkName: "courseOfferings" */ 'courses/courseOfferings')
      .then(m => m.launch())
      .catch(error => showComponentError(error));
  }
  if (sections.includes('profile')) {
    import(/* webpackChunkName: "profile" */ 'users/profile')
      .then(m => m.launch())
      .catch(error => showComponentError(error));
  }
  if (sections.includes('learning/solution')) {
    import(/* webpackChunkName: "solution" */ 'learning/solution')
      .then(m => m.launch())
      .catch(error => showComponentError(error));
  }

  loadReactApplications();
});

function displayNotifications() {
  if (window.__CSC__.notifications !== undefined) {
    window.__CSC__.notifications.forEach(message => {
      $.jGrowl(message.text, {
        position: 'bottom-right',
        sticky: message.timeout !== 0,
        theme: message.type
      });
    });
  }
}

function configureCSRFAjax() {
  // Append csrf token on ajax POST requests made with jQuery
  // FIXME: add support for allowed subdomains
  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader('X-CSRFToken', getCSRFToken());
      }
    }
  });
}

function renderText() {
  // highlight js and MathJax
  const $ubertexts = $('div.ubertext');
  // Note: MathJax and hljs loads for each iframe separately
  if ($ubertexts.length > 0) {
    UberEditor.preload(function () {
      // Configure highlight js
      hljs.configure({ tabReplace: '    ' });
      // Render Latex and highlight code
      $ubertexts.each(function (i, target) {
        UberEditor.render(target);
      });
    });
  }
}

function initUberEditors() {
  // Replace textarea with EpicEditor
  const $ubereditors = $('textarea.ubereditor');
  UberEditor.cleanLocalStorage($ubereditors);
  $ubereditors.each(function (i, textarea) {
    const editor = UberEditor.init(textarea);
    CSC.config.uberEditors.push(editor);
  });
  if ($ubereditors.length > 0) {
    // Bootstrap 5: data-bs-toggle instead of data-toggle
    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', UberEditor.reflowOnTabToggle);
    // Keep backward compatibility with data-toggle
    $('a[data-toggle="tab"]').on('shown.bs.tab', UberEditor.reflowOnTabToggle);
  }
}

function initCollapsiblePanelGroups() {
  $('.panel-group').on('click', '.panel-heading._arrowed', function (e) {
    // Replace js animation with css.
    e.preventDefault();
    const open = $(this).attr('aria-expanded') === 'true';
    $(this).next().toggleClass('collapse').attr('aria-expanded', !open);
    $(this).attr('aria-expanded', !open);
  });
}

function setupFileInputs() {
  // Custom file input handling (jasny-bootstrap removed, using native)
  const fileInputs = document.querySelectorAll('input[type="file"]')
  const maxUploadSize = window.__CSC__.config.maxUploadSize
  const maxUploadSizeStr = maxUploadSize / 1024 / 1024 + ' MiB'
  
  fileInputs.forEach(fileInput => {
    fileInput.addEventListener('change', e => {
      for (const file of e.target.files) {
        if (file.size > maxUploadSize) {
          createNotification('Cannot upload files larger than ' + maxUploadSizeStr, 'error')
          e.target.value = null
        }
      }
    })
  })
}
