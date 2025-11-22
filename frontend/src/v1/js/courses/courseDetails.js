/**
 * Course Details page behaviors.
 *
 * Public API:
 * - launch(): initialize tab navigation and mark course news as read on click.
 *
 * Internals:
 * - initTabs(): wires bootstrap tabs and URL history handling.
 * - readCourseNewsOnClick(tab): marks course news as read via AJAX when the
 *   news tab is opened.
 */
import { getCSRFToken } from '../utils';

/**
 * Initialize the Course Details page interactions.
 * Should be called once on page load for `#course-detail-page`.
 */
export function launch() {
  initTabs();
}

/**
 * Wire up tab clicks, history navigation, and unread news behavior.
 *
 * - Sets active tab based on URL/hash and updates the history state on click.
 * - When the News tab opens for the first time and has unread notifications,
 *   sends a POST to clear the unread state.
 */
function initTabs() {
  let course = $('#course-detail-page');
  if (course.length > 0) {
    const tabList = $('#course-detail-page__tablist');
    // Switch tabs if url was changed
    window.onpopstate = function (event) {
      let target;
      if (event.state !== null) {
        if ('target' in event.state) {
          target = event.state.target;
        }
      }
      if (target === undefined) {
        if (window.location.hash.indexOf('#news-') !== -1) {
          target = '#course-news';
        } else {
          target = '#course-about';
        }
      }
      tabList.find('li').removeClass('active').find('a').blur();
      tabList
        .find('a[data-target="' + target + '"]')
        .tab('show')
        .hover();
    };
    let activeTab = tabList.find('li.active:first a:first');
    if (activeTab.data('target') === '#course-news') {
      readCourseNewsOnClick(activeTab.get(0));
    }
    tabList.on('click', 'a', function (e) {
      e.preventDefault();
      if ($(this).parent('li').hasClass('active')) return;

      const targetTab = $(this).data('target');
      if (targetTab === '#course-news') {
        readCourseNewsOnClick(this);
      }
      if (window.history && history.pushState) {
        history.pushState({ target: targetTab }, '', $(this).attr('href'));
      }
    });
  }
}

/**
 * Mark course news as read if needed when the News tab is opened.
 *
 * @param {HTMLElement} tab - The anchor node inside the News tab list item.
 */
function readCourseNewsOnClick(tab) {
  let $tab = $(tab);
  if ($tab.data('has-unread')) {
    $.ajax({
      url: $tab.data('notifications-url'),
      method: 'POST',
      // Avoiding preflight request by sending csrf token in payload
      data: { csrfmiddlewaretoken: getCSRFToken() },
      xhrFields: {
        withCredentials: true
      }
    }).done(data => {
      if (data.updated) {
        $tab.text(tab.firstChild.nodeValue.trim());
      }
      // Prevent additional requests
      $tab.data('has-unread', false);
    });
  }
}
