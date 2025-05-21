/**
 * Form Prototype - Navigation Script
 * Handles navigation between form pages and maintains form state
 */

// Form navigation controller
const FormNavigation = {
  // Current page index (0-based)
  currentPage: 0,
  
  // Total number of pages (will be set on init)
  totalPages: 0,
  
  // Form data storage
  formData: {},
  
  // Initialize the navigation
  init: function() {
    // Count the total number of pages
    this.totalPages = document.querySelectorAll('.form-page').length;
    
    // Set up event listeners for navigation buttons
    this.setupEventListeners();
    
    // Load any saved form data from session storage
    this.loadFormData();
    
    // Show the first page
    this.showPage(0);
    
    // Update the progress bar
    this.updateProgress();
  },
  
  // Set up event listeners
  setupEventListeners: function() {
    // Next buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.nextPage();
      });
    });
    
    // Previous buttons
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        this.prevPage();
      });
    });
    
    // Form submission
    const form = document.querySelector('#multi-step-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitForm();
      });
    }
  },
  
  // Show a specific page
  showPage: function(pageIndex) {
    // Hide all pages
    const pages = document.querySelectorAll('.form-page');
    pages.forEach(page => {
      page.style.display = 'none';
    });
    
    // Show the requested page
    if (pages[pageIndex]) {
      pages[pageIndex].style.display = 'block';
      this.currentPage = pageIndex;
      
      // Update the progress bar
      this.updateProgress();
      
      // Scroll to top of form
      const formContainer = document.querySelector('.form-container');
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      
      // Update button states
      this.updateButtonStates();
    }
  },
  
  // Go to the next page
  nextPage: function() {
    // Save data from current page
    this.saveCurrentPageData();
    
    // Validate the current page
    if (!this.validateCurrentPage()) {
      return false;
    }
    
    // If we're on the last page, submit the form
    if (this.currentPage >= this.totalPages - 1) {
      this.submitForm();
      return;
    }
    
    // Show the next page
    this.showPage(this.currentPage + 1);
  },
  
  // Go to the previous page
  prevPage: function() {
    // Save data from current page
    this.saveCurrentPageData();
    
    // Show the previous page if not on the first page
    if (this.currentPage > 0) {
      this.showPage(this.currentPage - 1);
    }
  },
  
  // Update the progress bar
  updateProgress: function() {
    const progressBar = document.querySelector('.progress-bar-fill');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    if (progressBar) {
      const progressPercentage = ((this.currentPage + 1) / this.totalPages) * 100;
      progressBar.style.width = `${progressPercentage}%`;
    }
    
    if (progressSteps.length) {
      progressSteps.forEach((step, index) => {
        if (index < this.currentPage) {
          step.classList.add('completed');
          step.classList.remove('active');
        } else if (index === this.currentPage) {
          step.classList.add('active');
          step.classList.remove('completed');
        } else {
          step.classList.remove('active', 'completed');
        }
      });
    }
  },
  
  // Update button states (disable/enable based on current page)
  updateButtonStates: function() {
    const prevButtons = document.querySelectorAll('.btn-prev');
    const nextButtons = document.querySelectorAll('.btn-next');
    const submitButtons = document.querySelectorAll('.btn-submit');
    
    // Handle previous buttons
    prevButtons.forEach(button => {
      if (this.currentPage === 0) {
        button.style.display = 'none';
      } else {
        button.style.display = 'inline-block';
      }
    });
    
    // Handle next/submit buttons
    nextButtons.forEach(button => {
      if (this.currentPage === this.totalPages - 1) {
        button.style.display = 'none';
      } else {
        button.style.display = 'inline-block';
      }
    });
    
    submitButtons.forEach(button => {
      if (this.currentPage === this.totalPages - 1) {
        button.style.display = 'inline-block';
      } else {
        button.style.display = 'none';
      }
    });
  },
  
  // Save data from the current page
  saveCurrentPageData: function() {
    const currentPageElement = document.querySelectorAll('.form-page')[this.currentPage];
    if (!currentPageElement) return;
    
    // Get all form inputs on the current page
    const inputs = currentPageElement.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Handle different input types
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.checked) {
          if (input.type === 'checkbox' && input.name.endsWith('[]')) {
            // Handle checkbox groups (arrays)
            const name = input.name.slice(0, -2);
            if (!this.formData[name]) {
              this.formData[name] = [];
            }
            if (!this.formData[name].includes(input.value)) {
              this.formData[name].push(input.value);
            }
          } else {
            this.formData[input.name] = input.value;
          }
        }
      } else if (input.name) {
        this.formData[input.name] = input.value;
      }
    });
    
    // Save to session storage
    this.saveFormData();
  },
  
  // Validate the current page
  validateCurrentPage: function() {
    // This is a simple validation - for more complex validation use validation.js
    const currentPageElement = document.querySelectorAll('.form-page')[this.currentPage];
    if (!currentPageElement) return true;
    
    const requiredInputs = currentPageElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      // Reset validation state
      input.classList.remove('is-invalid');
      const feedbackElement = input.nextElementSibling;
      if (feedbackElement && feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement.style.display = 'none';
      }
      
      // Check if empty
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        if (feedbackElement) {
          feedbackElement.style.display = 'block';
        }
        isValid = false;
      }
    });
    
    return isValid;
  },
  
  // Submit the form
  submitForm: function() {
    // Save data from the final page
    this.saveCurrentPageData();
    
    // Validate the final page
    if (!this.validateCurrentPage()) {
      return false;
    }
    
    // For this prototype, we'll just redirect to the confirmation page
    // In a real application, you would submit the data to a server here
    
    // Store the complete form data for the confirmation page
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
    
    // Redirect to confirmation page
    window.location.href = 'confirmation.html';
  },
  
  // Save form data to session storage
  saveFormData: function() {
    sessionStorage.setItem('formData', JSON.stringify(this.formData));
  },
  
  // Load form data from session storage
  loadFormData: function() {
    const savedData = sessionStorage.getItem('formData');
    if (savedData) {
      try {
        this.formData = JSON.parse(savedData);
        this.populateFormFields();
      } catch (e) {
        console.error('Error loading saved form data:', e);
        sessionStorage.removeItem('formData');
      }
    }
  },
  
  // Populate form fields with saved data
  populateFormFields: function() {
    // Iterate through all form inputs
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      if (!input.name) return;
      
      // Handle different input types
      if (input.type === 'checkbox' || input.type === 'radio') {
        if (input.type === 'checkbox' && input.name.endsWith('[]')) {
          // Handle checkbox groups
          const name = input.name.slice(0, -2);
          if (this.formData[name] && Array.isArray(this.formData[name])) {
            input.checked = this.formData[name].includes(input.value);
          }
        } else {
          input.checked = (this.formData[input.name] === input.value);
        }
      } else {
        // Text inputs, selects, textareas
        if (this.formData[input.name] !== undefined) {
          input.value = this.formData[input.name];
        }
      }
    });
  },
  
  // Clear all form data
  clearFormData: function() {
    this.formData = {};
    sessionStorage.removeItem('formData');
    
    // Reset all form fields
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });
  }
};

// Initialize the form navigation when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  FormNavigation.init();
});
