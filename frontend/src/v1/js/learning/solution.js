import $ from 'jquery';

import UberEditor from 'components/editor';
import { createNotification, getCSRFToken } from '../utils';
import ky from 'ky'

const comment = $('.assignment-comment');
const modalFormWrapper = $('#update-comment-model-form');

const commentButton = $('#add-comment');
const commentForm = $('#comment-form-wrapper');
const solutionButton = $('#add-solution');
const solutionForm = $('#solution-form-wrapper');
const jbaTab = $('#tab-jba');
const jbaTabContent = $('#tab-content-jba');
const jbaCourseTutorial = $('#jba-course-tutorial');
const jbaMarketplaceLink = $('#jba-marketplace-link');
const jbaUpdateResultsBtn = $('#jba-update-results-btn');

const fn = {
  initCommentForm: function () {
    commentButton.on('click', function () {
      commentForm.removeClass('hidden');
      UberEditor.reflowEditor(commentForm);
      $(this).addClass('active');
      if (solutionForm.length > 0) {
        solutionForm.addClass('hidden');
        solutionButton.removeClass('active');
      } else if (jbaTabContent.length > 0) {
        jbaTabContent.addClass('hidden');
        jbaTab.removeClass('active');
      }
    });
  },

  initSolutionForm: function () {
    if (solutionForm.length > 0) {
      solutionButton.on('click', function () {
        solutionForm.removeClass('hidden');
        UberEditor.reflowEditor(solutionForm);
        $(this).addClass('active');
        commentForm.addClass('hidden');
        commentButton.removeClass('active');
      });
    }
  },

  initJbaTab: function () {
    if (jbaTabContent.length == 0) {
      return
    }
    jbaTab.click(() => {
      jbaTabContent.removeClass('hidden');
      jbaTab.addClass('active');

      commentForm.addClass('hidden');
      commentButton.removeClass('active');
    });

    jbaMarketplaceLink.attr('href', jbaCourseTutorial.data('marketplaceLink'))

    jbaUpdateResultsBtn.click(() => {
      const studentAssignmentId = jbaUpdateResultsBtn.data('studentAssignmentId')
      jbaUpdateResultsBtn.prop('disabled', true)
      ky.post(`/api/v1/study/assignments/${studentAssignmentId}/update_jba_progress`, {
        method: 'POST',
        headers: { 'X-CSRFToken': getCSRFToken() },
      }).then(() => {
        location.reload()
      }).catch(() => {
        createNotification('Failed to update the IDE course results', 'error')
        jbaUpdateResultsBtn.prop('disabled', false)
      })
    })
  },
};

export function launch() {
  fn.initCommentForm();
  fn.initSolutionForm();
  fn.initJbaTab();
}
