/**
 * Form Prototype - Validation Script
 * Provides form validation functionality
 */

// Form validation controller
const FormValidation = {
  // Validation patterns
  patterns: {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^(\+\d{1,3})?\s?\(?\d{3,4}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
    postcode: /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, // UK postcode format
    numeric: /^\d+$/,
    alphanumeric: /^[a-zA-Z0-9]+$/,
    date: /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD format
  },
  
  // Initialize validation
  init: function() {
    // Set up event listeners for form inputs
    this.setupEventListeners();
  },
  
  // Set up event listeners
  setupEventListeners: function() {
    // Get all form inputs that need validation
    const inputs = document.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Skip inputs that don't need validation
      if (!input.hasAttribute('required') && 
          !input.hasAttribute('data-validate') && 
          !input.hasAttribute('pattern')) {
        return;
      }
      
      // Add blur event listener for validation
      input.addEventListener('blur', () => {
        this.validateInput(input);
      });
      
      // Add input event listener for real-time validation feedback
      input.addEventListener('input', () => {
        // Only validate if the input already has an error
        if (input.classList.contains('is-invalid')) {
          this.validateInput(input);
        }
      });
    });
  },
  
  // Validate a specific input
  validateInput: function(input) {
    // Skip disabled inputs
    if (input.disabled) return true;
    
    let isValid = true;
    let errorMessage = '';
    
    // Required validation
    if (input.hasAttribute('required') && !this.validateRequired(input)) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    
    // If required check passed, perform other validations
    if (isValid) {
      // Skip empty optional fields
      if (input.value.trim() === '') {
        return this.setValidationState(input, true);
      }
      
      // Email validation
      if (input.type === 'email' || input.getAttribute('data-validate') === 'email') {
        if (!this.validatePattern(input, this.patterns.email)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
      }
      
      // Phone validation
      else if (input.getAttribute('data-validate') === 'phone') {
        if (!this.validatePattern(input, this.patterns.phone)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number';
        }
      }
      
      // Postcode validation
      else if (input.getAttribute('data-validate') === 'postcode') {
        if (!this.validatePattern(input, this.patterns.postcode)) {
          isValid = false;
          errorMessage = 'Please enter a valid postcode';
        }
      }
      
      // Numeric validation
      else if (input.getAttribute('data-validate') === 'numeric') {
        if (!this.validatePattern(input, this.patterns.numeric)) {
          isValid = false;
          errorMessage = 'Please enter numbers only';
        }
      }
      
      // Alphanumeric validation
      else if (input.getAttribute('data-validate') === 'alphanumeric') {
        if (!this.validatePattern(input, this.patterns.alphanumeric)) {
          isValid = false;
          errorMessage = 'Please enter letters and numbers only';
        }
      }
      
      // Date validation
      else if (input.getAttribute('data-validate') === 'date' || input.type === 'date') {
        if (!this.validateDate(input)) {
          isValid = false;
          errorMessage = 'Please enter a valid date';
        }
      }
      
      // Min/max validation for number inputs
      else if (input.type === 'number') {
        if (!this.validateNumberRange(input)) {
          isValid = false;
          const min = input.getAttribute('min');
          const max = input.getAttribute('max');
          
          if (min !== null && max !== null) {
            errorMessage = `Please enter a number between ${min} and ${max}`;
          } else if (min !== null) {
            errorMessage = `Please enter a number greater than or equal to ${min}`;
          } else if (max !== null) {
            errorMessage = `Please enter a number less than or equal to ${max}`;
          }
        }
      }
      
      // Min/max length validation
      else if (input.hasAttribute('minlength') || input.hasAttribute('maxlength')) {
        if (!this.validateLength(input)) {
          isValid = false;
          const minLength = input.getAttribute('minlength');
          const maxLength = input.getAttribute('maxlength');
          
          if (minLength !== null && maxLength !== null) {
            errorMessage = `Please enter between ${minLength} and ${maxLength} characters`;
          } else if (minLength !== null) {
            errorMessage = `Please enter at least ${minLength} characters`;
          } else if (maxLength !== null) {
            errorMessage = `Please enter no more than ${maxLength} characters`;
          }
        }
      }
      
      // Custom pattern validation
      else if (input.hasAttribute('pattern')) {
        const pattern = new RegExp(input.getAttribute('pattern'));
        if (!this.validatePattern(input, pattern)) {
          isValid = false;
          errorMessage = input.getAttribute('data-error-message') || 'Please match the requested format';
        }
      }
      
      // Custom validation function
      else if (input.hasAttribute('data-custom-validate')) {
        const validationFn = window[input.getAttribute('data-custom-validate')];
        if (typeof validationFn === 'function') {
          const result = validationFn(input.value, input);
          if (result !== true) {
            isValid = false;
            errorMessage = result || 'Invalid input';
          }
        }
      }
    }
    
    // Set the validation state and error message
    return this.setValidationState(input, isValid, errorMessage);
  },
  
  // Validate required fields
  validateRequired: function(input) {
    if (input.type === 'checkbox' || input.type === 'radio') {
      // For checkboxes and radios, check if checked
      return input.checked;
    } else {
      // For other inputs, check if value is not empty
      return input.value.trim() !== '';
    }
  },
  
  // Validate against a regex pattern
  validatePattern: function(input, pattern) {
    return pattern.test(input.value.trim());
  },
  
  // Validate date
  validateDate: function(input) {
    // If it's a date input type, the browser handles basic validation
    if (input.type === 'date' && input.validity.valid) {
      return true;
    }
    
    // For text inputs with date validation
    if (this.patterns.date.test(input.value.trim())) {
      // Check if it's a valid date
      const date = new Date(input.value.trim());
      return !isNaN(date.getTime());
    }
    
    return false;
  },
  
  // Validate number range
  validateNumberRange: function(input) {
    const value = parseFloat(input.value);
    const min = input.hasAttribute('min') ? parseFloat(input.getAttribute('min')) : null;
    const max = input.hasAttribute('max') ? parseFloat(input.getAttribute('max')) : null;
    
    if (isNaN(value)) return false;
    
    if (min !== null && value < min) return false;
    if (max !== null && value > max) return false;
    
    return true;
  },
  
  // Validate input length
  validateLength: function(input) {
    const length = input.value.length;
    const minLength = input.hasAttribute('minlength') ? parseInt(input.getAttribute('minlength')) : null;
    const maxLength = input.hasAttribute('maxlength') ? parseInt(input.getAttribute('maxlength')) : null;
    
    if (minLength !== null && length < minLength) return false;
    if (maxLength !== null && length > maxLength) return false;
    
    return true;
  },
  
  // Set the validation state of an input
  setValidationState: function(input, isValid, errorMessage = '') {
    // Find or create the feedback element
    let feedbackElement = this.getFeedbackElement(input);
    
    // Update classes and feedback
    if (isValid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      if (feedbackElement) {
        feedbackElement.style.display = 'none';
      }
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      if (feedbackElement) {
        feedbackElement.textContent = errorMessage;
        feedbackElement.style.display = 'block';
      }
    }
    
    return isValid;
  },
  
  // Get or create feedback element for an input
  getFeedbackElement: function(input) {
    // Look for an existing feedback element
    let feedbackElement = input.nextElementSibling;
    
    if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
      // Create a new feedback element
      feedbackElement = document.createElement('div');
      feedbackElement.className = 'invalid-feedback';
      
      // Insert after the input
      if (input.nextElementSibling) {
        input.parentNode.insertBefore(feedbackElement, input.nextElementSibling);
      } else {
        input.parentNode.appendChild(feedbackElement);
      }
    }
    
    return feedbackElement;
  },
  
  // Validate an entire form
  validateForm: function(form) {
    let isValid = true;
    
    // Get all inputs in the form
    const inputs = form.querySelectorAll('input, select, textarea');
    
    // Validate each input
    inputs.forEach(input => {
      // Skip inputs that don't need validation
      if (!input.hasAttribute('required') && 
          !input.hasAttribute('data-validate') && 
          !input.hasAttribute('pattern')) {
        return;
      }
      
      // Validate the input and update the overall validity
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
};

// Initialize the form validation when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  FormValidation.init();
});
