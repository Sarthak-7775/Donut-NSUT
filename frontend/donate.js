// Donation form functionality
let currentStep = 1;
const totalSteps = 3;

// Category selection
document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    const typeInput = document.getElementById('type_of_donation');

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            categoryCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            typeInput.value = this.dataset.category;
        });
    });

    // Image upload functionality
    const imageInput = document.getElementById('image_upload');
    const imagePreview = document.getElementById('image_preview');
    const uploadPlaceholder = document.querySelector('.upload-placeholder');

    imageInput.addEventListener('change', handleImageUpload);

    function handleImageUpload(event) {
        const files = event.target.files;
        imagePreview.innerHTML = '';

        Array.from(files).forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <button type="button" class="remove-image" onclick="removeImage(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    imagePreview.appendChild(previewItem);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Auto-fill email based on NSUT ID
    const nsutIdInput = document.getElementById('nsut_id');
    const emailInput = document.getElementById('email');

    nsutIdInput.addEventListener('blur', function() {
        const nsutId = this.value.trim();
        if (nsutId && !emailInput.value) {
            if (nsutId.match(/^\d{4}[A-Z]{3}\d+$/)) {
                emailInput.value = `${nsutId.toLowerCase()}@nsut.ac.in`;
            } else if (nsutId.match(/^[A-Z]{3}\d+$/)) {
                emailInput.value = `${nsutId.toLowerCase()}@nsut.ac.in`;
            }
        }
    });
});

function removeImage(index) {
    const imageInput = document.getElementById('image_upload');
    const imagePreview = document.getElementById('image_preview');
    const files = Array.from(imageInput.files);
    
    files.splice(index, 1);
    
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    imageInput.files = dt.files;
    
    // Re-render preview
    imagePreview.innerHTML = '';
    files.forEach((file, i) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            previewItem.innerHTML = `
                <img src="${e.target.result}" alt="Preview ${i + 1}">
                <button type="button" class="remove-image" onclick="removeImage(${i})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            imagePreview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
    });
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById(`step${currentStep}`).classList.remove('active');
            currentStep++;
            document.getElementById(`step${currentStep}`).classList.add('active');
            updateProgressBar();
            
            if (currentStep === 3) {
                updateSummary();
            }
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        updateProgressBar();
    }
}

function updateProgressBar() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.focus();
            showFeedback('Please fill in all required fields.', 'error');
            return false;
        }
    }
    
    if (currentStep === 1 && !document.getElementById('type_of_donation').value) {
        showFeedback('Please select a donation category.', 'error');
        return false;
    }
    
    return true;
}

function updateSummary() {
    const formData = new FormData(document.getElementById('donationForm'));
    
    document.getElementById('summary_item').textContent = formData.get('item_name');
    document.getElementById('summary_category').textContent = formatCategory(formData.get('type_of_donation'));
    document.getElementById('summary_quantity').textContent = formData.get('quantity');
    document.getElementById('summary_condition').textContent = formatCondition(formData.get('condition'));
    document.getElementById('summary_description').textContent = formData.get('description');
    document.getElementById('summary_name').textContent = formData.get('donor_name');
    document.getElementById('summary_id').textContent = formData.get('nsut_id');
    document.getElementById('summary_role').textContent = formatRole(formData.get('donor_type'));
    document.getElementById('summary_email').textContent = formData.get('email');
}

function formatCategory(category) {
    const categories = {
        'books': 'Books',
        'clothes': 'Clothing',
        'electronics': 'Electronics',
        'stationery': 'Stationery',
        'food': 'Food Items',
        'other': 'Other'
    };
    return categories[category] || category;
}

function formatCondition(condition) {
    const conditions = {
        'new': 'New',
        'like-new': 'Like New',
        'good': 'Good',
        'fair': 'Fair',
        'poor': 'Poor but usable'
    };
    return conditions[condition] || condition;
}

function formatRole(role) {
    const roles = {
        'student': 'Student',
        'faculty': 'Faculty',
        'staff': 'Staff',
        'alumni': 'Alumni',
        'visitor': 'Visitor'
    };
    return roles[role] || role;
}

function showFeedback(message, type = 'info') {
    const feedback = document.getElementById('feedback');
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    if (type === 'success') {
        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
    }
}

// Enhanced form submission
document.getElementById('donationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!document.getElementById('terms').checked) {
        showFeedback('Please accept the terms and conditions.', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('.btn-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<div class="loading"></div> Processing...';
    submitBtn.disabled = true;
    
    const formData = new FormData(this);
    
    fetch('donate.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        showFeedback('Thank you! Your donation has been registered successfully. We will contact you soon for pickup arrangements.', 'success');
        
        // Reset form after successful submission
        setTimeout(() => {
            this.reset();
            currentStep = 1;
            document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
            document.getElementById('step1').classList.add('active');
            updateProgressBar();
            document.querySelectorAll('.category-card').forEach(card => card.classList.remove('selected'));
            document.getElementById('image_preview').innerHTML = '';
        }, 2000);
    })
    .catch(error => {
        console.error('Error:', error);
        showFeedback('Sorry, there was an error processing your donation. Please try again or contact support.', 'error');
    })
    .finally(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});
