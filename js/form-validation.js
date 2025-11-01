/*
 * Week 8 Assignment - Form Validation
 * Comprehensive form validation with real-time feedback
 */

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
        this.isValid = false;
        
        if (this.form) {
            this.initialize();
        }
    }
    
    initialize() {
        // Find all form fields
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            const fieldName = input.name;
            if (fieldName) {
                this.fields[fieldName] = input;
                this.errors[fieldName] = '';
                
                // Add real-time validation
                input.addEventListener('blur', () => this.validateField(fieldName));
                input.addEventListener('input', () => this.clearFieldError(fieldName));
            }
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.value.trim();
        let error = '';
        
        switch(fieldName) {
            case 'name':
                error = this.validateName(value);
                break;
            case 'email':
                error = this.validateEmail(value);
                break;
            case 'subject':
                error = this.validateSubject(value);
                break;
            case 'message':
                error = this.validateMessage(value);
                break;
            case 'password':
                error = this.validatePassword(value);
                break;
            case 'confirmPassword':
                error = this.validateConfirmPassword(value);
                break;
        }
        
        this.errors[fieldName] = error;
        this.displayFieldError(fieldName, error);
        
        return error === '';
    }
    
    validateName(name) {
        if (!name) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters';
        if (name.length > 50) return 'Name must be less than 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces';
        return '';
    }
    
    validateEmail(email) {
        if (!email) return 'Email is required';
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return 'Please enter a valid email address';
        
        return '';
    }
    
    validateSubject(subject) {
        if (!subject) return 'Subject is required';
        if (subject.length < 5) return 'Subject must be at least 5 characters';
        if (subject.length > 100) return 'Subject must be less than 100 characters';
        return '';
    }
    
    validateMessage(message) {
        if (!message) return 'Message is required';
        if (message.length < 10) return 'Message must be at least 10 characters';
        if (message.length > 1000) return 'Message must be less than 1000 characters';
        return '';
    }
    
    validatePassword(password) {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        
        const requirements = {
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        
        const missing = [];
        if (!requirements.uppercase) missing.push('uppercase letter');
        if (!requirements.lowercase) missing.push('lowercase letter');
        if (!requirements.number) missing.push('number');
        if (!requirements.special) missing.push('special character');
        
        if (missing.length > 0) {
            return `Password must contain at least one ${missing.join(', ')}`;
        }
        
        return '';
    }
    
    validateConfirmPassword(confirmPassword) {
        const password = this.fields['password']?.value;
        if (!confirmPassword) return 'Please confirm your password';
        if (confirmPassword !== password) return 'Passwords do not match';
        return '';
    }
    
    displayFieldError(fieldName, error) {
        const field = this.fields[fieldName];
        const errorElement = document.getElementById(`${fieldName}Error`) || this.createErrorElement(fieldName);
        
        if (error) {
            field.classList.add('error');
            errorElement.textContent = error;
            errorElement.style.display = 'block';
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    createErrorElement(fieldName) {
        const errorElement = document.createElement('span');
        errorElement.id = `${fieldName}Error`;
        errorElement.className = 'error-message';
        
        const field = this.fields[fieldName];
        field.parentNode.appendChild(errorElement);
        
        return errorElement;
    }
    
    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = document.getElementById(`${fieldName}Error`);
        
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }
    
    validateAll() {
        let isValid = true;
        
        for (const fieldName in this.fields) {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        }
        
        this.isValid = isValid;
        return isValid;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validateAll()) {
            this.showLoading();
            this.submitForm();
        } else {
            this.showError('Please fix the errors in the form');
        }
    }
    
    showLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
        }
        
        submitBtn.disabled = true;
    }
    
    hideLoading() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (btnText && btnLoading) {
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
        }
        
        submitBtn.disabled = false;
    }
    
    submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.showSuccess();
        }, 2000);
    }
    
    showSuccess() {
        const successElement = document.getElementById('formSuccess');
        if (successElement) {
            this.form.style.display = 'none';
            successElement.style.display = 'block';
            
            // Reset form after success
            setTimeout(() => {
                this.form.reset();
                this.form.style.display = 'block';
                successElement.style.display = 'none';
                
                // Clear all errors
                for (const fieldName in this.fields) {
                    this.clearFieldError(fieldName);
                }
            }, 5000);
        }
    }
    
    showError(message) {
        if (window.portfolioApp) {
            window.portfolioApp.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }
}

// Initialize form validation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        new FormValidator('contactForm');
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (validateNewsletterEmail(email)) {
                showNewsletterSuccess(this);
            }
        });
    }
});

function validateNewsletterEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNewsletterSuccess(form) {
    const originalHtml = form.innerHTML;
    form.innerHTML = `
        <div class="newsletter-success">
            <i class="fas fa-check-circle"></i>
            <p>Thank you for subscribing!</p>
        </div>
    `;
    
    setTimeout(() => {
        form.innerHTML = originalHtml;
        form.reset();
    }, 3000);
}

// Export for use in other modules
window.FormValidator = FormValidator;