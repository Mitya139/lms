/**
 * Custom file input component (replaces jasny-bootstrap)
 * Provides Bootstrap 5 compatible file input styling and functionality
 */
export function initFileInputs() {
  const fileInputs = document.querySelectorAll('.custom-file-input, input[type="file"].form-control');
  
  fileInputs.forEach(input => {
    const wrapper = input.closest('.custom-file, .file-input-wrapper');
    if (!wrapper) return;
    
    input.addEventListener('change', function(e) {
      const fileName = e.target.files.length > 0 
        ? Array.from(e.target.files).map(f => f.name).join(', ')
        : 'No file selected';
      
      const label = wrapper.querySelector('.custom-file-label, .file-input-label');
      if (label) {
        label.textContent = fileName;
      }
    });
    
    // Clear button functionality
    const clearBtn = wrapper.querySelector('[data-clear-file]');
    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        input.value = '';
        const label = wrapper.querySelector('.custom-file-label, .file-input-label');
        if (label) {
          label.textContent = 'No file selected';
        }
        
        // Trigger change event
        input.dispatchEvent(new Event('change'));
      });
    }
  });
}

export default {
  initFileInputs
};
